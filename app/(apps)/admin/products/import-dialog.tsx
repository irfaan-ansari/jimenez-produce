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
import { Download, Loader, Trash2, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const IMPORT_FIELDS = [
  {
    key: "identifier",
    label: "Code",
    required: true,
  },
  {
    key: "basePrice",
    label: "Price",
    required: true,
  },
] as const;

type ImportFieldKey = (typeof IMPORT_FIELDS)[number]["key"];

type Mapping = Record<ImportFieldKey, string>;

const processFile = async (file: File | undefined) => {
  if (!file) return null;
  try {
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
    });

    const headerIndex = json.findIndex((row) =>
      row.some((cell) => cell !== undefined && cell !== ""),
    );

    if (headerIndex === -1) {
      toast.error("No data found in file");

      return;
    }

    const headers = (json[headerIndex] || []).map((header) =>
      String(header).trim(),
    );

    const rows = json
      .slice(headerIndex + 1)
      .filter((row) => row.some((cell) => cell !== undefined && cell !== ""));

    const autoMapping: Partial<Mapping> = {};

    IMPORT_FIELDS.forEach((field) => {
      const matched = headers.find(
        (header) =>
          header.toLowerCase().trim() === field.label.toLowerCase().trim(),
      );

      if (matched) {
        autoMapping[field.key] = matched;
      }
    });
    return { headers, rows, autoMapping };
  } catch {
    toast.error("Please upload a valid CSV or Excel file.");
    return null;
  }
};

export const ImportDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const form = useAppForm({
    defaultValues: {
      file: undefined as File | undefined,
      rows: [] as string[][],
      headers: [] as string[],
      mapping: {} as Partial<Mapping>,
    },

    validators: {
      onSubmit: ({ value }) => {
        if (value.rows.length <= 0) {
          toast.error("Upload a file");
          return true;
        }
        for (const field of IMPORT_FIELDS) {
          if (field.required && !value.mapping[field.key]) {
            toast.error(`Please map ${field.label}`);
            return true;
          }
        }
        return null;
      },
    },

    onSubmit: async ({ value }) => {
      const items = value.rows.map((row) => {
        const rowObject = Object.fromEntries(
          value.headers.map((header, index) => [header, row[index]]),
        );

        return {
          identifier: rowObject[value.mapping.identifier as string],
          basePrice: Number(rowObject[value.mapping.basePrice as string]),
        };
      });

      const toastId = toast.loading("Please wait...");

      const { error } = await importProducts(items as any);

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

  /**
   * handle file change
   * @param file
   * @returns
   */
  const handleFileChange = async (file: File | undefined) => {
    const result = await processFile(file);
    if (!result) {
      toast.error("File is required");
      return;
    }
    const { rows, headers, autoMapping } = result;
    form.setFieldValue("headers", headers);
    form.setFieldValue("rows", rows);
    form.setFieldValue("mapping", autoMapping);
  };

  /**
   * hanlde clear file field
   */
  const clearFile = () => {
    form.setFieldValue("rows", []);
    form.setFieldValue("headers", []);
    form.setFieldValue("mapping", {});
    form.setFieldValue("file", undefined);
  };

  const { rows, headers, mapping } = useStore(
    form.store,
    ({ values }) => values,
  );

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
          <DialogHeader className="flex gap-3 items-start flex-row">
            <span className="inline-flex size-9 items-center justify-center rounded-lg border bg-secondary *:size-5">
              $
            </span>

            <DialogTitle className="text-2xl font-bold">
              Price update
            </DialogTitle>
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
                    <span className="size-9 bg-background shadow-sm rounded-lg inline-flex items-center justify-center">
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
                  {field.state.value ? (
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
                  ) : (
                    <div className="flex items-center gap-2 justify-start">
                      Need a sample?
                      <Button variant="link" size="xs" asChild>
                        <a href="/api/products/export" target="_blank">
                          <Download className="size-4" />
                          Download
                        </a>
                      </Button>
                      <span className="h-4 border-r-2 w-1"></span>
                      <Button variant="link" size="xs" asChild>
                        <a href="/api/products/export" target="_blank">
                          <Download className="size-4" />
                          Export list
                        </a>
                      </Button>
                    </div>
                  )}
                </Field>
              );
            }}
          />

          {rows.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-6">
                {IMPORT_FIELDS.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <p className="font-medium">{field.label}</p>

                    <Select
                      value={mapping[field.key]}
                      onValueChange={(value) => {
                        form.setFieldValue(`mapping.${field.key}`, value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>

                      <SelectContent>
                        {headers.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <div className="no-scrollbar flex-1 overflow-auto divide-y">
                {rows.map((row, i) => {
                  const rowObject = Object.fromEntries(
                    headers.map((header, index) => [header, row[index]]),
                  );

                  return (
                    <div key={i} className="grid py-2 grid-cols-2 gap-6">
                      {IMPORT_FIELDS.map((field) => {
                        const mappedColumn = mapping[field.key];
                        return (
                          <div
                            key={field.key}
                            className="align-top whitespace-normal"
                          >
                            {mappedColumn ? rowObject[mappedColumn] : "-"}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
                <div className="bg-secondary rounded-xl p-4 text-muted-foreground text-sm">
                  {rows.length - 1} items
                </div>
              </div>
            </>
          )}

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
