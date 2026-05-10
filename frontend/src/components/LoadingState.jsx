const shimmerRows = Array.from({ length: 9 }, (_, index) => index);

const LoadingState = () => (
  <div className="space-y-5">
    <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
      <div className="h-5 w-44 animate-pulse rounded bg-slate-200" />
      <div className="mt-5 space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-8/12 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      {shimmerRows.slice(0, 4).map((row) => (
        <div key={row} className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-20 animate-pulse rounded bg-slate-100" />
        </div>
      ))}
    </div>
  </div>
);

export default LoadingState;
