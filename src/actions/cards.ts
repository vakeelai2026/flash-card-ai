'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { updateCard, deleteCard } from '@/queries/cards';

const updateCardSchema = z.object({
  cardId: z.number().int().positive(),
  front: z.string().min(1, 'Front is required'),
  back: z.string().min(1, 'Back is required'),
  deckId: z.number().int().positive(),
});

const deleteCardSchema = z.object({
  cardId: z.number().int().positive(),
  deckId: z.number().int().positive(),
});

type UpdateCardInput = z.infer<typeof updateCardSchema>;
type DeleteCardInput = z.infer<typeof deleteCardSchema>;

export async function updateCardAction(data: UpdateCardInput) {
  const validated = updateCardSchema.parse(data);
  await updateCard(validated.cardId, {
    front: validated.front,
    back: validated.back,
  });
  revalidatePath(`/decks/${validated.deckId}`);
}

export async function deleteCardAction(data: DeleteCardInput) {
  const validated = deleteCardSchema.parse(data);
  await deleteCard(validated.cardId);
  revalidatePath(`/decks/${validated.deckId}`);
}
