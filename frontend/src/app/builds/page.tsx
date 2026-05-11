import Link from "next/link";

export default function BuildsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border px-4 py-20 text-center">
        <p className="mb-4 text-sm tracking-widest text-muted-foreground">
          &gt; build manager online...
        </p>
        <h1 className="mb-4 text-4xl font-bold text-primary sm:text-5xl">Builds</h1>
        <p className="mx-auto mb-12 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Start a new PC build or jump back into one you already saved.
        </p>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Link
            href="/builds/new"
            className="block rounded-lg border border-border bg-card p-6 text-left shadow-lg transition-all hover:border-primary hover:bg-accent"
          >
            <h2 className="mb-3 text-2xl font-semibold text-foreground">Create New Build</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Start from scratch or continue from a generated recommendation.
            </p>
          </Link>
          <Link
            href="/builds/list"
            className="block rounded-lg border border-border bg-card p-6 text-left shadow-lg transition-all hover:border-primary hover:bg-accent"
          >
            <h2 className="mb-3 text-2xl font-semibold text-foreground">View Saved Builds</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Open an existing build, review parts, and keep editing.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}