"use client";

import z from "zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { formatPhone } from "@/lib/utils";
import { QueryState } from "./query-state";
import { useRouter } from "next/navigation";
import { authClient } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { FieldGroup } from "@/components/ui/field";

const schema = z.object({
  id: z.string(),
  name: z.string().min(1, "Enter name"),
});

export const ProfileForm = () => {
  const { data, isPending, error } = authClient.useSession();
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      id: data?.user?.id || "",
      name: data?.user?.name || "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const { name } = value;
      const toastId = toast.loading("Please wait...");
      const { error } = await authClient.updateUser({ name });

      if (error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.success("Profile updated successfully!", { id: toastId });
      }
    },
  });

  return (
    <QueryState
      isPending={isPending}
      error={error}
      isError={!!error}
      isEmpty={!data?.user}
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
                label="Name"
                className="**:data-[slot=input]:rounded-xl"
              />
            )}
          />

          <InputGroup className="rounded-xl">
            <InputGroupInput
              disabled
              value={
                formatPhone(data?.user?.phoneNumber ?? "") || "Add phone number"
              }
            />

            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="secondary">Change</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          <InputGroup className="rounded-xl">
            <InputGroupInput
              disabled
              value={data?.user?.email || "Add email address"}
            />

            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="secondary">Change</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
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
