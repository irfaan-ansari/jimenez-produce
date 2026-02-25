import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { ResetPasswordForm } from "@/components/admin/reset-password-form";

export const metadata = {
  title: "Reset Password",
};

const ResetPasswordPage = async () => {
  const session = await getSession();
  if (session) redirect("/admin/overview");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        {/* form */}
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
