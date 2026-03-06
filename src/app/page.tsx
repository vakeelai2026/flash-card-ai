import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton, Show } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight">FlashyCardy</h1>
      <p className="text-lg text-muted-foreground">Your personal flashcard platform</p>
      <Show when="signed-out">
        <div className="flex gap-3 mt-2">
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button>Sign Up</Button>
          </SignUpButton>
        </div>
      </Show>
    </main>
  );
}
