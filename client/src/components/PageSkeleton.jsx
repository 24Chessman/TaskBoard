// PageSkeleton props: variant ("board" | "cards" | "charts" | "rows" | "page", default "page"), label (screen-reader
// text, default "Loading"). Grey placeholder blocks in the shape of the page that is loading, so the layout does not
// jump when the data arrives. Pulses unless the user prefers reduced motion. Replaces a bare spinner on full pages.
const Bar = ({ className = '' }) => (
  <div className={`rounded bg-slate-200/80 motion-safe:animate-pulse ${className}`} />
);

const Box = ({ className = '', children }) => (
  <div className={`rounded-lg border border-line bg-surface p-4 ${className}`}>{children}</div>
);

const Lines = () => (
  <div className="space-y-2">
    <Bar className="h-4 w-3/4" />
    <Bar className="h-3 w-1/2" />
  </div>
);

const VARIANTS = {
  board: () => (
    <div className="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
      {[0, 1, 2, 3].map((column) => (
        <div
          key={column}
          className="flex min-h-[10rem] min-w-[280px] flex-1 flex-col gap-2 rounded-lg bg-slate-100/70 p-3 lg:min-w-0"
        >
          <Bar className="mb-1 h-4 w-24" />
          {[0, 1, 2].slice(0, 3 - (column % 2)).map((card) => (
            <Box key={card} className="p-3">
              <Lines />
            </Box>
          ))}
        </div>
      ))}
    </div>
  ),
  cards: () => (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((card) => (
        <Box key={card}>
          <div className="mb-3 flex items-center gap-3">
            <Bar className="h-9 w-9 rounded-md" />
            <Bar className="h-4 w-1/2" />
          </div>
          <Lines />
        </Box>
      ))}
    </div>
  ),
  charts: () => (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[0, 1, 2, 3, 4].map((card) => (
          <Box key={card}>
            <Bar className="h-3 w-1/2" />
            <Bar className="mt-3 h-6 w-1/3" />
          </Box>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1, 2, 3].map((card) => (
          <Box key={card} className="h-56 p-5">
            <Bar className="h-4 w-1/3" />
            <Bar className="mt-6 h-24 w-full" />
          </Box>
        ))}
      </div>
    </>
  ),
  rows: () => (
    <div className="space-y-3">
      {[0, 1, 2, 3, 4].map((row) => (
        <Box key={row} className="flex items-center gap-3">
          <Bar className="h-8 w-8 shrink-0 rounded-full" />
          <div className="w-full">
            <Lines />
          </div>
        </Box>
      ))}
    </div>
  ),
  page: () => (
    <Box className="p-5">
      <Bar className="h-5 w-1/3" />
      <div className="mt-4">
        <Lines />
      </div>
    </Box>
  ),
};

const PageSkeleton = ({ variant = 'page', label = 'Loading' }) => {
  const Body = VARIANTS[variant] || VARIANTS.page;
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">
        <Body />
      </div>
    </div>
  );
};

export default PageSkeleton;
