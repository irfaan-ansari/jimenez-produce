import { Button } from "../ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) => {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="border bg-neutral-50 backdrop-blur-2xl sticky bottom-4 max-w-sm w-full mx-auto p-4 rounded-2xl flex items-center justify-between mt-auto text-sm text-muted-foreground">
      <span>
        Viewing {start}–{end} of {total}
      </span>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={() => onPageChange(Number(page) + 1)}
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
