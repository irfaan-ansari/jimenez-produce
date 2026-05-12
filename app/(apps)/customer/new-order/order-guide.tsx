import React from "react";

import { Plus } from "lucide-react";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { File } from "@duo-icons/react";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { useInfiniteOrderGuides } from "@/hooks/use-orders";
import { OrderGuideSelector } from "@/components/admin/order-guide-selector";

export const OrderGuideButton = () => {
  const { data, isError, isPending } = useInfiniteOrderGuides("");

  const { queryParams, searchParamsObj } = useRouterStuff();

  const totalRecord = React.useMemo(() => {
    return data?.pages?.[0]?.pagination?.total ?? 0;
  }, [data]);

  if (totalRecord <= 0 && !isPending && !isError)
    return (
      <Button
        size="xl"
        type="button"
        variant="secondary"
        className="rounded-lg bg-yellow-500 hover:bg-yellow-500/90 aria-expanded:bg-yellow-500/90 [&>svg]:size-5!"
      >
        <File /> New guide
      </Button>
    );

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
          <File /> Order Guide ({totalRecord})
        </Button>
      </OrderGuideSelector>
      <ButtonGroupSeparator />
      <Tooltip content="Create new guide">
        <Button
          size="icon-xl"
          type="button"
          variant="secondary"
          className="bg-yellow-500 hover:bg-yellow-500/90 aria-expanded:bg-yellow-500/90"
        >
          <Plus />
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
};
