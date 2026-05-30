"use client";
import React from "react";
import { toast } from "sonner";
import { UserDialog } from "./user-dialog";
import { UserWithMember } from "@/lib/types";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useQueryClient } from "@tanstack/react-query";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { addUserToOrganization, deleteUser } from "@/server/auth";
import {
  Loader,
  Lock,
  LockOpen,
  MoreVertical,
  SquarePen,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@/components/app-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError } from "@/components/ui/field";

export const UserAction = ({ data }: { data: UserWithMember }) => {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  // assign access
  const handleAssignAccess = async () => {
    setOpen(false);
    const toastId = toast.loading("Please wait...");
    const { success, error } = await addUserToOrganization({
      userId: data?.id,
      role: "member",
    });
    if (success) {
      toast.success("Access assigned successfully", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } else {
      toast.error(error?.message || "Failed to assign access", { id: toastId });
    }
  };

  const handleRemoveUser = () => {
    confirm.warning({
      title: "Are you sure?",
      description:
        "This will remove the user’s access to the selected warehouse.",
      action: async () => {
        const toastId = toast.loading("Please wait...");

        const { error } = await authClient.organization.removeMember({
          memberIdOrEmail: data?.email,
        });
        if (error) {
          toast.error(error?.message, {
            id: toastId,
          });
        } else {
          toast.success("User access removed successfully", { id: toastId });
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }
      },
    });
  };

  const handleDeleteUser = () => {
    confirm.delete({
      title: "Are you sure?",
      description: "This will permanently delete the user account.",
      action: async () => {
        const toastId = toast.loading("Please wait...");
        const { success, error } = await deleteUser(data.id);
        if (!success) {
          toast.error(error?.message, {
            id: toastId,
          });
        } else {
          toast.success("User deleted successfully", { id: toastId });
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }
      },
    });
  };

  return (
    <PopoverXDrawer
      open={open}
      setOpen={setOpen}
      className="w-40"
      trigger={
        <Button size="icon-sm" variant="outline">
          <MoreVertical className="size-5" />
        </Button>
      }
    >
      <AddMember
        data={{
          userId: data?.id,
          memberId: data?.member?.id,
          role: data?.member?.role,
        }}
      >
        {data?.member?.id ? (
          <Button variant="ghost" className="rounded-lg! justify-start">
            <Lock />
            Update Role
          </Button>
        ) : (
          <Button variant="ghost" className="rounded-lg!  justify-start">
            <LockOpen /> Assign Access
          </Button>
        )}
      </AddMember>
      <UserDialog data={data}>
        <Button variant="ghost" disabled className="justify-start rounded-lg!">
          <SquarePen /> Edit
        </Button>
      </UserDialog>

      <Button
        variant="ghost"
        onClick={handleRemoveUser}
        className="rounded-lg! bg-transparent"
      >
        <XCircle /> Revoke Access
      </Button>
      <Button
        variant="destructive"
        onClick={handleDeleteUser}
        className="rounded-lg! bg-transparent"
      >
        <Trash2 /> Delete
      </Button>
    </PopoverXDrawer>
  );
};

const AddMember = ({
  data,
  children,
}: {
  children: React.ReactNode;
  data: { userId: string; memberId?: string; role?: string };
}) => {
  const { userId, memberId, role } = data;
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const form = useForm({
    defaultValues: {
      role: role ?? "",
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");

      const { error } = memberId
        ? await authClient.organization.updateMemberRole({
            role: value.role,
            memberId,
          })
        : await addUserToOrganization({
            userId,
            role: value.role as any,
          });
      if (error) {
        toast.error(error.message, { id: toastId });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });
        toast.success("Role updated successfully", { id: toastId });
        setOpen(false);
      }
    },
  });

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="overflow-hidden rounded-2xl ring-ring/10 sm:max-w-xl">
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <AppDialogHeader>
            <AppDialogTitle className="md:text-xl md:font-bold">
              {memberId ? "Update role" : "Assign access"}
            </AppDialogTitle>
          </AppDialogHeader>
          <form.Field
            name="role"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger
                    aria-invalid={isInvalid}
                    className="w-full h-11!"
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Select>
              );
            }}
          />
          <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
            <AppDialogClose asChild>
              <Button
                variant="outline"
                size="xl"
                type="button"
                className="rounded-xl"
              >
                Cancel
              </Button>
            </AppDialogClose>
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
                  {isSubmitting ? <Loader className="animate-spin" /> : "Save"}
                </Button>
              )}
            />
          </Field>
        </form>
      </AppDialogContent>
    </AppDialog>
  );
};
