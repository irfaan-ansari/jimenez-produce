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
  Row,
  Column,
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
          <Container className="mx-auto my-20 max-w-[660px] border bg-white rounded=[1.5rem] border-[#eaeaea] overflow-hidden">
            {/* Header */}
            <Section className="bg-[#80b83a] px-6 py-8">
              <Row>
                <Column width="100" className="pr-6">
                  <Img
                    src="https://jimenezproduce.com/logo.png"
                    width="80"
                    height="80"
                    alt="Jimenez Produce"
                    className="rounded-2xl w-20 h-20 object-contain  border-2 bg-[#f7fee7] border-[#d9f99d] p-2"
                  />
                </Column>

                <Column>
                  <Heading className="m-0 text-[36px] mb-2 font-bold text-white">
                    Jimenez Produce
                  </Heading>
                  <Heading className="m-0 text-[28px] font-semibold text-neutral-100">
                    {heading ?? "Foodservice distribution"}
                  </Heading>
                </Column>
              </Row>
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
                <Text className="text-2xl font-bold  text-[#626262]">
                  Jimenez Produce
                </Text>

                <Row>
                  <Column>
                    <Text className="text-sm uppercase font-semibold text-[#626262]">
                      Robertsdale
                    </Text>
                    <Text className="text-[#626262]">
                      +1 (251) 262-2607
                      <br />
                      info@jimenezproduce.com
                      <br />
                      23141 Rubens Ln, Robertsdale, AL 36567
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-sm uppercase font-semibold text-[#626262]">
                      Lafayette
                    </Text>
                    <Text className="text-[#626262]">
                      +1 (337) 806-9008
                      <br />
                      info@jimenezproduce.com
                      <br />
                      100 Goldenrod Dr, Lafayette, LA 70507
                    </Text>
                  </Column>
                </Row>
              </Section>
            )}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
