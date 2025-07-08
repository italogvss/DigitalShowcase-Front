import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage: number;
}

export const usePagination = <T>({ items, itemsPerPage }: UsePaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(0);

  const paginatedItems = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const goToNextPage = () => {
    const maxPage = Math.ceil(items.length / itemsPerPage) - 1;
    if (currentPage < maxPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const canGoNext = currentPage < Math.ceil(items.length / itemsPerPage) - 1;
  const canGoPrevious = currentPage > 0;

  return {
    paginatedItems,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
    currentPage
  };
};