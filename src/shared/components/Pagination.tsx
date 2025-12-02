"use client";

interface PaginateProps {
  totalRegisters?: number;
  registersPrePage?: number;
  register?: number;
  currentPage?: number;
  perPage?: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

const siblingsCount = 2;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => from + index + 1)
    .filter(page => page > 0);
}

export function Paginate({
  onPageChange,
  totalRegisters = 0,
  currentPage = 1,
  registersPrePage = 10,
  perPage,
  register = registersPrePage,
  itemLabel = "itens"
}: PaginateProps) {
  const lastPage = perPage || Math.ceil(totalRegisters / registersPrePage);

  // Don't show pagination if there's only one page or no pages
  //if (lastPage <= 1) return null;

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
        currentPage,
        Math.min(currentPage + siblingsCount, lastPage)
      )
      : [];

  const startItem = registersPrePage * (currentPage - 1) + 1;
  const endItem = registersPrePage * currentPage - (registersPrePage - register);

  return (
    <div className=" flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-600">
        <span className="font-semibold text-slate-900">{startItem}</span> -{" "}
        <span className="font-semibold text-slate-900">{endItem}</span> de{" "}
        <span className="font-semibold text-slate-900">{totalRegisters}</span> {itemLabel}
      </div>

      <div className="flex items-center gap-1">
        {/* First Page - only show if far from beginning */}
        {currentPage > 1 + siblingsCount && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="min-w-10 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            >
              1
            </button>
            {currentPage > 2 + siblingsCount && (
              <span className="px-2 text-slate-400">...</span>
            )}
          </>
        )}

        {/* Previous Pages */}
        {previousPages.length > 0 &&
          previousPages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className="min-w-10 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            >
              {page}
            </button>
          ))}

        {/* Current Page */}
        <button
          className="min-w-10 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-indigo-600 text-white"
          disabled
        >
          {currentPage}
        </button>

        {/* Next Pages */}
        {nextPages.length > 0 &&
          nextPages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className="min-w-10 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            >
              {page}
            </button>
          ))}

        {/* Last Page - only show if far from end */}
        {currentPage + siblingsCount < lastPage && (
          <>
            {currentPage + 1 + siblingsCount < lastPage && (
              <span className="px-2 text-slate-400">...</span>
            )}
            <button
              onClick={() => onPageChange(lastPage)}
              className="min-w-10 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            >
              {lastPage}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
