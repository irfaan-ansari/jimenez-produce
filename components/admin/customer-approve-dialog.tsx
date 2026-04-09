import z from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useAppForm } from "@/hooks/form-context";
import { useLocations } from "@/hooks/use-config";
import { Field, FieldError, FieldLabel } from "../ui/field";

const schema = z.object({
  locationId: z.string("Select location"),
});

export const CustomerApproveDialog = ({
  open,
  setOpen,
  action,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  action: (v: number) => void;
}) => {
  const form = useAppForm({
    defaultValues: {
      locationId: null as any,
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await action?.(value.locationId);
    },
  });

  const { data, isPending } = useLocations();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="ring-ring/10 rounded-2xl px-8 pt-14 pb-10 overflow-hidden sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center gap-2">
          <DialogTitle className="text-2xl font-semibold">
            Approve Application
          </DialogTitle>
          <DialogDescription className="text-base">
            Approving this application will activate the customer account and
            send a notification to the customer.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-8"
        >
          <form.Field
            name="locationId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              if (isPending)
                return <Skeleton className="rounded-xl h-10 w-full" />;
              return (
                <Field className="w-full">
                  <FieldLabel>Location</FieldLabel>

                  <Select
                    name={field.name}
                    value={field.state.value?.toString() || ""}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger
                      className="rounded-xl"
                      aria-invalid={isInvalid}
                    >
                      <SelectValue placeholder="Assign location" />
                    </SelectTrigger>

                    <SelectContent className="rounded-xl">
                      <SelectGroup>
                        {data?.data?.map((loc) => (
                          <SelectItem
                            value={loc.id.toString()}
                            key={loc.id}
                            className="rounded-xl"
                          >
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:[&>button]:flex-1">
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
                  type="submit"
                  size="xl"
                  className="rounded-xl"
                  disabled={isSubmitting || !canSubmit}
                >
                  {isSubmitting ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Approve"
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
