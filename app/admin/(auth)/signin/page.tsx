import { LoginForm } from "@/components/admin/login-form";
import { getSession } from "@/server/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Signin",
};

const SigninPage = async () => {
  const session = await getSession();
  if (session) redirect("/admin/overview");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        {/* form */}
        <LoginForm />
      </div>
    </div>
  );
};

export default SigninPage;
