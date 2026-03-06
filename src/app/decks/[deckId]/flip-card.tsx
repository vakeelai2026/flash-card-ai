'use client';

import { useState, useTransition } from 'react';
import { Pencil, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { updateCardAction, deleteCardAction } from '@/actions/cards';

interface Card {
  id: number;
  deckId: number;
  front: string;
  back: string;
}

interface FlipCardProps {
  card: Card;
  index: number;
}

export function FlipCard({ card, index }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const [isPending, startTransition] = useTransition();

  function handleFlip() {
    setIsFlipped((prev) => !prev);
  }

  function handleEditOpen(e: React.MouseEvent) {
    e.stopPropagation();
    setFront(card.front);
    setBack(card.back);
    setEditOpen(true);
  }

  function handleDeleteOpen(e: React.MouseEvent) {
    e.stopPropagation();
    setDeleteOpen(true);
  }

  function handleSave() {
    if (!front.trim() || !back.trim()) return;
    startTransition(async () => {
      await updateCardAction({
        cardId: card.id,
        front: front.trim(),
        back: back.trim(),
        deckId: card.deckId,
      });
      setEditOpen(false);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteCardAction({ cardId: card.id, deckId: card.deckId });
      setDeleteOpen(false);
    });
  }

  return (
    <>
      {/* Flip card wrapper */}
      <div className="group relative h-48 [perspective:1000px] print-card cursor-pointer select-none">
        {/* Card number */}
        <span className="absolute top-2 left-3 z-10 text-xs text-muted-foreground">
          #{index + 1}
        </span>

        {/* Edit / Delete buttons */}
        <div
          className="no-print absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="icon"
            variant="secondary"
            className="size-7"
            onClick={handleEditOpen}
          >
            <Pencil className="size-3" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="size-7 hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleDeleteOpen}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>

        {/* Flip hint */}
        {!isFlipped && (
          <span className="no-print absolute bottom-2 right-3 z-10 text-[10px] text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
            click to flip
          </span>
        )}
        {isFlipped && (
          <span className="no-print absolute bottom-2 right-3 z-10 text-[10px] text-muted-foreground/60 group-hover:text-muted-foreground transition-colors flex items-center gap-1">
            <RotateCcw className="size-2.5" /> flip back
          </span>
        )}

        {/* Inner card with 3D flip */}
        <div
          className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          onClick={handleFlip}
        >
          {/* Front face */}
          <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl border bg-card flex flex-col justify-center items-center px-6 py-8 shadow-sm hover:shadow-md hover:border-primary/40 transition-shadow">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-medium">
              Front
            </p>
            <p className="text-base font-medium text-center leading-snug">
              {card.front}
            </p>
          </div>

          {/* Back face */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl border bg-muted/50 flex flex-col justify-center items-center px-6 py-8 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-medium">
              Back
            </p>
            <p className="text-base text-center leading-snug text-muted-foreground">
              {card.back}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="front">Front</Label>
              <Input
                id="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Question or term"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="back">Back</Label>
              <Textarea
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Answer or definition"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending || !front.trim() || !back.trim()}
            >
              {isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this card?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the card. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
