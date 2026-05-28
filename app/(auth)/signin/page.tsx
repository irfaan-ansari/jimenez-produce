import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Signin",
};

const SigninPage = async () => {
  return <LoginForm />;
};

export default SigninPage;
