import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { formOpt } from "./order-form-options";
import { withForm } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { CheckoutDialog } from "./checkout-dialog";
import { CustomerSelectType } from "@/lib/db/schema";
import { ChevronDown, Inbox } from "lucide-react";
import { formatUSD, getAvatarFallback } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const OrderCart = withForm({
  ...formOpt,
  props: {
    customer: {} as CustomerSelectType,
  },
  render: function Render({ form, customer }) {
    const values = useStore(form.store, (state) => state.values);
    const { lineItems } = values;

    React.useEffect(() => {
      const result = lineItems.reduce(
        (acc, item) => {
          //
          const price = Number(item.inventory.price || 0);
          const qty = Number(item.quantity || 0);

          acc.total += price * qty;
          acc.subtotal += price * qty;
          acc.lineItemCount += 1;
          acc.lineItemQuantity += qty;
          acc.lineItemTotal += price * qty;

          return acc;
        },
        {
          total: 0,
          subtotal: 0,
          lineItemCount: 0,
          lineItemQuantity: 0,
          lineItemTotal: 0,
        }
      );

      form.setFieldValue("total", String(result.total));
      form.setFieldValue("subtotal", String(result.subtotal));
      form.setFieldValue("lineItemCount", String(result.lineItemCount));
      form.setFieldValue("lineItemQuantity", String(result.lineItemQuantity));
      form.setFieldValue("lineItemTotal", String(result.lineItemTotal));
    }, [lineItems, form]);

    return (
      <Collapsible asChild>
        <Card className="rounded-2xl ring-0 gap-0 basis-sm shadow-none border text-base h-[calc(100svh-80px)] relative">
          <CardHeader className="px-0">
            <CollapsibleTrigger asChild>
              <CardTitle className="text-lg px-6 select-none font-semibold flex gap-4 justify-between data-[state=open]:[&>svg]:rotate-180 pb-6 data-[state=open]:border-b">
                Order Summary
                <ChevronDown className="size-5" />
              </CardTitle>
            </CollapsibleTrigger>
          </CardHeader>
          <form.AppField name="lineItems" mode="array">
            {(field) => (
              <CollapsibleContent asChild className="grow-0">
                {field.state.value.length > 0 ? (
                  <CardContent className="px-0 data-[state=open]:py-6 overflow-y-auto no-scrollbar">
                    {field?.state?.value?.map((subField, i) => (
                      <div
                        className="px-6 not-last:border-b not-first:pt-3 not-last:pb-3"
                        key={subField.productId}
                      >
                        <div className="flex gap-3 items-center justify-start">
                          <Avatar className="rounded-xl **:rounded-xl after:hidden size-10 ring-2 ring-offset-1 ring-green-600/20 shrink-0">
                            <Badge className="size-5 rounded-[100%] bg-blue-600/80 background-blur-sm absolute -top-2 -left-2">
                              {i + 1}
                            </Badge>
                            <AvatarImage src={subField?.image!} />
                            <AvatarFallback>
                              {getAvatarFallback(subField.title)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="space-y-1 flex-[1_1_0] ">
                            <h4 className="leading-tight">{subField.title}</h4>
                            {subField.quantity}
                          </div>
                          <Badge
                            variant="secondary"
                            className="rounded-xl shrink-0 h-6 bg-blue-100 text-blue-600 border border-blue-200 text-sm font-semibold"
                          >
                            {formatUSD(subField.total!)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon" className="rounded-xl">
                        <Inbox />
                      </EmptyMedia>
                      <EmptyTitle>Your cart is empty</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                )}
              </CollapsibleContent>
            )}
          </form.AppField>

          <CardFooter className="flex flex-col items-stretch border-t pt-4! pb-6">
            <div className="space-y-0.5">
              <div className="flex justify-between">
                <span>Quantity (cs)</span>
                <span>{values.lineItemQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Line items</span>
                <span>{values.lineItemCount}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Order Total</span>
                <span>{formatUSD(values.total)}</span>
              </div>
            </div>
            <CheckoutDialog form={form} />
          </CardFooter>
        </Card>
      </Collapsible>
    );
  },
});
