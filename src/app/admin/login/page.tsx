import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Jaimin OS — Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const redirectTo = searchParams.redirect ?? "/admin";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0C0C0C] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 font-mono text-lg font-bold text-white">
            JP
          </span>
          <h1 className="mt-4 text-2xl font-semibold text-white">Jaimin OS</h1>
          <p className="mt-1 text-sm text-white/50">
            Sign in to your command center.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </main>
  );
}
