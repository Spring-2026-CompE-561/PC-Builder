import Link from "next/link";

export default function NewBuildPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-20 text-green-400">
      {/* This page will hold the create-build flow next */}
      <section className="mx-auto max-w-3xl rounded-lg border border-green-900 bg-zinc-950 p-8">
        <p className="mb-4 text-sm tracking-widest text-green-700">
          &gt; new build route loaded...
        </p>

        <h1 className="mb-4 text-4xl font-bold text-green-300">
          Create New Build
        </h1>

        <p className="mb-8 text-green-700">
          This is where the build creation flow will go next.
        </p>

        <Link
          href="/builds"
          className="inline-block rounded border border-green-700 px-4 py-2 text-sm font-semibold text-green-400 transition-all hover:bg-green-950"
        >
          Back to Builds
        </Link>
      </section>
    </div>
  );
}
