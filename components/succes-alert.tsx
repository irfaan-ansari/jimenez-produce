import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import Link from "next/link";
import { Confetti } from "./ui/confetti";
import { CircleCheck } from "lucide-react";
export const SuccessAlert = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent
        size="sm"
        className="to-card px-6 py-12 bg-linear-to-b from-primary/40 to-40% border-none ring-0  aspect-square"
      >
        <Confetti className="absolute top-0 left-0 z-[-1] size-full" />
        <AlertDialogTitle className="sr-only"></AlertDialogTitle>
        <div className="flex flex-col size-full gap-8 text-center justify-start items-center">
          <span className="inline-flex justify-center items-center bg-primary/30 text-primary ring-4 ring-offset-4 ring-primary/20 size-14 rounded-full">
            <CircleCheck className="size-6" />
          </span>
          <div className="space-y-3">
            <h2 className="text-xl/tight font-medium">Application Submitted</h2>
            <p>
              Your application has been submitted successfully. We’ll review
              your details and get back to you shortly!
            </p>
            <AlertDialogCancel asChild>
              <Link href="/">Back to home</Link>
            </AlertDialogCancel>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
