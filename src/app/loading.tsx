export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#f0c6c6] border-t-[color:var(--accent)]" />
      <p className="text-sm font-semibold text-[color:var(--primary)]">Loading the table...</p>
    </div>
  );
}
