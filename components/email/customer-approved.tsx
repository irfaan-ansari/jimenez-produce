import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  pixelBasedPreset,
  Row,
  Section,
  Tailwind,
  Text,
  Button,
} from "@react-email/components";
import { Header } from "./header";
import { Footer } from "./footer";

interface CustomerApprovedProps {
  name: string;
  companyName: string;
}

export const CustomerApproved = ({
  name,
  companyName,
}: CustomerApprovedProps) => {
  const previewText = `We are pleased to inform you that your account application has been approved`;

  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body className="mx-auto my-auto px-4 font-sans bg-[#f2f8eb]">
          <Preview>{previewText}</Preview>

          <Container className="mx-auto my-20 max-w-[660px] border bg-white border-[#eaeaea] overflow-hidden">
            {/* Header */}
            <Header />
            {/* Body */}
            <Section className="p-6">
              <Text className="text-xl text-black font-semibold mb-2">
                Hello {name || "Valued Customer"},
              </Text>

              <Text className="text-lg">
                We are pleased to inform you that your account application for{" "}
                <span className="font-semibold inline-block uppercase">
                  {companyName || "Company Name"}
                </span>{" "}
                has been approved.
              </Text>

              <Text className="text-xl font-semibold mt-8 mb-0">
                Your account is now active in our system.
              </Text>
            </Section>
            <Section className="p-6">
              <Section className=" shadow-sm p-6">
                <Text className="text-lg uppercase font-semibold text-[#80b83a]">
                  Ordering Information
                </Text>
                <Text className="text-lg">
                  <strong>*</strong> Orders must be placed the day before
                  delivery
                  <br />
                  <strong>*</strong> Daily cutoff time: 3:00 PM
                  <br />
                  <strong>*</strong> Deliveries are made the following scheduled
                  delivery day
                  <br />
                  <strong>*</strong> Orders placed after 3:00 PM will move to
                  the next available delivery date
                </Text>

                <Button
                  href="https://order.jimenezproduce.com"
                  target="_blank"
                  className="bg-[#80b83a] px-4 text-white uppercase text-sm font-semibold text-center justify-center flex items-center h-12 mb-4"
                >
                  Place Your Order
                </Button>
              </Section>

              <Text className="text-lg mt-6">
                If you have any questions regarding pricing, delivery schedule,
                or product availability, please contact our team.
              </Text>
              <Text className="text-xl font-semibold">
                We look forward to serving your business.
              </Text>
            </Section>
            {/* footer */}
            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CustomerApproved;
