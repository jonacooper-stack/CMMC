/**
 * Fetches a user-supplied public URL safely, for pulling in a policy that lives
 * on a website instead of being uploaded. This runs server-side, so it MUST be
 * hardened against SSRF: only http(s), no private / loopback / link-local /
 * cloud-metadata addresses, a byte cap, a timeout, and redirect hops that are
 * re-validated rather than blindly followed.
 *
 * Note: this checks the DNS-resolved addresses before fetching. It does not pin
 * the connection to those exact IPs, so it is a proportionate mitigation (good
 * for "let a user fetch their own public policy page"), not a guarantee against
 * a determined DNS-rebinding attacker.
 */
import { lookup } from "node:dns/promises";
import net from "node:net";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 4;
const ALLOWED_CONTENT = ["text/html", "application/xhtml+xml", "text/plain", "application/pdf"];

export type FetchedDocument = { data: ArrayBuffer; contentType: string; finalUrl: string };

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return true;
  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return true; // this-network, private, loopback
  if (a === 169 && b === 254) return true; // link-local incl. 169.254.169.254 metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // private
  if (a === 192 && b === 168) return true; // private
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a >= 224) return true; // multicast / reserved
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const norm = ip.toLowerCase().split("%")[0];
  if (norm === "::1" || norm === "::") return true; // loopback / unspecified
  if (norm.startsWith("fe80")) return true; // link-local
  if (norm.startsWith("fc") || norm.startsWith("fd")) return true; // unique local
  const mapped = norm.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/); // IPv4-mapped
  if (mapped) return isPrivateIPv4(mapped[1]);
  return false;
}

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) return isPrivateIPv4(ip);
  if (net.isIPv6(ip)) return isPrivateIPv6(ip);
  return true; // not a recognizable IP → treat as unsafe
}

async function assertPublicHost(hostname: string): Promise<void> {
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) throw new Error("That address isn't allowed.");
    return;
  }
  const resolved = await lookup(hostname, { all: true }).catch(() => []);
  if (!resolved.length) throw new Error("Couldn't resolve that web address.");
  for (const r of resolved) {
    if (isPrivateIp(r.address)) throw new Error("That host points to a private address, so we can't fetch it.");
  }
}

async function readCapped(res: Response): Promise<ArrayBuffer> {
  const reader = res.body?.getReader();
  if (!reader) {
    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) throw new Error("That document is too large (over 5 MB).");
    return buf;
  }
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel().catch(() => {});
      throw new Error("That document is too large (over 5 MB).");
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.byteLength;
  }
  return out.buffer as ArrayBuffer;
}

/** Fetch a public http(s) document, guarding against SSRF. Throws on any failure. */
export async function fetchPublicDocument(rawUrl: string): Promise<FetchedDocument> {
  let current = rawUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const url = new URL(current);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Only http and https links are supported.");
    }
    await assertPublicHost(url.hostname);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(url, {
        redirect: "manual", // re-validate each hop ourselves (Node/undici exposes Location)
        signal: controller.signal,
        headers: {
          "user-agent": "MusterPolicyBot/1.0",
          accept: "text/html,application/xhtml+xml,application/pdf,text/plain;q=0.9,*/*;q=0.5",
        },
      });
    } catch (e) {
      throw new Error(
        controller.signal.aborted
          ? "Fetching that link timed out."
          : `Couldn't reach that link: ${e instanceof Error ? e.message : "unknown error"}.`,
      );
    } finally {
      clearTimeout(timeout);
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) throw new Error("That link redirected without a destination.");
      current = new URL(location, url).toString();
      continue;
    }
    if (!res.ok) throw new Error(`That site returned HTTP ${res.status}.`);

    const contentType = (res.headers.get("content-type") || "").toLowerCase();
    const typeOk = contentType === "" || ALLOWED_CONTENT.some((t) => contentType.includes(t));
    if (!typeOk) {
      throw new Error(
        `That link is a ${contentType.split(";")[0] || "kind of file"} we can't read. Link to a web page, PDF, or text file.`,
      );
    }

    const data = await readCapped(res);
    return { data, contentType, finalUrl: url.toString() };
  }
  throw new Error("That link redirected too many times.");
}
