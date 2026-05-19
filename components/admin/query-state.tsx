import { EmptyComponent, LoadingSkeleton } from "./placeholder-component";

type QueryStateProps = {
  isPending: boolean;
  isError: boolean;
  error?: Error | null;
  isEmpty: boolean;
  children: React.ReactNode;
};

export function QueryState({
  isPending,
  isError,
  isEmpty,
  error,
  children,
}: QueryStateProps) {
  if (isPending) {
    return <LoadingSkeleton />;
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
