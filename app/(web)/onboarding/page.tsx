import { Container } from "@/components/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding",
  description:
    "This document outlines employment terms, safety requirements, compliance obligations",
};

const JobAgreementPage = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  return (
    <>
      {/* page title*/}
      <section className="bg-highlight py-16 text-primary-foreground">
        <Container>
          <div className="flex flex-col items-center h-full">
            <div className="space-y-6 text-center max-w-xl mx-auto">
              <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-semibold uppercase">
                Onboarding
              </h2>
              <p className="text-lg">
                This document outlines employment terms, safety requirements,
                compliance obligations, equipment accountability standards, and
                workplace expectations for all employees of Jimenez Produce LLC.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default JobAgreementPage;
