import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) {
      range.push(i);
    }
    if (page - delta > 2) range.unshift("...");
    if (page + delta < pages - 1) range.push("...");
    range.unshift(1);
    if (pages > 1) range.push(pages);
    return range;
  };

  const btnBase =
    "w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors";
  const btnActive =
    "bg-indigo-500 text-white shadow-brand-sm";
  const btnInactive =
    "text-[#6b6b8a] dark:text-[#7777a0] hover:bg-[#e4e4ef] dark:hover:bg-[#2a2a45] hover:text-[#0f0f1a] dark:hover:text-[#ededff]";
  const btnDisabled =
    "text-[#c4c4d4] dark:text-[#3a3a55] cursor-not-allowed";

  return (
    <div className="flex items-center gap-1 justify-center mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`${btnBase} ${page === 1 ? btnDisabled : btnInactive}`}
      >
        <HiChevronLeft size={16} />
      </button>

      {getPageNumbers().map((p, i) =>
        p === "..." ? (
          <span key={`dot-${i}`} className="w-9 h-9 flex items-center justify-center text-[#6b6b8a] dark:text-[#7777a0] text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${btnBase} ${p === page ? btnActive : btnInactive}`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className={`${btnBase} ${page === pages ? btnDisabled : btnInactive}`}
      >
        <HiChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
