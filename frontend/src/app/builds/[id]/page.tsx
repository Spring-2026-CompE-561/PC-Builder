import Link from "next/link";

type BuildDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BuildDetailsPage({
  params,
}: BuildDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-black px-4 py-20 text-green-400">
      {/* This page will hold the full build details flow later */}
      <section className="mx-auto max-w-5xl rounded-lg border border-green-900 bg-zinc-950 p-8">
        <p className="mb-4 text-sm tracking-widest text-green-700">
          &gt; build details route loaded...
        </p>

        <h1 className="mb-2 text-4xl font-bold text-green-300">
          Build Details
        </h1>

        <p className="mb-8 text-green-700">
          Viewing build #{id}. This is where the saved build breakdown will go.
        </p>

        <div className="mb-6 rounded-lg border border-green-900 bg-black p-6">
          <h2 className="mb-3 text-2xl font-semibold text-green-300">
            Build Summary
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded border border-green-900 bg-zinc-950 p-4">
              <p className="mb-1 text-xs uppercase tracking-widest text-green-700">
                Build ID
              </p>
              <p className="text-lg font-semibold text-green-300">#{id}</p>
            </div>

            <div className="rounded border border-green-900 bg-zinc-950 p-4">
              <p className="mb-1 text-xs uppercase tracking-widest text-green-700">
                Use Case
              </p>
              <p className="text-lg font-semibold text-green-300">
                Not connected yet
              </p>
            </div>

            <div className="rounded border border-green-900 bg-zinc-950 p-4">
              <p className="mb-1 text-xs uppercase tracking-widest text-green-700">
                Budget
              </p>
              <p className="text-lg font-semibold text-green-300">
                Not connected yet
              </p>
            </div>

            <div className="rounded border border-green-900 bg-zinc-950 p-4">
              <p className="mb-1 text-xs uppercase tracking-widest text-green-700">
                Total Cost
              </p>
              <p className="text-lg font-semibold text-green-300">
                Not connected yet
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-lg border border-green-900 bg-black p-6">
          <h2 className="mb-3 text-2xl font-semibold text-green-300">
            Selected Parts
          </h2>
        <div className="space-y-4">
            <div className="rounded border border-green-900 bg-zinc-950 p-4">
                <p className="mb-1 text-xs uppercase tracking-widest text-green-700">
                    CPU
                </p>
                <p className="text-lg font-semibold text-green-300">Not connected yet</p>
            </div>

            <div className="rounded border border-green-900 bg-zinc-950 p-4">
                <p className="mb-1 text-xs uppercase tracking-widest text-green-700">
                    GPU
                </p>
                <p className="text-lg font-semibold text-green-300">Not connected yet</p>
            </div>

            <div className="rounded border border-green-900 bg-zinc-950 p-4">
                <p className="mb-1 text-xs uppercase tracking-widest text-green-700">
                    Motherboard
                </p>
                <p className="text-lg font-semibold text-green-300">Not connected yet</p>
            </div>
        </div>

        </div>
                <div className="mb-8 rounded-lg border border-green-900 bg-black p-6">
          <h2 className="mb-3 text-2xl font-semibold text-green-300">
            Build Actions
          </h2>
          <p className="mb-4 text-sm text-green-700">
            Save and export options will connect to the backend later.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded border border-green-700 px-4 py-2 text-sm font-semibold text-green-400 transition-all hover:bg-green-950"
            >
              Save Build
            </button>

            <button
              type="button"
              className="rounded border border-green-700 px-4 py-2 text-sm font-semibold text-green-400 transition-all hover:bg-green-950"
            >
              Export Build
            </button>
          </div>
        </div>

        <Link
          href="/builds/list"
          className="inline-block rounded border border-green-700 px-4 py-2 text-sm font-semibold text-green-400 transition-all hover:bg-green-950"
        >
          Back to Saved Builds
        </Link>
      </section>
    </div>
  );
}
