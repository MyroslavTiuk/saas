import { useState } from "react";

export function usePaginationParams({
  initialPageSize = 100,
  initialSortModel = [],
} = {}) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  // {field: xxx, sort: xxx}
  const [sortModel, setSortModel] = useState(initialSortModel);

  return {
    gridParams: {
      disableColumnFilter: true,
      pagination: true,
      page,
      onPageChange: setPage,
      pageSize,
      paginationMode: "server",
      onPageSizeChange: (newPageSize) => {
        setPage(0);
        setPageSize(newPageSize);
      },
      sortingMode: "server",
      sortModel,
      onSortModelChange: (newSortModel) => setSortModel(newSortModel),
    },
    queryParams: {
      offset: page * pageSize,
      limit: pageSize,
      order: sortModel.map(({ field, sort }) => [field, sort]),
    },
  };
}
