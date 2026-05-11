"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Build = {
  id: number;
  name: string;
  use_case: string | null;
  budget: number | null;
  total_cost: number;
  created_at: string;
};

export default function BuildsListPage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBuilds() {
      try {
        const data = await api.get<Build[]>("/builds");
        setBuilds(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not load builds.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadBuilds();
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 py-20 text-foreground">
      <section className="mx-auto max-w-5xl rounded-lg border border-border bg-card p-8">
        <p className="mb-4 text-sm tracking-widest text-muted-foreground">
          &gt; loading saved builds...
        </p>
        <h1 className="mb-4 text-4xl font-bold text-primary">Saved Builds</h1>
        <p className="mb-8 text-muted-foreground">
          Review your saved PC builds and jump back into any setup you want to keep working on.
        </p>

        {isLoading && (
          <p className="rounded border border-border bg-background p-4 text-muted-foreground">
            Loading your builds...
          </p>
        )}

        {!isLoading && error && (
          <div className="rounded-lg border border-red-900 bg-red-950/20 p-6">
            <h2 className="mb-2 text-xl font-semibold text-red-300">Could not load saved builds</h2>
            <p className="mb-4 text-sm text-red-200">
              Make sure the backend is running and that you are signed in, then try again.
            </p>
            <p className="mb-4 text-sm text-red-300/80">{error}</p>
            <Link href="/builds" className="inline-block rounded border border-red-700 px-4 py-2 text-sm font-semibold text-red-200 transition-all hover:bg-red-950/40">
              Back to Builds
            </Link>
          </div>
        )}

        {!isLoading && !error && builds.length === 0 && (
          <div className="rounded-lg border border-border bg-background p-6">
            <h2 className="mb-2 text-xl font-semibold text-foreground">No saved builds yet</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Once you create a build, it will show up here so you can come back and keep editing it.
            </p>
            <Link href="/builds/new" className="inline-block rounded border border-primary px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-accent">
              Create your first build
            </Link>
          </div>
        )}

        {!isLoading && !error && builds.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {builds.map((build) => (
              <Link
                key={build.id}
                href={`/builds/${build.id}`}
                className="block rounded-lg border border-border bg-background p-6 transition-all hover:border-primary hover:bg-accent"
              >
                <h2 className="mb-3 text-2xl font-semibold text-foreground">{build.name}</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><span className="font-semibold text-primary">Use case:</span> {build.use_case ?? "Not set"}</p>
                  <p><span className="font-semibold text-primary">Budget:</span> {build.budget ?? "Not set"}</p>
                  <p><span className="font-semibold text-primary">Total cost:</span> ${build.total_cost.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!error && (
          <div className="mt-8">
            <Link href="/builds" className="inline-block rounded border border-primary px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-accent">
              Back to Builds
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}