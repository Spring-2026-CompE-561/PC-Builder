import Link from "next/link";

export default function NewBuildPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-20 text-green-400">
      {/* Entry page for creating a new build */}
      <section className="mx-auto max-w-5xl rounded-lg border border-green-900 bg-zinc-950 p-8">
        <p className="mb-4 text-sm tracking-widest text-green-700">
          &gt; new build route loaded...
        </p>

        <h1 className="mb-4 text-4xl font-bold text-green-300">
          Create New Build
        </h1>

        <p className="mb-10 max-w-2xl text-green-700">
          Choose how you want to start your next PC build. You can begin with a guided recommendation or continue with a more hands-on setup.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/"
            className="block rounded-lg border border-green-900 bg-black p-6 transition-all hover:border-green-500 hover:bg-green-950/30"
          >
            <h2 className="mb-3 text-2xl font-semibold text-green-300">
              Start with Recommendations
            </h2>
            <p className="text-sm leading-6 text-green-700">
              Use the guided builder from the home page to generate a PC build based on budget and use case.
            </p>
          </Link>

          <div className="rounded-lg border border-green-900 bg-black p-6">
            <h2 className="mb-3 text-2xl font-semibold text-green-300">
              Build from Scratch
            </h2>
            <p className="text-sm leading-6 text-green-700">
              Manual build creation will be connected here once the backend create-build flow is ready.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/builds"
            className="inline-block rounded border border-green-700 px-4 py-2 text-sm font-semibold text-green-400 transition-all hover:bg-green-950"
          >
            Back to Builds
          </Link>
        </div>
      </section>
    </div>
  );
}
