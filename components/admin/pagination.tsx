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
    <div className="sticky bottom-4 z-2 mx-auto mt-auto flex w-full max-w-sm items-center justify-between rounded-2xl border-2 bg-white/90 p-4 text-sm text-muted-foreground backdrop-blur-2xl">
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
