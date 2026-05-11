import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>PC Builder helps users generate, save, and review custom PC builds.</p>

        <div className="flex items-center gap-4">
          <Link href="/about" className="transition-colors hover:text-foreground">
            About
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
