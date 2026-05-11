import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="bg-background px-4 py-20 text-foreground">
      <section className="mx-auto max-w-4xl space-y-6">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Privacy Policy
        </p>

        <h1 className="text-4xl font-bold">Your Data and Account Information</h1>

        <p className="text-muted-foreground">
          PC Builder stores account information needed to support authentication and
          save user builds. This includes basic profile information, login credentials,
          and build data that users create inside the app.
        </p>

        <p className="text-muted-foreground">
          We use this information only to provide core website functionality such as
          signing in, saving builds, listing saved builds, and viewing build details.
          We do not intentionally collect unnecessary personal information through the site.
        </p>

        <p className="text-muted-foreground">
          Because this is a course project, users should avoid entering sensitive
          personal information beyond what is required for testing the application.
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
