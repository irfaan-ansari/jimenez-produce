import {
  Body,
  Container,
  Head,
  Text,
  Heading,
  Html,
  pixelBasedPreset,
  Section,
  Tailwind,
  Img,
} from "@react-email/components";
import React from "react";

export const EmailTemplate = ({
  template,
  children,
  heading,
}: {
  template: "admin" | "customer";
  children: React.ReactNode;
  heading: string;
}) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body className="mx-auto my-auto px-4 font-sans bg-[#f2f8eb]">
          <Container className="mx-auto my-20 max-w-[660px] border bg-white border-[#eaeaea] overflow-hidden">
            {/* Header */}
            <Section className="py-10 px-4 text-center bg-[#80b83a]">
              <Img
                src={`https://jimenezproduce.com/logo.png`}
                width="100"
                height="100"
                alt="Logo"
                className="h-24 w-24 mx-auto object-contain bg-white p-2 rounded-full"
              />
              <Heading className="text-[44px] font-bold text-center text-white">
                {heading || "Status"}
              </Heading>
            </Section>

            {/* body  */}
            {children}
            {template === "admin" ? (
              <Section className="bg-[#f9f9f9] p-6">
                <Text className="text-sm mt-10 text-[#888888]">
                  This is an internal notification for Jimenez Produce admin
                  staff only. Do not forward to customers.
                </Text>
              </Section>
            ) : (
              <Section className="bg-[#f9f9f9] p-6">
                <Text className="text-4xl font-bold  text-[#626262]">
                  Jimenez Produce
                </Text>
                <Text className="text-[#626262]">
                  info@jimenezproduce.com
                  <br />
                  +1 (251) 262-2607 • +1 (337) 806-9008
                  <br />
                  23141 Rubens Ln, Robertsdale, AL 36567 • 23141 Rubens Ln,
                  Robertsdale, AL 36567
                </Text>
              </Section>
            )}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
