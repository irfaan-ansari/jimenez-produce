import React from "react";

import { Plus, X } from "lucide-react";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { File } from "@duo-icons/react";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { useOrderUIStore } from "@/lib/store/order-store";
import { useInfiniteOrderGuides } from "@/hooks/use-orders";
import { OrderGuideSelector } from "@/components/admin/order-guide-selector";

export const OrderGuideButton = () => {
  const { queryParams, searchParamsObj } = useRouterStuff();
  const { data, isError, isPending } = useInfiniteOrderGuides("");

  const isSelecting = useOrderUIStore((s) => s.isSelecting);
  const setIsSelecting = useOrderUIStore((s) => s.setIsSelecting);

  const totalRecord = React.useMemo(() => {
    return data?.pages?.[0]?.pagination?.total ?? 0;
  }, [data]);

  if (isPending) {
    return <Skeleton className="h-11 bg-yellow-500 w-36" />;
  }

  if (isError || totalRecord <= 0) {
    return (
      <Button
        size="xl"
        type="button"
        variant="secondary"
        className="rounded-lg bg-yellow-500 hover:bg-yellow-500/90 aria-expanded:bg-yellow-500/90"
        onClick={() => setIsSelecting(!isSelecting)}
      >
        {isSelecting ? (
          <>
            <X /> Cancel
          </>
        ) : (
          <>
            <Plus /> New guide
          </>
        )}
      </Button>
    );
  }

  return (
    <ButtonGroup className="">
      <OrderGuideSelector
        value={searchParamsObj.guideId}
        onValueChange={(value) =>
          queryParams({ set: { guideId: String(value.id) } })
        }
      >
        <Button
          size="xl"
          type="button"
          variant="secondary"
          className="rounded-lg bg-yellow-500 hover:bg-yellow-500/90 aria-expanded:bg-yellow-500/90 [&>svg]:size-5!"
        >
          <File /> View guides ({totalRecord})
        </Button>
      </OrderGuideSelector>
      <ButtonGroupSeparator />

      <Tooltip content={isSelecting ? "Cancel" : "Create new guide"}>
        <Button
          size="icon-xl"
          type="button"
          className="bg-sidebar-accent hover:bg-sidebar-accent/90"
          onClick={() => setIsSelecting(!isSelecting)}
        >
          {isSelecting ? <X /> : <Plus />}
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
};
