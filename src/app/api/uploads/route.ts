/**
 * Vercel Blob client-upload token endpoint. The browser uploads file bytes
 * directly to Blob (bypassing the ~1MB Next function-body limit); this route
 * only mints a short-lived upload token. The document record + text extraction
 * happen later in the analyze step.
 */
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
];

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB per file

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Blob storage is not configured. Create a Blob store in Vercel → Storage and redeploy (it sets BLOB_READ_WRITE_TOKEN).",
      },
      { status: 503 },
    );
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // TODO (Clerk step): require an authenticated account before minting a
        // token, and stamp the accountId into tokenPayload.
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // No-op: the document record + text extraction run in the analyze step
        // (onUploadCompleted isn't reliably reachable from localhost dev).
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 400 },
    );
  }
}
