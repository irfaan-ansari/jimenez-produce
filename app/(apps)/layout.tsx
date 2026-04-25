import "@/app/globalsv2.css";
import { ThemeProvider } from "@/components/theme-provider";

const AppsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default AppsLayout;
