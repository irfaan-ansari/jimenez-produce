import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { QuantityInput } from "./order-form";
import { formOpt } from "./order-form-options";
import { Button } from "@/components/ui/button";
import { withForm } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { CustomerProductType } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { DELIVERY_TIME } from "@/lib/constants/customer";
import { formatUSD, getAvatarFallback } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const OrderCart = withForm({
  ...formOpt,
  props: {} as {
    open: boolean;
    setOpen: (state: boolean) => void;
    updateItem: (args: {
      product: CustomerProductType;
      qty: number | string;
    }) => void;
  },
  render: function Render({ form, open, setOpen, updateItem }) {
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
          total: Number(values.charges.amount),
          subtotal: 0,
          lineItemCount: 0,
          lineItemQuantity: 0,
          lineItemTotal: 0,
        },
      );

      form.setFieldValue("total", String(result.total));
      form.setFieldValue("subtotal", String(result.subtotal));
      form.setFieldValue("lineItemCount", String(result.lineItemCount));
      form.setFieldValue("lineItemQuantity", String(result.lineItemQuantity));
      form.setFieldValue("lineItemTotal", String(result.lineItemTotal));
    }, [lineItems, form]);

    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="gap-0">
          <SheetHeader className="border-b gap-0">
            <SheetTitle className="text-lg font-semibold">Your cart</SheetTitle>
            <SheetDescription>
              {Number(values.lineItemCount ?? 0)} item
              {Number(values.lineItemCount ?? 0) > 1 ? "s" : ""} ready to submit
            </SheetDescription>
          </SheetHeader>
          <form.AppField name="lineItems" mode="array">
            {(field) => (
              <div className="no-scrollbar flex-1 overflow-y-auto p-4 space-y-2 gap-2">
                {field?.state?.value?.map((subField, i) => (
                  <div
                    className="p-4 rounded-2xl border bg-muted/50"
                    key={subField.productId}
                  >
                    <div className="flex items-start justify-start gap-3">
                      <Avatar className="size-10 shrink-0 rounded-lg ring-2 ring-green-600/20 ring-offset-1 **:rounded-xl after:hidden">
                        <AvatarImage src={subField?.image!} />
                        <AvatarFallback>
                          {getAvatarFallback(subField.title)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5 flex-1">
                        <h4 className="line-clamp-2 leading-tight font-semibold">
                          {subField.title}
                        </h4>

                        <p className="text-muted-foreground">564</p>
                        <QuantityInput
                          value={Number(subField.quantity)}
                          onChange={(qty) =>
                            updateItem({
                              product: {
                                ...subField,
                                id: subField.productId,
                              } as CustomerProductType,
                              qty,
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col justify-between self-stretch items-end">
                        <span className="font-semibold text-base">
                          {formatUSD(subField.total!)}
                        </span>
                        <Button
                          size="sm"
                          type="button"
                          variant="destructive"
                          className="text-xs h-6"
                          onClick={() =>
                            updateItem({
                              product: {
                                ...subField,
                                id: subField.productId,
                              } as CustomerProductType,
                              qty: 0,
                            })
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form.AppField>

          <Collapsible className="px-4 pt-4 border-t overflow-auto no-scrollbar">
            <CollapsibleTrigger className="flex w-full gap-4 rounded-xl bg-secondary px-4 py-2">
              Notes & Preferences
              <ChevronDown className="ml-auto size-4 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-4 pt-4">
              <form.AppField
                name="deliveryDate"
                children={(field) => <field.DateField label="Delivery Date" />}
              />
              <form.AppField
                name="deliveryWindow"
                children={(field) => (
                  <field.SelectField
                    options={DELIVERY_TIME}
                    label="Delivery Time"
                  />
                )}
              />
              <form.AppField
                name="po"
                children={(field) => {
                  return (
                    <field.TextField
                      label="PO / Reference"
                      className="**:rounded-xl"
                      placeholder="Optional"
                    />
                  );
                }}
              />

              <form.AppField
                name="deliveryInstruction"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Instructions</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value!}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="min-h-24 resize-none rounded-2xl"
                        placeholder="Optional notes..."
                      />

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </CollapsibleContent>
          </Collapsible>

          <SheetFooter className="gap-3 pt-3">
            <div className="bg-secondary rounded-2xl p-4 space-y-0.5">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatUSD(Number(values.subtotal))}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{values.charges.type}</span>
                <span>{formatUSD(Number(values.charges.amount))}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold mt-1">
                <span>Total</span>
                <span>{formatUSD(Number(values.total))}</span>
              </div>
            </div>
            <Button size="xl" className="rounded-xl">
              Submit Order • {formatUSD(Number(values.total))}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  },
});
