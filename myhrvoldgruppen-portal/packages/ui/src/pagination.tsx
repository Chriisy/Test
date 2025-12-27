import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const showPages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  const endPage = Math.min(totalPages, startPage + showPages - 1);

  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const getPageUrl = (page: number) => {
    if (!baseUrl) return "#";
    const url = new URL(baseUrl, "http://localhost");
    url.searchParams.set("page", page.toString());
    return `${url.pathname}${url.search}`;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <a href={getPageUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </a>
        ) : (
          <span><ChevronLeft className="h-4 w-4" /></span>
        )}
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          asChild={page !== currentPage}
        >
          {page === currentPage ? (
            <span>{page}</span>
          ) : (
            <a href={getPageUrl(page)}>{page}</a>
          )}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <a href={getPageUrl(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </a>
        ) : (
          <span><ChevronRight className="h-4 w-4" /></span>
        )}
      </Button>
    </div>
  );
}
