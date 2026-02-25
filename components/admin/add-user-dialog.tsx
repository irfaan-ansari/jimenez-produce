"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import z from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Loader } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { Field, FieldGroup } from "../ui/field";
import { useAppForm } from "@/hooks/form-context";
import { Button, buttonVariants } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";
import { useState } from "react";
import { useStore } from "@tanstack/react-form";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(1, "Enter name"),
  email: z.email("Enter email"),
  password: z.string().min(8, "Minimum 8 characters required"),
  role: z.string().min(1, "Select role"),
  image: z.string(),
  imageObj: z.file().mime(["image/png", "image/jpeg"]).or(z.any()),
});

export const AddUserDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      image: "",
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
      await authClient.admin.createUser(
        { ...rest, role: "user" },
        {
          onSuccess: () => {
            toast.success("User account created successfully!");
            setOpen(false);
            router.refresh();
            form.reset();
          },
          onError: (err) => {
            toast.error(err.error.message || "Something went wrong");
          },
        }
      );
    },
  });

  const image = useStore(form.store, (state) => state.values.image);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <DialogTitle className="text-xl font-semibold">
              Add new user
            </DialogTitle>
            <Label
              className={buttonVariants({
                size: "xs",
                variant: "outline",
                className: "rounded-xl",
              })}
              htmlFor="profile-image"
            >
              {image ? "Change Image" : "Upload Image"}

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
            <form.AppField
              name="password"
              children={(field) => (
                <field.TextField
                  label="Password"
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
                  {isSubmitting ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Add User"
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
