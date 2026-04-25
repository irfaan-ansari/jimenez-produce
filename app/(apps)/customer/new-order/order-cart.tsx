import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { QuantityInput } from "./order-form";
import { Button } from "@/components/ui/button";
import { withForm } from "@/hooks/form-context";
import { ChevronDown, Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { DELIVERY_TIME } from "@/lib/constants/customer";
import { formOpt, getTotals } from "./order-form-options";
import { formatUSD, getAvatarFallback } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const OrderCart = withForm({
  ...formOpt,

  render: function Render({ form }) {
    const [open, setOpen] = React.useState(false);

    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            className="ml-auto rounded-xl text-foreground"
            size="lg"
            variant="link"
            type="button"
          >
            {open ? "Hide Cart" : "View Cart"}
          </Button>
        </SheetTrigger>
        <form.Subscribe
          selector={({ values }) => ({
            lineItems: values.lineItems,
          })}
          children={({ lineItems }) => {
            const totals = getTotals(lineItems);
            return (
              <SheetContent className="gap-0">
                <SheetHeader className="gap-0 border-b">
                  <SheetTitle className="text-lg font-semibold">
                    Your cart
                  </SheetTitle>
                  <SheetDescription>
                    {Number(totals.count ?? 0)} item
                    {Number(totals.count ?? 0) > 1 ? "s" : ""} ready to submit
                  </SheetDescription>
                </SheetHeader>
                <form.AppField name="lineItems" mode="array">
                  {(field) => (
                    <div className="no-scrollbar flex-1 gap-2 space-y-2 overflow-y-auto p-4">
                      {field?.state?.value?.map((subField, i) => (
                        <div
                          className="rounded-2xl border bg-muted/50 p-4"
                          key={i}
                        >
                          <div className="flex items-start justify-start gap-3">
                            <Avatar className="size-8 shrink-0 rounded-lg ring-2 ring-green-600/20 ring-offset-1 **:rounded-lg after:hidden">
                              <AvatarImage src={subField?.image!} />
                              <AvatarFallback>
                                {getAvatarFallback(subField.title)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="grid flex-1 gap-0.5">
                              <h4 className="line-clamp-2 leading-tight font-semibold">
                                {subField.title}
                              </h4>

                              <p className="text-muted-foreground">564</p>

                              <form.Field
                                name={`lineItems[${i}].quantity`}
                                children={(subField) => (
                                  <QuantityInput
                                    value={Number(subField.state.value)}
                                    onChange={(qty) => {
                                      if (qty === 0) {
                                        field.removeValue(i);
                                        return;
                                      }

                                      subField.handleChange(String(qty));
                                    }}
                                  />
                                )}
                              />
                            </div>
                            <div className="flex flex-col items-end justify-between self-stretch">
                              <span className="text-base font-semibold">
                                {formatUSD(subField.total!)}
                              </span>
                              <Button
                                size="sm"
                                type="button"
                                variant="destructive"
                                className="h-6 text-xs"
                                onClick={() => field.removeValue(i)}
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

                <Collapsible className="no-scrollbar overflow-auto border-t px-4 pt-4">
                  <CollapsibleTrigger className="flex w-full gap-4 rounded-xl bg-secondary px-4 py-2">
                    Notes & Preferences
                    <ChevronDown className="ml-auto size-4 group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col gap-4 pt-4">
                    <form.AppField
                      name="deliveryDate"
                      children={(field) => (
                        <field.DateField label="Delivery Date" />
                      )}
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
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field>
                            <FieldLabel htmlFor={field.name}>
                              Instructions
                            </FieldLabel>
                            <Textarea
                              id={field.name}
                              name={field.name}
                              value={field.state.value!}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
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
                  <div className="space-y-0.5 rounded-2xl bg-secondary p-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formatUSD(Number(totals.subtotal))}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{totals.charges?.type}</span>
                      <span>{formatUSD(Number(totals.charges?.amount))}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatUSD(Number(totals.total))}</span>
                    </div>
                  </div>

                  <SheetClose asChild>
                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-xl"
                      onClick={() => form.handleSubmit()}
                    >
                      Submit Order • ${formatUSD(Number(totals.total))}
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            );
          }}
        />
      </Sheet>
    );
  },
});
