type PaginationControlsProps = {
  currentPage: number
  pageCount: number
  startItem: number
  endItem: number
  totalItems: number
  onPageChange: (page: number) => void
}

export const PaginationControls = ({
  currentPage,
  pageCount,
  startItem,
  endItem,
  totalItems,
  onPageChange,
}: PaginationControlsProps) => {
  if (totalItems === 0) {
    return null
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <div className="pagination-shell">
      <p className="pagination-summary">
        Showing {startItem}-{endItem} of {totalItems}
      </p>
      <div className="pagination-buttons">
        <button
          className="ghost-button"
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`filter-button ${page === currentPage ? 'is-active' : ''}`}
            type="button"
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="ghost-button"
          type="button"
          disabled={currentPage === pageCount}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
