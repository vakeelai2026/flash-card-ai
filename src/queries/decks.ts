import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { decksTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function getUserDecks() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  return db
    .select()
    .from(decksTable)
    .where(eq(decksTable.clerkUserId, userId))
    .orderBy(decksTable.createdAt);
}

export async function getDeckById(deckId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const [deck] = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.clerkUserId, userId)));

  return deck ?? null;
}
