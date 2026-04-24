import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { ResetPasswordForm } from "@/components/admin/reset-password-form";

export const metadata = {
  title: "Reset Password",
};

const ResetPasswordPage = async () => {
  const session = await getSession();
  if (session) redirect("/admin/overview");

  return <ResetPasswordForm />;
};

export default ResetPasswordPage;
