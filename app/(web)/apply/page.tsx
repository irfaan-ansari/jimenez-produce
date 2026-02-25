import { Container } from "@/components/container";
import { CustomerForm } from "@/components/customer-form/form";
import { LanguageProvider } from "@/components/ui/language-selector";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for an account",
  description:
    "Apply for a foodservice distribution account and get reliable delivery of fresh produce and supplies for your restaurant or kitchen.",
};

const CustomerApplicationPage = () => {
  return (
    <LanguageProvider defaultLanguage="en">
      {/* page title*/}
      <section className="py-16 bg-highlight text-primary-foreground">
        <Container>
          <div className="flex flex-col items-center h-full">
            <div className="space-y-6 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-semibold uppercase">
                Become a customer
              </h2>
              <p className="text-lg">
                Please complete this secure application to open a new account
                with Jimenez Produce. All information is kept confidential and
                will be reviewed by our team before approval.
              </p>
              <p></p>
            </div>
          </div>
        </Container>
      </section>

      {/*  */}
      <section className="mt-16">
        <Container className="max-w-3xl p-8 shadow-sm mb-16">
          <CustomerForm />
        </Container>
      </section>
    </LanguageProvider>
  );
};

export default CustomerApplicationPage;
