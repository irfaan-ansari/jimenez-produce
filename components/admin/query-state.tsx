import { EmptyComponent, LoadingSkeleton } from "./placeholder-component";

type QueryStateProps = {
  isPending: boolean;
  isError: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function QueryState({
  isPending,
  isError,
  isEmpty,
  error,
  className,
  children,
}: QueryStateProps) {
  if (isPending) {
    return <LoadingSkeleton className={className} />;
  }

  if (isError) {
    return <EmptyComponent variant="error" title={error?.message} />;
  }

  if (isEmpty) {
    return (
      <EmptyComponent
        variant="empty"
        title="No data available"
        description=""
      />
    );
  }

  return children;
}
