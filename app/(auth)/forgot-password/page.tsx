import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { getSession } from "@/services/auth";
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
