import Link from "next/link";
import { ProfileForm } from "@/components/admin/profile-form";
import ChangePasswordForm from "@/components/admin/change-password";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tabs = [
  {
    value: "profile",
    name: "Profile",
    description: "Update your profile",
    content: ProfileForm,
  },
  {
    value: "password",
    name: "Password",
    description: "Change your password",
    content: ChangePasswordForm,
  },
];

const SettingsPage = async ({
  searchParams,
}: {
  searchParams: { tab?: string };
}) => {
  const { tab } = await searchParams;

  return (
    <div className="flex h-full max-w-2xl flex-col gap-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* content */}
      <Tabs defaultValue={tab || "account"} className="gap-6">
        <TabsList className="gap-3 bg-transparent">
          {tabs.map((tab) => (
            <TabsTrigger
              className="relative z-1 inline-flex h-8 items-center gap-2 rounded-xl border border-border bg-background px-2.5 text-sm leading-tight font-medium whitespace-nowrap transition hover:bg-foreground hover:text-muted data-active:border-black data-active:bg-foreground data-active:text-muted"
              key={tab.value}
              value={tab.value}
            >
              <Link href={`/admin/settings?tab=${tab.value}`}>{tab.name}</Link>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {tab.description}
                </CardTitle>
              </CardHeader>
              <CardContent>{<tab.content />}</CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SettingsPage;
