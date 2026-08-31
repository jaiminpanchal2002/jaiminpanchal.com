export default function AdminLoading() {
  return (
    <div className="px-8 py-8">
      <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-white/5" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>
      <div className="mt-8 h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
    </div>
  );
}
