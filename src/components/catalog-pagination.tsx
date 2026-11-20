"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

interface CatalogPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

function getVisiblePages(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: Array<number | "ellipsis"> = [1]
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  if (start > 2) {
    pages.push("ellipsis")
  }
  for (let p = start; p <= end; p++) {
    pages.push(p)
  }
  if (end < totalPages - 1) {
    pages.push("ellipsis")
  }
  pages.push(totalPages)

  return pages
}

/**
 * Pagination client unifiee s'appuyant sur les primitives shadcn/ui Pagination.
 */
export function CatalogPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: CatalogPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const isFirst = currentPage <= 1
  const isLast = currentPage >= totalPages
  const pages = getVisiblePages(currentPage, totalPages)

  const handleSelect = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetPage: number,
    disabled = false
  ) => {
    e.preventDefault()
    if (disabled || targetPage === currentPage) return
    onPageChange(targetPage)
  }

  return (
    <Pagination className={cn("mt-10", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${Math.max(1, currentPage - 1)}`}
            aria-disabled={isFirst}
            tabIndex={isFirst ? -1 : undefined}
            className={isFirst ? "pointer-events-none opacity-50" : undefined}
            onClick={(e) => handleSelect(e, currentPage - 1, isFirst)}
          />
        </PaginationItem>

        {pages.map((item, idx) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href={`?page=${item}`}
                isActive={item === currentPage}
                onClick={(e) => handleSelect(e, item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href={`?page=${Math.min(totalPages, currentPage + 1)}`}
            aria-disabled={isLast}
            tabIndex={isLast ? -1 : undefined}
            className={isLast ? "pointer-events-none opacity-50" : undefined}
            onClick={(e) => handleSelect(e, currentPage + 1, isLast)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
