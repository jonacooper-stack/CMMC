/**
 * Text extraction from uploaded policy documents. Runs in the Node serverless
 * runtime (the analyze route), not the browser. PDF via unpdf (serverless-safe,
 * no native deps), DOCX via mammoth, plain text via TextDecoder. Scanned/image
 * PDFs (no text layer) are reported as a clear error rather than silently empty.
 */
import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";

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

/** Fetch a stored blob by URL and extract its text. */
export async function extractTextFromUrl(
  url: string,
  filename: string,
  contentType?: string,
): Promise<ExtractResult> {
  const res = await fetch(url);
  if (!res.ok) return { text: "", error: `Could not fetch file (HTTP ${res.status}).` };
  const data = await res.arrayBuffer();
  return extractTextFromBuffer(filename, contentType, data);
}
