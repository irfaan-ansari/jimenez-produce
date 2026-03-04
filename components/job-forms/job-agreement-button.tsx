"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { submitAgreement } from "@/server/job";
import { useRouter } from "next/navigation";

export const JobAgreementButton = ({ token }: { token: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async () => {
    setLoading(true);

    const { success, error } = await submitAgreement(token);
    if (success) {
      toast.success("Agreement Submitted Successfully");
      router.replace("/");
    } else toast.error(error.message || "Failded to submit agreement");
    setLoading(false);
  };

  return (
    <Button
      className="w-full"
      size="xl"
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? <Loader className="animate-spin" /> : "Agree and Continue"}
    </Button>
  );
};
