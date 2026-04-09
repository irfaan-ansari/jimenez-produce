import { ForgotPasswordForm } from "@/components/admin/forgot-password-form";
import { getSession } from "@/server/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Forgot Password",
};

const ForgotPasswordPage = async () => {
  const session = await getSession();
  if (session) redirect("/admin/overview");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        {/* form */}
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
