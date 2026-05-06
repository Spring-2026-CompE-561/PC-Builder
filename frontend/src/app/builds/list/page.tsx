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

// Load saved builds once the page opens
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
        const message =
          err instanceof Error ? err.message : "Could not load builds.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadBuilds();
  }, []);

  return (
    <div className="min-h-screen bg-black px-4 py-20 text-green-400">
      <section className="mx-auto max-w-5xl rounded-lg border border-green-900 bg-zinc-950 p-8">
        <p className="mb-4 text-sm tracking-widest text-green-700">
          &gt; loading saved builds...
        </p>

        <h1 className="mb-4 text-4xl font-bold text-green-300">
          Saved Builds
        </h1>

        <p className="mb-8 text-green-700">
          Review your saved PC builds and jump back into any setup you want to keep working on.
        </p>

        {isLoading && (
          <p className="rounded border border-green-900 bg-black p-4 text-green-700">
            Loading your builds...
          </p>
        )}

        {!isLoading && error && (
          <div className="rounded-lg border border-red-900 bg-red-950/20 p-6">
            <h2 className="mb-2 text-xl font-semibold text-red-300">
              Could not load saved builds
            </h2>
            <p className="mb-4 text-sm text-red-200">
              Make sure the backend is running and that you are signed in, then try again.
            </p>
            <p className="mb-4 text-sm text-red-300/80">{error}</p>
            <Link
              href="/builds"
              className="inline-block rounded border border-red-700 px-4 py-2 text-sm font-semibold text-red-200 transition-all hover:bg-red-950/40"
            >
              Back to Builds
            </Link>
          </div>
        )}


        {!isLoading && !error && builds.length === 0 && (
          <div className="rounded-lg border border-green-900 bg-black p-6">
            <h2 className="mb-2 text-xl font-semibold text-green-300">
              No saved builds yet
            </h2>
            <p className="mb-4 text-sm text-green-700">
              Once you create a build, it will show up here so you can come back and keep editing it.
            </p>
            <Link
              href="/builds/new"
              className="inline-block rounded border border-green-700 px-4 py-2 text-sm font-semibold text-green-400 transition-all hover:bg-green-950"
            >
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
                className="block rounded-lg border border-green-900 bg-black p-6 transition-all hover:border-green-500 hover:bg-green-950/30"
              >
                <h2 className="mb-3 text-2xl font-semibold text-green-300">
                  {build.name}
                </h2>

                <div className="space-y-2 text-sm text-green-700">
                  <p>
                    <span className="font-semibold text-green-400">Use case:</span>{" "}
                    {build.use_case ?? "Not set"}
                  </p>
                  <p>
                    <span className="font-semibold text-green-400">Budget:</span>{" "}
                    {build.budget ?? "Not set"}
                  </p>
                  <p>
                    <span className="font-semibold text-green-400">Total cost:</span>{" "}
                    ${build.total_cost.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!error && (
          <div className="mt-8">
            <Link
              href="/builds"
              className="inline-block rounded border border-green-700 px-4 py-2 text-sm font-semibold text-green-400 transition-all hover:bg-green-950"
            >
              Back to Builds
            </Link>
          </div>
        )}

      </section>
    </div>
  );
}
