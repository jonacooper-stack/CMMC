/**
 * Vercel Blob client-upload token endpoint. The browser uploads file bytes
 * directly to Blob (bypassing the ~1MB Next function-body limit); this route
 * only mints a short-lived upload token. The document record + text extraction
 * happen later in the analyze step.
 */
import { auth } from "@clerk/nextjs/server";
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
        // Only signed-in users may mint an upload token. This check lives here —
        // not in proxy.ts — so the unauthenticated (but signature-verified)
        // blob.upload-completed webhook can still reach this route. This branch
        // only runs for the browser's token request, never for that callback.
        const { userId } = await auth();
        if (!userId) {
          throw new Error("You must be signed in to upload documents.");
        }
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
