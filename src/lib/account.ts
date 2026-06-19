/**
 * Resolves the current Clerk principal to an `accounts` row (find-or-create).
 * The accountId is always derived server-side from Clerk — never trusted from
 * client input — which is the basis of tenant isolation in the DAL.
 */
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { accounts } from "./db/schema";

export type Account = typeof accounts.$inferSelect;

/** Find-or-create the account for the signed-in Clerk principal (org preferred, else user). */
export async function getCurrentAccount(): Promise<Account | null> {
  const { userId, orgId } = await auth();
  if (!userId) return null;

  const db = getDb();
  const column = orgId ? accounts.clerkOrgId : accounts.clerkUserId;
  const key = orgId ?? userId;

  const existing = await db.select().from(accounts).where(eq(column, key)).limit(1);
  if (existing.length) return existing[0];

  const [created] = await db
    .insert(accounts)
    .values(orgId ? { clerkOrgId: orgId, clerkUserId: userId } : { clerkUserId: userId })
    .returning();
  return created;
}

export async function requireAccount(): Promise<Account> {
  const account = await getCurrentAccount();
  if (!account) throw new Error("Unauthorized");
  return account;
}
