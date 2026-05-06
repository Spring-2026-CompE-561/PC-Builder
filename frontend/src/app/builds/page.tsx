import Link from "next/link";

export default function BuildsPage() {
  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Main entry point for the user's build flow */}
      <section className="border-b border-green-900 px-4 py-20 text-center">
        <p className="mb-4 text-sm tracking-widest text-green-700">
          &gt; build manager online...
        </p>

        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Builds</h1>

        <p className="mx-auto mb-12 max-w-2xl text-base text-green-700 sm:text-lg">
          Start a new PC build or jump back into one you already saved.
        </p>

        {/* Main routes for the build section */}
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Link
            href="/builds/new"
            className="block rounded-lg border border-green-900 bg-zinc-950 p-6 text-left shadow-lg transition-all hover:border-green-500 hover:bg-green-950/30"
          >
            <h2 className="mb-3 text-2xl font-semibold text-green-300">
              Create New Build
            </h2>
            <p className="text-sm leading-6 text-green-700">
              Start from scratch or continue from a generated recommendation.
            </p>
          </Link>

          <Link
            href="/builds/list"
            className="block rounded-lg border border-green-900 bg-zinc-950 p-6 text-left shadow-lg transition-all hover:border-green-500 hover:bg-green-950/30"
          >
            <h2 className="mb-3 text-2xl font-semibold text-green-300">
              View Saved Builds
            </h2>
            <p className="text-sm leading-6 text-green-700">
              Open an existing build, review parts, and keep editing.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
