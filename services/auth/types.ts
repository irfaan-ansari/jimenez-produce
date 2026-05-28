export type Role = "owner" | "sales" | "manager" | "member" | "customer";

export type SignupProps = {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  role?: Role;
  accountType?: string;
};
