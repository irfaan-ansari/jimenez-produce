import { Container } from "@/components/container";

import { POLICIES } from "@/lib/constants/web";
import Markdown from "@/components/markdown";
import { type Metadata } from "next";
const { privacy } = POLICIES;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how Jimenez Produce collects, uses, and protects your personal information, including email and SMS communications, orders, and customer data.",
};

const PrivacyPolicyPage = () => {
  return (
    <>
      {/* page title*/}
      <section className="py-16 bg-highlight text-primary-foreground">
        <Container>
          <div className="flex flex-col items-center h-full">
            <div className="space-y-6 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-semibold uppercase">
                Privacy Policy
              </h2>
              <p className="font-medium">Last Updated: June 24, 2026</p>
            </div>
          </div>
        </Container>
      </section>

      {/*  */}
      <section className="my-16">
        <Container className="max-w-3xl">
          <Markdown content={privacy} />
        </Container>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;
