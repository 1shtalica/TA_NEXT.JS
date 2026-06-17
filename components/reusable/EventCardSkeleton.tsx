export default function EventCardSkeleton() {
  return (
    <div className="h-full flex flex-col overflow-hidden rounded-3xl bg-white border shadow-sm">
      <div className="w-full aspect-video bg-slate-200 animate-pulse" />
      <div className="flex flex-col p-4 gap-3">
        <div className="flex gap-4">
          <div className="w-14 h-[68px] rounded-xl bg-slate-200 animate-pulse shrink-0" />
          <div className="flex flex-col gap-2 w-full">
            <div className="h-3 w-1/3 bg-slate-200 animate-pulse rounded" />
            <div className="h-4 w-full bg-slate-200 animate-pulse rounded" />
            <div className="h-4 w-4/5 bg-slate-200 animate-pulse rounded" />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="h-4 w-20 bg-slate-200 animate-pulse rounded" />
          <div className="h-4 w-12 bg-slate-200 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
