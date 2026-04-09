import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formOpt } from "./order-form-options";
import { withForm } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { CheckoutDialog } from "./checkout-dialog";
import { CustomerSelectType } from "@/lib/db/schema";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { formatUSD, getAvatarFallback, getNextDayDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ChevronDown, ShoppingBag, Truck } from "lucide-react";

export const OrderCart = withForm({
  ...formOpt,
  props: {
    customer: {} as CustomerSelectType,
  },
  render: function Render({ form, customer }) {
    const [open, setOpen] = React.useState(false);

    const values = useStore(form.store, (state) => state.values);
    const { lineItems } = values;

    React.useEffect(() => {
      if (!lineItems?.length) return;

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
      <Card className="rounded-2xl ring-0 gap-3 basis-md shadow-none border text-base h-[calc(100svh-80px)]">
        <CardHeader className="border-b px-3 -mt-3 [.border-b]:pb-3">
          <PopoverXDrawer
            open={open}
            setOpen={setOpen}
            trigger={
              <Button variant="ghost" className="h-auto p-3 gap-4 rounded-xl">
                <span className="inline-flex items-center justify-center shrink-0 size-10 bg-purple-500 rounded-xl">
                  <Truck className="size-4 text-white" />
                </span>
                <div className="flex flex-col items-start">
                  <span>{format(values.deliveryDate, "MMMM dd, yyyy")}</span>
                  <span className="text-sm text-muted-foreground">
                    {values.deliveryWindow}
                  </span>
                </div>
                <ChevronDown className="ml-auto shrink-0 size-4" />
              </Button>
            }
            className="data-[slot=popover-content]:max-w-(--radix-popper-anchor-width) data-[slot=popover-content]:w-(--radix-popper-anchor-width)"
          >
            {customer?.deliverySchedule?.map((sch, i) => (
              <Button
                variant="ghost"
                className="h-auto gap-4 pl-0"
                key={sch.day + sch.window + sch.receivingPhone}
                onClick={() => {
                  form.setFieldValue(
                    "deliveryDate",
                    format(sch.day, "MM-dd-yyyy")
                  ),
                    form.setFieldValue("deliveryWindow", sch.window);
                }}
              >
                <span className="inline-flex items-center justify-center  shrink-0 size-10 bg-purple-500 rounded-xl">
                  <Truck className="size-4 text-white" />
                </span>
                <div className="flex flex-col items-start">
                  <span>
                    {format(getNextDayDate(sch.day), "MMMM dd, yyyy")}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {sch.window}
                  </span>
                </div>
                <Check className="shrink-0 ml-auto" />
              </Button>
            ))}
          </PopoverXDrawer>
        </CardHeader>
        <CardContent className="flex-1 px-0 py-3 overflow-y-auto no-scrollbar">
          <form.AppField name="lineItems" mode="array">
            {(field) =>
              field?.state?.value.length ? (
                field?.state?.value?.map((subField, i) => (
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
                ))
              ) : (
                <div className="flex flex-col size-full items-center justify-center">
                  <ShoppingBag className="size-24 opacity-10" />
                </div>
              )
            }
          </form.AppField>
        </CardContent>

        <CardFooter className="flex flex-col items-stretch border-t pt-4!">
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
    );
  },
});
