"use client";
import z from "zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { QueryState } from "./query-state";
import { authClient } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { FieldGroup } from "@/components/ui/field";
import { useCustomerProfile } from "@/hooks/use-teams";

const schema = z.object({
  name: z.string().min(1, "Company Name is required"),
  managerName: z.string().min(1, "Manager Name is required"),
  phone: z.string().min(1, "Phone Number is required"),
  email: z.email("Email is required"),
});

export const AccountForm = () => {
  const { data, isPending, isError, error } = useCustomerProfile();

  const form = useAppForm({
    validators: {
      onBlur: schema,
    },
    defaultValues: {
      name: data?.data?.name || "",
      managerName: data?.data?.managerName || "",
      phone: data?.data?.phone || "",
      email: data?.data?.email || "",
    },
    onSubmit: async ({ value }) => {
      const teamId = data?.data?.id;
      if (!teamId) {
        toast.error("Failed to update, try again");
        return;
      }
      const toastId = toast.loading("Please wait...");

      const { error } = await authClient.organization.updateTeam({
        teamId,
        data: {
          ...value,
        },
      });
      if (error) {
        toast.error("Failed to update account", { id: toastId });
      } else {
        toast.success("Team updated successfully", { id: toastId });
      }
    },
  });

  return (
    <QueryState
      isPending={isPending}
      isError={isError}
      error={error}
      isEmpty={!data?.data}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField
                label="Company Name"
                placeholder="Enter Company Name"
              />
            )}
          />
          <form.AppField
            name="managerName"
            children={(field) => (
              <field.TextField
                label="Manager Name"
                placeholder="Enter Manager Name"
              />
            )}
          />
          <form.AppField
            name="phone"
            children={(field) => (
              <field.PhoneField
                label="Phone Number"
                placeholder="123-123-1234"
              />
            )}
          />
          <form.AppField
            name="email"
            children={(field) => (
              <field.TextField label="Email" placeholder="name@email.com" />
            )}
          />

          <div className="flex *:w-full sm:*:w-32 items-center justify-end">
            <form.Subscribe
              selector={({ isSubmitting, canSubmit, isDirty }) => ({
                isSubmitting,
                canSubmit,
                isDirty,
              })}
              children={({ isSubmitting, canSubmit, isDirty }) => {
                return (
                  <Button
                    type="submit"
                    className="w-28"
                    size="lg"
                    disabled={isSubmitting || !isDirty || !canSubmit}
                  >
                    {isSubmitting ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Update"
                    )}
                  </Button>
                );
              }}
            />
          </div>
        </FieldGroup>
      </form>
    </QueryState>
  );
};
