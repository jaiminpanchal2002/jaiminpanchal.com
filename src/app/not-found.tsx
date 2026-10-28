import Link from "next/link";
import { buttonClass } from "@/components/ui/styles";

// Root-level 404 (renders outside the site chrome, so it carries its own minimal navigation).
export default function NotFound() {
  return (
    <main className="grain relative grid min-h-[100dvh] place-items-center overflow-hidden px-6">
      <div className="relative max-w-4xl text-center">
        <p className="font-display tabular-nums text-sm text-fg-3">404</p>
        <h1 className="display mt-4 text-[length:var(--step-5)] text-balance">This system doesn&apos;t exist.</h1>
        <p className="mt-6 text-fg-2">The page may have moved, or it hasn&apos;t been published yet.</p>
        <nav aria-label="Recovery" className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonClass("primary")}>Back home</Link>
          <Link href="/work" className={buttonClass("secondary")}>Work</Link>
          <Link href="/contact" className={buttonClass("secondary")}>Contact</Link>
        </nav>
      </div>
    </main>
  );
}
