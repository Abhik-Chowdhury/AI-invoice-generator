import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-wrap justify-center items-center gap-2 ${className}`}>
      {/* PREVIOUS */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 text-sm rounded-md border
          ${currentPage === 1
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
      >
        Prev
      </button>

      {/* PAGE NUMBERS */}
      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm rounded-md border
              ${isActive
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
          >
            {page}
          </button>
        );
      })}

      {/* NEXT */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 text-sm rounded-md border
          ${currentPage === totalPages
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
