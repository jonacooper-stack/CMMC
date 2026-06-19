/**
 * Text extraction from uploaded policy documents. Runs in the Node serverless
 * runtime (the analyze route), not the browser. PDF via unpdf (serverless-safe,
 * no native deps), DOCX via mammoth, plain text via TextDecoder. Scanned/image
 * PDFs (no text layer) are reported as a clear error rather than silently empty.
 */
import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";
import { get } from "@vercel/blob";
import { fetchPublicDocument } from "./fetchPublic";

export type ExtractResult = { text: string; error?: string };

const PDF = "application/pdf";
const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export async function extractTextFromBuffer(
  filename: string,
  contentType: string | undefined,
  data: ArrayBuffer,
): Promise<ExtractResult> {
  const name = filename.toLowerCase();
  try {
    if (name.endsWith(".pdf") || contentType === PDF) {
      const pdf = await getDocumentProxy(new Uint8Array(data));
      const { text } = await extractText(pdf, { mergePages: true });
      const clean = (text ?? "").trim();
      return clean
        ? { text: clean }
        : { text: "", error: "No selectable text found — is this a scanned/image PDF?" };
    }
    if (name.endsWith(".docx") || contentType === DOCX) {
      const { value } = await mammoth.extractRawText({ buffer: Buffer.from(data) });
      const clean = (value ?? "").trim();
      return clean ? { text: clean } : { text: "", error: "No text found in the document." };
    }
    if (name.endsWith(".txt") || name.endsWith(".md") || contentType?.startsWith("text/")) {
      return { text: new TextDecoder().decode(data).trim() };
    }
    return { text: "", error: `Unsupported file type: ${filename}` };
  } catch (e) {
    return { text: "", error: e instanceof Error ? e.message : "Text extraction failed." };
  }
}

/** Fetch a stored (private) blob by URL and extract its text. */
export async function extractTextFromUrl(
  url: string,
  filename: string,
  contentType?: string,
): Promise<ExtractResult> {
  // Blobs are uploaded with private access, so read them back through the SDK
  // (which authenticates with BLOB_READ_WRITE_TOKEN) rather than a bare fetch.
  const result = await get(url, { access: "private" });
  if (!result || !result.stream) {
    return { text: "", error: "Could not fetch file from storage." };
  }
  const data = await new Response(result.stream).arrayBuffer();
  return extractTextFromBuffer(filename, contentType, data);
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", mdash: "—", ndash: "–",
  hellip: "…", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", copy: "©", reg: "®", trade: "™", deg: "°",
};

function decodeEntities(s: string): string {
  return s.replace(/&(#x?[0-9a-f]+|[a-z][a-z0-9]*);/gi, (match, ent: string) => {
    if (ent[0] === "#") {
      const code = /^#x/i.test(ent) ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10);
      if (!Number.isFinite(code)) return match;
      try {
        return String.fromCodePoint(code);
      } catch {
        return "";
      }
    }
    const named = NAMED_ENTITIES[ent.toLowerCase()];
    return named ?? match;
  });
}

/** Strip an HTML document down to readable text (no parser dependency). */
export function htmlToText(html: string): string {
  let s = html;
  s = s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ");
  s = s.replace(/<!--[\s\S]*?-->/g, " ");
  // Turn block-level boundaries into line breaks so structure survives.
  s = s.replace(/<\/(p|div|li|ul|ol|tr|table|h[1-6]|section|article|header|footer|nav)\s*>/gi, "\n");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<[^>]+>/g, " ");
  s = decodeEntities(s);
  s = s.replace(/[^\S\n]+/g, " "); // collapse spaces/tabs but keep newlines
  s = s.replace(/ *\n */g, "\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

function filenameFromUrl(url: string, contentType: string): string {
  let base = "document";
  try {
    const last = new URL(url).pathname.split("/").filter(Boolean).pop();
    if (last) base = last;
  } catch {
    /* keep default */
  }
  if (/\.(pdf|txt|md|docx)$/i.test(base)) return base;
  if (contentType.includes("pdf")) return `${base}.pdf`;
  return `${base}.txt`;
}

/** Fetch a public web URL (SSRF-guarded) and extract its readable text. */
export async function extractTextFromWebUrl(rawUrl: string): Promise<ExtractResult> {
  let fetched: Awaited<ReturnType<typeof fetchPublicDocument>>;
  try {
    fetched = await fetchPublicDocument(rawUrl);
  } catch (e) {
    return { text: "", error: e instanceof Error ? e.message : "Couldn't fetch that link." };
  }
  const { data, contentType, finalUrl } = fetched;

  let html = contentType.includes("html") || contentType.includes("xml");
  let pdf = contentType.includes("pdf");
  if (!html && !pdf && !contentType.includes("text/")) {
    // Server gave no usable content-type — sniff the first bytes.
    const head = new TextDecoder().decode(data.slice(0, 512)).trimStart().toLowerCase();
    if (head.startsWith("%pdf")) pdf = true;
    else if (head.startsWith("<!doctype html") || head.includes("<html")) html = true;
  }

  if (html) {
    const text = htmlToText(new TextDecoder().decode(data));
    return text ? { text } : { text: "", error: "We couldn't find readable text on that page." };
  }
  if (pdf) return extractTextFromBuffer("document.pdf", "application/pdf", data);
  return extractTextFromBuffer(filenameFromUrl(finalUrl, contentType), contentType, data);
}
