import { ForgotPasswordForm } from "@/components/admin/forgot-password-form";
import { getSession } from "@/server/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Forgot Password",
};

const ForgotPasswordPage = async () => {
  const session = await getSession();
  if (session) redirect("/admin/overview");

  return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
