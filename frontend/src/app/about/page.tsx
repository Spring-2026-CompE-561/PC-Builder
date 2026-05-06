import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-background px-4 py-20 text-foreground">
      <section className="mx-auto max-w-4xl space-y-6">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          About PC Builder
        </p>

        <h1 className="text-4xl font-bold">Build Better PCs With Less Guesswork</h1>

        <p className="text-lg text-muted-foreground">
          PC Builder is a full-stack web application that helps users create custom
          computer builds based on their budget and use case. Users can sign up,
          sign in, generate guided builds, create manual builds from scratch, review
          saved builds, export build details, and delete builds they no longer want.
        </p>

        <p className="text-muted-foreground">
          The project uses Next.js, ShadCN, and Tailwind CSS on the frontend, with
          FastAPI and PostgreSQL on the backend. The goal is to make the PC building
          process more approachable for beginners while still being useful for more
          experienced users.
        </p>

        <Link
          href="/"
          className="inline-block rounded border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          Back to Home
        </Link>
      </section>
    </div>
  );
}
