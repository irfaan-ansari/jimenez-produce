"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import z from "zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { Field, FieldGroup } from "./ui/field";
import { UserSelectType } from "@/lib/db/schema";
import { useAppForm } from "@/hooks/form-context";
import { Button, buttonVariants } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";

const schema = z.object({
  id: z.string(),
  name: z.string().min(1, "Enter name"),
  email: z.email("Enter email"),
  image: z.string(),
  imageObj: z.file().mime(["image/png", "image/jpeg"]).or(z.any()),
});

export const ProfileDialog = <T,>({
  user,
  children,
}: {
  user: Partial<UserSelectType>;
  children: React.ReactNode;
}) => {
  const form = useAppForm({
    defaultValues: {
      id: user.id || "",
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",

      imageObj: null as any,
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const { imageObj, ...rest } = value;

      if (imageObj instanceof File) {
        const blob = await upload(`users/${imageObj.name}`, imageObj, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        rest.image = blob.url;
      }
      await authClient.updateUser(
        {
          ...rest,
        },
        {
          onSuccess: () => {
            toast.success("User created successfully!");
          },
          onError: (err) => {
            toast.error(err.error.message || "Something went wrong!");
          },
        }
      );
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="ring-ring/10 rounded-2xl overflow-hidden sm:max-w-md">
        <DialogHeader className="flex flex-row gap-6 items-center pt-4 pb-6">
          <Avatar className="size-18 rounded-full **:rounded-full after:hidden ring-2 ring-offset-1 ring-green-600/20">
            <form.Field
              name="image"
              children={(field) => (
                <AvatarImage src={field.state.value} alt="image" />
              )}
            />

            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <DialogTitle className="text-xl font-semibold">
              {user.name}
            </DialogTitle>
            <Label
              className={buttonVariants({
                size: "xs",
                variant: "outline",
                className: "rounded-xl",
              })}
              htmlFor="profile-image"
            >
              Change Image
              <Input
                className="sr-only"
                type="file"
                accept="image/*"
                id="profile-image"
                onChange={(e) => {
                  form.setFieldValue("imageObj", e.target.files?.[0]);
                  const url = URL.createObjectURL(e.target.files?.[0]!);
                  form.setFieldValue("image", url);
                }}
              />
            </Label>
          </div>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className=""
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
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField
                  label="Email"
                  className="**:data-[slot=input]:rounded-xl"
                />
              )}
            />
          </FieldGroup>

          <Field className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:[&>button]:flex-1">
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
                  {isSubmitting ? <Loader className="animate-spin" /> : "Save"}
                </Button>
              )}
            />
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
};
