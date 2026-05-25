"use client";

import React from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@tanstack/react-form";
import { importProducts } from "@/server/product";
import { useAppForm } from "@/hooks/form-context";
import { useQueryClient } from "@tanstack/react-query";
import { Loader, Trash2, Upload } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { bulkUpdate } from "@/server/price-level";

type Item = {
  identifier: string;
  price: string;
};
type Group = Record<string, Item[]>;

const processFile = async (file: File) => {
  const isCSV = file.name.toLowerCase().endsWith(".csv");

  let workbook;

  if (isCSV) {
    const text = await file.text();

    workbook = XLSX.read(text, {
      type: "string",
    });
  } else {
    const data = await file.arrayBuffer();

    workbook = XLSX.read(data);
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json: string[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: false,
    defval: "",
    blankrows: false,
  });

  const headers = json[0];
  const rows = json.slice(1);

  const grouped: Group = {};

  headers.forEach((header, index) => {
    const cleanHeader = String(header).trim();
    if (index === 0 || !cleanHeader) return;
    grouped[cleanHeader] = [];
  });

  for (const row of rows) {
    const isEmptyRow = row.every((cell) => !String(cell).trim());

    if (isEmptyRow) continue;

    const identifier = String(row[0] || "").trim();

    if (!identifier) continue;

    row?.forEach((value, index) => {
      if (index === 0) return;

      const header = String(headers[index] || "").trim();
      const cellValue = String(value || "").trim();

      if (!header || !cellValue) return;

      grouped[header].push({
        identifier,
        price: cellValue,
      });
    });
  }
  return grouped;
};

export const ImportDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);

  const queryClient = useQueryClient();
  const form = useAppForm({
    defaultValues: {
      file: undefined as File | undefined,
      rows: {} as Group,
    },
    validators: {
      onSubmit: ({ value }) => {},
    },
    onSubmit: async ({ value }) => {
      const { rows } = value;

      const toastId = toast.loading("Please wait...");

      const { error } = await bulkUpdate(rows);

      if (error) {
        toast.error(error.message, {
          id: toastId,
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
        toast.success("Price updated successfully.", {
          id: toastId,
        });
        setOpen(false);
        form.reset();
      }
    },
  });

  //  handle file change
  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;

    const result = await processFile(file);

    if (!result) {
      toast.error("File is required");
      return;
    }

    form.setFieldValue("rows", result);
  };

  // clear value
  const clearFile = () => {
    form.setFieldValue("rows", {});
    form.setFieldValue("file", undefined);
  };

  const { rows } = useStore(form.store, ({ values }) => values);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="rounded-2xl ring-ring/10 sm:max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            form.handleSubmit();
          }}
          className="flex h-[min(700px,90svh)] gap-6 flex-col"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Price level</DialogTitle>
          </DialogHeader>
          <form.Field
            name="file"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field className="relative">
                  <FieldLabel
                    htmlFor={field.name}
                    className="h-28 flex-col hover:*:data-[slot=field-legend]:underline pt-6 justify-center rounded-xl border-2 border-dashed bg-secondary/40 transition"
                  >
                    <span className="inline-flex items-center justify-center rounded-lg shadow-sm size-9 bg-background">
                      <Upload className="size-5 text-muted-foreground" />
                    </span>
                    <FieldLegend className="text-muted-foreground text-sm! ">
                      {field.state.value?.name || "Click to upload a file"}
                    </FieldLegend>

                    <Input
                      className="sr-only"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      id={field.name}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.handleChange(file);
                        handleFileChange(file);
                      }}
                    />
                  </FieldLabel>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  {field.state.value && (
                    <Button
                      variant="destructive"
                      size="xs"
                      type="button"
                      onClick={clearFile}
                      className="absolute w-auto! top-2 right-2"
                    >
                      <Trash2 />
                      Remove file
                    </Button>
                  )}
                </Field>
              );
            }}
          />

          <div className="overflow-y-auto no-scrollbar">
            {Object.entries(rows).map(([key, values]) => {
              return (
                <Collapsible
                  className="data-[state=open]:border rounded-lg"
                  key={key}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full">
                      {key}
                      <span className="text-muted-foreground ml-auto">
                        {values.length} Items
                      </span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-2 space-y-0.5">
                    {values.map((val, i) => {
                      return (
                        <div
                          key={key + val.identifier}
                          className="flex items-center flex-nowrap"
                        >
                          <span className="w-10">{i + 1}</span>
                          <span className="flex-1 font-medium truncate">
                            {val.identifier}
                          </span>

                          <Input
                            className="h-9 w-24 text-right"
                            value={val.price}
                          />
                        </div>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>

          <Field className="flex mt-auto relative flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>*]:w-32">
            <Button
              variant="outline"
              size="xl"
              type="button"
              className="rounded-xl"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <form.Subscribe
              selector={(state) => ({
                isSubmitting: state.isSubmitting,
                canSubmit: state.canSubmit,
              })}
              children={({ isSubmitting, canSubmit }) => (
                <Button
                  type="submit"
                  size="xl"
                  className="rounded-xl"
                  disabled={isSubmitting || !canSubmit}
                >
                  {isSubmitting ? (
                    <Loader className="size-4 animate-spin" />
                  ) : (
                    "Import"
                  )}
                </Button>
              )}
            />
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
};
