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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import { useStore } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { withForm } from "@/hooks/form-context";
import { formOpt } from "./order-form-options";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DELIVERY_TIME } from "@/lib/constants/customer";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CheckoutDialog = withForm({
  ...formOpt,
  render: function Render({ form }) {
    const [open, setOpen] = React.useState(false);

    const values = useStore(form.store, (state) => state.values);
    const { lineItems } = values;

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="rounded-xl w-full mt-4 uppercase"
            size="xl"
            disabled={!values.lineItems.length}
          >
            Checkout <span>•</span>
            {formatUSD(values.total)}
          </Button>
        </DialogTrigger>
        <DialogContent className="ring-ring/10 rounded-2xl overflow-hidden sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Confirm Order
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <form.AppField
              name="deliveryDate"
              children={(field) => <field.DateField label="Delivery Date" />}
            />

            <form.AppField
              name="deliveryWindow"
              children={(field) => (
                <field.SelectField options={DELIVERY_TIME} />
              )}
            />
            <form.Field
              name="po"
              children={(field) => {
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>PO / Reference</FieldLabel>
                    <Input
                      className="rounded-xl"
                      id={field.name}
                      name={field.name}
                      value={field.state.value!}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Optional"
                    />
                  </Field>
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
          <div className="max-h-72 overflow-auto no-scrollbar">
            <Table className="text-base">
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="py-4">Quanity</TableHead>
                  <TableHead className="text-right">Ext.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex gap-4 items-start">
                        <Avatar className="rounded-xl **:rounded-xl after:hidden size-9 ring-2 ring-offset-1 ring-green-600/20">
                          <AvatarImage src={item.image!} />
                          <AvatarFallback>P</AvatarFallback>
                        </Avatar>

                        <h4 className="font-medium max-w-3xs truncate">
                          {item.title}
                        </h4>
                      </div>
                    </TableCell>
                    <TableCell>{item.offerPrice}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatUSD(item.total!)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:[&>button]:flex-1">
            <DialogClose asChild>
              <Button
                variant="outline"
                size="xl"
                type="button"
                className="rounded-xl"
              >
                Back to Edit
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
                  className="rounded-xl"
                  onClick={() => form.handleSubmit()}
                  disabled={isSubmitting || !canSubmit}
                >
                  {isSubmitting ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <>Place Order {formatUSD(values.total)}</>
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
