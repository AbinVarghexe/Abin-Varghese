interface ProjectsLoadingStateProps {
  detail?: boolean;
}

function ShimmerBlock({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-[24px] bg-[linear-gradient(110deg,rgba(228,231,238,0.9),rgba(244,245,247,1),rgba(228,231,238,0.9))] bg-[length:200%_100%] ${className}`}
    />
  );
}

export default function ProjectsLoadingState({
  detail = false,
}: ProjectsLoadingStateProps) {
  if (detail) {
    return (
      <main className="min-h-screen bg-[#f8f5f2] px-3 pb-14 pt-24 sm:px-5 lg:px-8">
        <div className="mx-auto w-[min(100%,1360px)] space-y-6">
          <ShimmerBlock className="h-10 w-28 rounded-xl" />

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="space-y-5 xl:col-span-8">
              <ShimmerBlock className="h-[360px] w-full rounded-xl md:h-[520px]" />
              <div className="rounded-xl border border-black/10 bg-white p-5">
                <ShimmerBlock className="h-3 w-36 rounded-md" />
                <ShimmerBlock className="mt-4 h-10 w-3/4 rounded-xl" />
                <ShimmerBlock className="mt-5 h-4 w-full rounded-md" />
                <ShimmerBlock className="mt-3 h-4 w-[92%] rounded-md" />
                <ShimmerBlock className="mt-3 h-4 w-[78%] rounded-md" />
              </div>
            </div>

            <aside className="space-y-4 xl:col-span-4">
              <ShimmerBlock className="h-44 w-full rounded-xl" />
              <ShimmerBlock className="h-36 w-full rounded-xl" />
              <ShimmerBlock className="h-40 w-full rounded-xl" />
            </aside>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <ShimmerBlock className="h-7 w-40 rounded-lg" />
              <ShimmerBlock className="h-4 w-44 rounded-md" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-xl border border-black/10 bg-white p-0">
                  <ShimmerBlock className="h-44 w-full rounded-none" />
                  <div className="space-y-3 p-4">
                    <ShimmerBlock className="h-5 w-2/3 rounded-md" />
                    <ShimmerBlock className="h-4 w-full rounded-md" />
                    <ShimmerBlock className="h-4 w-4/5 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5f2]">
      <section className="relative isolate border-y border-black/10 bg-[#f8f5f2]">
        <div className="mx-auto w-full max-w-[1540px] px-3 py-4 md:px-5 md:py-6">
          <ShimmerBlock className="h-[330px] w-full rounded-[28px] sm:h-[385px] md:h-[475px] lg:h-[535px]" />
        </div>
      </section>

      <section className="relative overflow-hidden py-14 md:py-20">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-8 px-3 md:gap-14 md:px-5">
          <div className="space-y-4 text-center">
            <ShimmerBlock className="mx-auto h-7 w-28 rounded-xl" />
            <ShimmerBlock className="mx-auto h-14 w-[min(92vw,560px)] rounded-[28px]" />
            <ShimmerBlock className="mx-auto h-5 w-[min(92vw,720px)] rounded-xl" />
          </div>

          <div className="flex flex-col gap-6 md:gap-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <ShimmerBlock key={index} className="h-[320px] w-full rounded-[32px]" />
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_20px_45px_rgba(10,10,10,0.08)] md:p-8">
            <div className="grid grid-cols-12 gap-4 auto-rows-[210px] md:auto-rows-[220px] xl:auto-rows-[240px]">
              {Array.from({ length: 6 }).map((_, index) => (
                <ShimmerBlock
                  key={index}
                  className={
                    index === 0
                      ? "col-span-12 row-span-2 h-full rounded-[28px] md:col-span-8"
                      : "col-span-12 h-full rounded-[28px] sm:col-span-6 md:col-span-4"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
