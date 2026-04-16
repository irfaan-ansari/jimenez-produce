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
import { Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formOpt } from "./order-form-options";
import { Button } from "@/components/ui/button";
import { withForm } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { CheckoutDialog } from "./checkout-dialog";
import { CustomerSelectType } from "@/lib/db/schema";
import { formatUSD, getAvatarFallback } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const OrderCart = withForm({
  ...formOpt,
  props: {
    customer: {} as CustomerSelectType,
    show: false as boolean,
  },
  render: function Render({ form, customer, show }) {
    const values = useStore(form.store, (state) => state.values);
    const { lineItems } = values;

    React.useEffect(() => {
      const result = lineItems.reduce(
        (acc, item) => {
          const price = Number(item.price || 0);
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
        },
      );

      form.setFieldValue(
        "total",
        String(result.total + Number(values.charges.amount)),
      );
      form.setFieldValue("subtotal", String(result.subtotal));
      form.setFieldValue("lineItemCount", String(result.lineItemCount));
      form.setFieldValue("lineItemQuantity", String(result.lineItemQuantity));
      form.setFieldValue("lineItemTotal", String(result.lineItemTotal));
    }, [lineItems, form]);

    if (!show) return null;

    return (
      <div className="sticky top-10 basis-[300px] -translate-y-10 pt-4">
        <Card className="h-[calc(100svh-40px)] gap-0 rounded-2xl border text-base shadow-none ring-0">
          <CardHeader className="border-b pb-4!">
            <CardTitle className="text-lg font-semibold">
              Order Summary
            </CardTitle>
          </CardHeader>
          <form.AppField name="lineItems" mode="array">
            {(field) =>
              field.state.value.length > 0 ? (
                <CardContent className="no-scrollbar flex-1 overflow-y-auto px-0 py-6">
                  {field?.state?.value?.map((subField, i) => (
                    <div
                      className="px-6 not-first:pt-3 not-last:border-b not-last:pb-3"
                      key={subField.productId}
                    >
                      <div className="flex items-center justify-start gap-2">
                        <Avatar className="size-10 shrink-0 rounded-xl ring-2 ring-green-600/20 ring-offset-1 **:rounded-xl after:hidden">
                          <Badge className="background-blur-sm absolute -top-2 -left-2 size-5 rounded-[100%] bg-primary/80">
                            {subField.quantity}
                          </Badge>
                          <AvatarImage src={subField?.image!} />
                          <AvatarFallback>
                            {getAvatarFallback(subField.title)}
                          </AvatarFallback>
                        </Avatar>

                        <h4 className="whitespace-wrap line-clamp-2 leading-tight">
                          {subField.title}
                        </h4>

                        <Badge
                          variant="secondary"
                          className="ml-auto h-6 shrink-0 rounded-xl text-sm font-semibold"
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
              )
            }
          </form.AppField>

          <CardFooter className="flex flex-col items-stretch border-t pt-4">
            <div className="space-y-0.5">
              <div className="flex justify-between">
                <span>Quantity (cs)</span>
                <span>{values.lineItemQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Line items</span>
                <span>{values.lineItemCount}</span>
              </div>
              <div className="flex justify-between">
                <span>{values.charges.type}</span>
                <span>{formatUSD(values.charges.amount)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Order Total</span>
                <span>{formatUSD(values.total)}</span>
              </div>
            </div>
            <CheckoutDialog
              form={form}
              trigger={
                <Button
                  className="mt-4 w-full rounded-xl"
                  size="xl"
                  disabled={!values.lineItems.length}
                  type="button"
                >
                  Checkout <span>•</span>
                  {formatUSD(values.total)}
                </Button>
              }
            />
          </CardFooter>
        </Card>
      </div>
    );
  },
});
