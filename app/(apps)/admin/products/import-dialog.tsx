"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Download, Loader } from "lucide-react";
import { useAppForm } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { importProducts } from "@/server/product";

const HEADER_MAP = {
  identifier: "Code",
  title: "Title",
  unit: "Unit",
  description: "Description",
  categories: "Categories",
  basePrice: "Price",
  isTaxable: "Is Taxable",
};

const HEADER = Object.entries(HEADER_MAP);

type SpecialFields = {
  categories: string[];
  isTaxable: boolean;
};

type Item = {
  [K in keyof typeof HEADER_MAP]: K extends keyof SpecialFields
    ? SpecialFields[K]
    : string;
};

const mapRow = (row: any[]): Item => {
  const obj = {} as Item;

  for (let i = 0; i < HEADER.length; i++) {
    const key = HEADER[i][0] as keyof Item;
    let val = row[i] ?? "";

    if (key === "categories") {
      val = String(val)
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
    } else if (key === "isTaxable") {
      val = String(val).toLowerCase() === "true";
    }

    (obj as any)[key] = val;
  }

  return obj;
};

export const ImportDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const form = useAppForm({
    defaultValues: {
      file: undefined as any,
      rows: [] as string[][],
      loading: false,
    },
    validators: {
      onSubmit: ({ value }) => {
        if (value.rows.length <= 0)
          return {
            fields: {
              file: { message: "Upload a file" },
            },
          };

        return null;
      },
    },
    onSubmit: async ({ value }) => {
      const items: Item[] = value.rows.map(mapRow);
      const { error } = await importProducts(items);
      const toastId = toast.loading("Please wait...");

      if (error) {
        toast.error(error?.message, { id: toastId });
      } else {
        toast.success("Products imported successfully", { id: toastId });
        setOpen(false);
        form.reset();
      }
    },
  });

  //   handle file upload
  const hanldeFileChange = async (file: File | undefined) => {
    if (!file) return;
    form.setFieldValue("loading", true);
    const isCSV = file.name.toLowerCase().endsWith(".csv");

    try {
      let workbook;

      if (isCSV) {
        const text = await file.text();
        workbook = XLSX.read(text, { type: "string" });
      } else {
        const data = await file.arrayBuffer();
        workbook = XLSX.read(data);
      }

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const json: string[][] = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        raw: false,
      });

      const headerIndex = json.findIndex((row: any[]) =>
        row.some((cell) => cell !== undefined && cell !== ""),
      );
      //   this removes the first index
      const rows = json.slice(headerIndex + 1);

      form.setFieldValue("rows", rows);
    } catch {
      toast.error("Please upload a valid CSV or Excel file.");
    } finally {
      form.setFieldValue("loading", false);
    }
  };

  const { rows, loading } = useStore(form.store, ({ values }) => values);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl px-0 ring-ring/10 sm:max-w-2xl">
        <DialogHeader className="px-6 gap-1">
          <DialogTitle className="text-2xl font-bold">
            Import products
          </DialogTitle>
          <DialogDescription className="flex gap-2 items-end">
            Download product list, fill it and upload to create or update
            products.
            <Button variant="link" size="xs" asChild>
              <a href="/api/products/export" target="_blank">
                <Download /> Download
              </a>
            </Button>
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex max-h-[calc(100svh-200px)] flex-col"
        >
          <div className="no-scrollbar flex-1 overflow-auto">
            <FieldGroup className="px-6">
              {/* rows */}

              {rows.length > 0 ? (
                <div className="space-y-2 *:data-[slot=table-container]:border *:data-[slot=table-container]:rounded-xl">
                  <div className="flex gap-2 items-center">
                    <p>{rows.length} rows</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        form.setFieldValue("rows", []);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary uppercase text-muted-foreground">
                        {HEADER.map(([_, v]) => (
                          <TableHead key={v} className="w-[14%] truncate">
                            {v}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.slice(0, 12).map((row, i) => (
                        <TableRow key={i}>
                          {row.map((cell, j) => (
                            <TableCell
                              key={j}
                              className="whitespace-normal align-top"
                            >
                              {cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <form.Field
                  name="file"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field>
                        <FieldLabel
                          htmlFor={field.name}
                          className="h-28 justify-center rounded-xl border border-dashed bg-secondary transition hover:border-solid hover:ring-1 hover:ring-ring/50"
                        >
                          <FieldLegend>
                            {loading ? (
                              <Loader className="animate-spin size-4" />
                            ) : (
                              "Upload File"
                            )}
                          </FieldLegend>
                          <Input
                            className="sr-only"
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            id={field.name}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              field.handleChange(file);
                              hanldeFileChange(file);
                            }}
                          />
                        </FieldLabel>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              )}
            </FieldGroup>
          </div>
          <Field className="flex flex-col-reverse gap-4 px-6 pt-6 sm:flex-row sm:justify-end  sm:[&>*]:w-28">
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
              selector={({ isSubmitting, canSubmit }) => ({
                isSubmitting,
                canSubmit,
              })}
              children={({ isSubmitting, canSubmit }) => (
                <Button
                  type="submit"
                  size="xl"
                  className="rounded-xl"
                  disabled={isSubmitting || !canSubmit}
                >
                  {isSubmitting ? (
                    <Loader className="animate-spin" />
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
