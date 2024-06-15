import React from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const itemsPerPage = 10;
  const firstItemIndex = (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, totalPages * itemsPerPage);

  const handleClickPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClickNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-gray-500">
        Displaying {firstItemIndex} - {lastItemIndex} out of {totalPages * itemsPerPage}
      </div>
      <div className="flex space-x-2 items-center">
        <button
          className={`flex items-center text-gray-500 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleClickPrevious}
          disabled={currentPage === 1}
        >
          <BsChevronLeft className="mr-1" />
          Previous
        </button>
        {Array.from({ length: Math.min(3, totalPages) }, (_, index) => {
          const page = currentPage - 1 + index;
          return (
            <button
              key={page}
              className={`text-gray-500 ${currentPage === page + 1 ? 'font-bold' : ''}`}
              onClick={() => setCurrentPage(page + 1)}
            >
              {page + 1}
            </button>
          );
        })}
        <button
          className={`flex items-center text-gray-500 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleClickNext}
          disabled={currentPage === totalPages}
        >
          Next
          <BsChevronRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
