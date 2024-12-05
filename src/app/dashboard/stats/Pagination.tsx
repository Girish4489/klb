interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

const Pagination = ({ totalItems, itemsPerPage, currentPage, paginate }: PaginationProps) => {
  const pageNumbers = Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, index) => index + 1);

  return (
    <span className="flex w-full justify-center">
      <div className="join bg-base-300 pt-1.5">
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`btn btn-square join-item btn-sm ${currentPage === number ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => paginate(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </span>
  );
};

export default Pagination;
