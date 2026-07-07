"use client";
import { QueryState } from "@/components/admin/query-state";
import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@/components/app-dialog";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldTitle } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCatalog } from "@/hooks/catalog";
import { emailBrochure, updateCatalog } from "@/server/catalog";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Check,
  Copy,
  FileText,
  Globe,
  InfoIcon,
  Loader2,
  RefreshCw,
  Send,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";

const items = [
  {
    label: "Digital",
    value: "web",
    icon: Globe,
    description: "Share digital price list",
  },
  {
    label: "Pdf",
    value: "pdf",
    icon: FileText,
    description: "Share PDF price list",
  },
];

const CatalogDialog = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [values, setValues] = React.useState({
    link: "",
    email: "",
    shareType: "pdf",
    copied: false,
  });
  const [isSending, sendCatalog] = React.useTransition();
  const [isRefreshing, refreshcatalog] = React.useTransition();

  const [open, setOpen] = React.useState(false);
  const { data, isPending, isError, error } = useCatalog();
  const catalogId = data?.data?.id;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(values.link);

      setValues({ ...values, copied: true });

      setTimeout(() => {
        setValues({ ...values, copied: false });
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleSend = () => {
    if (!catalogId) return;
    sendCatalog(async () => {
      const toastId = toast.loading("Sending email...");

      const { success } = await emailBrochure(catalogId, {
        viewType: values.shareType as "web" | "pdf",
        email: values.email,
      });
      if (success) {
        toast.success("Email sent successfully!", { id: toastId });
        setValues({ ...values, email: "" });
        setOpen(false);
      } else {
        toast.error("Failed to send email.", { id: toastId });
      }
    });
  };

  //   handle refressh
  const handleRefresh = async () => {
    refreshcatalog(async () => {
      await updateCatalog();
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
      toast.info("Price List Update", {
        description:
          "Please wait 5–10 minutes, then refresh the page to download the latest price list.",
      });
    });
  };

  React.useEffect(() => {
    setValues({
      ...values,
      link: `https://jimenezproduce.com/api/products/catalog/${catalogId}?view=${values.shareType}&source=link&share=true`,
    });
  }, [values.shareType, data]);

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="overflow-hidden rounded-2xl ring-ring/10 sm:max-w-xl">
        <AppDialogHeader className="gap-0">
          <AppDialogTitle className="text-lg font-bold">
            Price List
          </AppDialogTitle>
          {data?.data.updatedAt && (
            <AppDialogDescription>
              Last updated • {format(data?.data.updatedAt, "MMM dd, hh:mm a")}
            </AppDialogDescription>
          )}
          <Button
            size="xs"
            disabled={isRefreshing}
            onClick={handleRefresh}
            className="self-start mt-2"
          >
            <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Updating..." : "Update list"}
          </Button>
        </AppDialogHeader>
        <QueryState
          isPending={isPending}
          isError={isError}
          isEmpty={false}
          error={error}
          className="min-h-40"
        >
          <>
            {/* <div className="rounded-xl border bg-secondary p-4 h-20 grid grid-cols-3"></div> */}
            <div className="space-y-2">
              <div className="font-medium">Email</div>
              <InputGroup>
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    onClick={handleSend}
                    disabled={isSending || !values.email}
                    className="bg-sidebar-accent w-18 hover:bg-sidebar-accent/80 text-primary-foreground hover:text-primary-foreground h-8"
                  >
                    {isSending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <Send />
                        Send
                      </>
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Enter email"
                  value={values.email}
                  onChange={(e) =>
                    setValues({ ...values, email: e.target.value })
                  }
                />
              </InputGroup>
            </div>
            <div className="relative border-b-2 my-2">
              <span className="absolute bottom-0 left-1/2 translate-y-2.5 px-3 -translate-x-1/2 bg-background text-muted-foreground font-medium">
                COPY LINK
              </span>
            </div>

            <RadioGroup
              defaultValue={values.shareType}
              className="grid w-full grid-cols-2 gap-4"
              onValueChange={(value) =>
                setValues({ ...values, shareType: value })
              }
              disabled
            >
              {items.map((item) => (
                <FieldLabel
                  key={item.value}
                  htmlFor={item.value}
                  className="relative p-0!"
                >
                  <Field orientation="horizontal">
                    <div className="absolute top-3 right-3">
                      <RadioGroupItem value={item.value} id={item.value} />
                    </div>
                    <FieldTitle className="flex flex-row items-start">
                      <div className="bg-background border-border rounded-2xl flex shrink-0 items-center justify-center border p-2 shadow-xs shadow-black/5">
                        <item.icon className="size-4" />
                      </div>
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="text-sm font-semibold">
                          {item.label}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {item.description}
                        </span>
                      </div>
                    </FieldTitle>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>

            <div className="space-y-2">
              <div className="font-medium">Copy link</div>
              <div className="rounded-lg h-11 border flex items-center pr-1 bg-secondary/50">
                <div className="truncate min-w-0 px-3 flex-1">
                  {values.link}
                </div>
                <Button size="icon" variant="secondary" onClick={handleCopy}>
                  {values.copied ? <Check /> : <Copy />}
                </Button>
              </div>
            </div>
          </>
        </QueryState>
        <AppDialogClose asChild>
          {data?.data?.pdfUrl ? (
            <Button size="xl" className="mt-2" asChild>
              <a href={data?.data?.pdfUrl ?? ""} target="_blank">
                Download PDF
              </a>
            </Button>
          ) : (
            <Button size="xl" className="mt-2" disabled>
              Download PDF
            </Button>
          )}
        </AppDialogClose>
      </AppDialogContent>
    </AppDialog>
  );
};

export default CatalogDialog;
