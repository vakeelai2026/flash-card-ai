import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { cardsTable, decksTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function updateCard(
  cardId: number,
  data: { front: string; back: string },
) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Join through decks to verify ownership before updating
  const [card] = await db
    .select({ id: cardsTable.id })
    .from(cardsTable)
    .innerJoin(
      decksTable,
      and(eq(cardsTable.deckId, decksTable.id), eq(decksTable.clerkUserId, userId)),
    )
    .where(eq(cardsTable.id, cardId));

  if (!card) throw new Error('Card not found or access denied');

  await db
    .update(cardsTable)
    .set({ front: data.front, back: data.back, updatedAt: new Date() })
    .where(eq(cardsTable.id, cardId));
}

export async function deleteCard(cardId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Join through decks to verify ownership before deleting
  const [card] = await db
    .select({ id: cardsTable.id })
    .from(cardsTable)
    .innerJoin(
      decksTable,
      and(eq(cardsTable.deckId, decksTable.id), eq(decksTable.clerkUserId, userId)),
    )
    .where(eq(cardsTable.id, cardId));

  if (!card) throw new Error('Card not found or access denied');

  await db.delete(cardsTable).where(eq(cardsTable.id, cardId));
}

export async function getCardsByDeckId(deckId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Join through decks to ensure the user owns the deck
  return db
    .select({
      id: cardsTable.id,
      deckId: cardsTable.deckId,
      front: cardsTable.front,
      back: cardsTable.back,
      createdAt: cardsTable.createdAt,
      updatedAt: cardsTable.updatedAt,
    })
    .from(cardsTable)
    .innerJoin(
      decksTable,
      and(eq(cardsTable.deckId, decksTable.id), eq(decksTable.clerkUserId, userId)),
    )
    .where(eq(cardsTable.deckId, deckId))
    .orderBy(cardsTable.createdAt);
}
