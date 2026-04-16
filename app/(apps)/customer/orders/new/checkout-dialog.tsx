"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formOpt } from "./order-form-options";
import { withForm } from "@/hooks/form-context";
import { Button } from "@/components/ui/button";
import { useStore } from "@tanstack/react-form";
import { ChevronDown, Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { DELIVERY_TIME } from "@/lib/constants/customer";
import { formatUSD, getAvatarFallback } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CheckoutDialog = withForm({
  ...formOpt,
  props: { trigger: undefined as React.ReactNode | undefined },
  render: function Render({ form, trigger }) {
    const [open, setOpen] = React.useState(false);

    const values = useStore(form.store, (state) => state.values);
    const { lineItems, subtotal, total, additionalCharges } = values;

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="gap-4 overflow-hidden rounded-2xl ring-ring/10 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Confirm Order
            </DialogTitle>
          </DialogHeader>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full gap-4 rounded-xl bg-secondary px-4 py-2">
              Add Notes & Preferences
              <ChevronDown className="ml-auto size-4 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <form.AppField
                  name="deliveryDate"
                  children={(field) => (
                    <field.DateField
                      label="Delivery Date"
                      className="**:rounded-xl"
                    />
                  )}
                />

                <form.AppField
                  name="deliveryWindow"
                  children={(field) => (
                    <field.SelectField
                      options={DELIVERY_TIME}
                      label="Delivery Time"
                      className="**:rounded-xl"
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
                      />
                    );
                  }}
                />

                <form.Field
                  name="notes"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field className="md:col-span-3">
                        <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value!}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="min-h-24 resize-none rounded-xl"
                          placeholder="Optional notes..."
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Table className="no-scrollbar max-h-72 overflow-auto text-base">
            <TableHeader className="text-xs text-muted-foreground uppercase">
              <TableRow>
                <TableHead className="pl-0">Item</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quanity</TableHead>
                <TableHead className="pr-2 text-right">Ext.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-1">
                    <div className="flex items-start gap-4">
                      <Avatar className="size-9 rounded-xl ring-2 ring-green-600/20 ring-offset-1 **:rounded-xl after:hidden">
                        <AvatarImage src={item.image!} />
                        <AvatarFallback>
                          {getAvatarFallback(item.title)}
                        </AvatarFallback>
                      </Avatar>

                      <h4 className="max-w-3xs truncate font-medium">
                        {item.title}
                      </h4>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatUSD(item.price!)}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="pr-0 text-right font-medium">
                    {formatUSD(item.total!)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-background">
              <TableRow>
                <TableCell colSpan={2} />
                <TableCell>Subtotal</TableCell>
                <TableCell className="pr-0 text-right">
                  {formatUSD(total)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} />
                <TableCell>Fuel Charge</TableCell>
                <TableCell className="pr-0 text-right">
                  {formatUSD(additionalCharges)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} />
                <TableCell>Total</TableCell>
                <TableCell className="pr-0 text-right">
                  {formatUSD(total)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>*]:w-auto">
            <DialogClose asChild>
              <Button
                variant="outline"
                size="xl"
                type="button"
                className="rounded-xl"
              >
                Cancel
              </Button>
            </DialogClose>
            <form.Subscribe
              selector={({ isSubmitting, canSubmit }) => ({
                isSubmitting,
                canSubmit,
              })}
              children={({ isSubmitting, canSubmit }) => (
                <Button
                  size="xl"
                  className="min-w-32 rounded-xl"
                  onClick={() => form.handleSubmit()}
                  disabled={isSubmitting || !canSubmit}
                >
                  {isSubmitting ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Place Order"
                  )}
                </Button>
              )}
            />
          </Field>
        </DialogContent>
      </Dialog>
    );
  },
});
