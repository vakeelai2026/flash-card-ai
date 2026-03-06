import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { getDeckById } from '@/queries/decks';
import { getCardsByDeckId } from '@/queries/cards';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LayersIcon } from 'lucide-react';
import { PrintButton } from './print-button';
import { FlipCard } from './flip-card';

interface DeckPageProps {
  params: Promise<{ deckId: string }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { userId } = await auth();
  if (!userId) redirect('/');

  const { deckId } = await params;
  const id = parseInt(deckId, 10);
  if (isNaN(id)) notFound();

  const [deck, cards] = await Promise.all([
    getDeckById(id),
    getCardsByDeckId(id),
  ]);

  if (!deck) notFound();

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-card { break-inside: avoid; page-break-inside: avoid; }
          body { background: white; }
        }
      `}</style>

      <main className="container mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="no-print flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{deck.name}</h1>
                <Badge variant="secondary" className="gap-1 text-xs">
                  <LayersIcon className="size-3" />
                  {cards.length} {cards.length === 1 ? 'card' : 'cards'}
                </Badge>
              </div>
              {deck.description && (
                <p className="text-muted-foreground mt-1">{deck.description}</p>
              )}
            </div>
          </div>
          <PrintButton />
        </div>

        {/* Print-only header */}
        <div className="hidden print:block mb-6">
          <h1 className="text-2xl font-bold">{deck.name}</h1>
          {deck.description && (
            <p className="text-muted-foreground mt-1">{deck.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {cards.length} {cards.length === 1 ? 'card' : 'cards'}
          </p>
        </div>

        {/* Cards */}
        {cards.length === 0 ? (
          <div className="no-print flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center gap-4">
            <div className="rounded-full bg-muted p-4">
              <LayersIcon className="size-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-lg">No cards yet</p>
              <p className="text-muted-foreground text-sm mt-1">
                Add cards to this deck to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card, index) => (
              <FlipCard key={card.id} card={card} index={index} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
