import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
  Button,
} from "@react-email/components";
import { Header } from "./header";

interface CustomerApprovedProps {
  name?: string;
  message: string;
}

export const CustomerInvite = ({ name, message }: CustomerApprovedProps) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body className="mx-auto my-auto px-4 font-sans bg-white">
          <Container className="mx-auto my-20 max-w-[560px] border border-[#eaeaea] border-solid">
            {/* header */}
            <Header />
            {/* body */}
            <Section className="px-6">
              <Hr className="m-0" />
              <Heading className="text-2xl my-6 text-black font-bold">
                Invitation to Apply
              </Heading>

              <Text className="text-black font-semibold text-base">
                Hello {name},
              </Text>
              <Text className="text-base text-[#404040]">
                You have been invited to apply for a commercial food
                distribution account with Jimenez Produce.
              </Text>

              <Section className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-4 mb-6">
                <Text className="text-base mt-0">{message}</Text>
              </Section>

              <Button
                href="https://jimenezproduce.com/apply"
                target="_blank"
                className="bg-[#80b83a] rounded-lg px-4 text-white uppercase text-sm font-semibold inline-flex items-center h-10 mb-4"
              >
                complete the application form
              </Button>
              <Section className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-4 mb-6">
                <Text className="text-base font-semibold mb-2">
                  How the Process Works:
                </Text>
                <Text className="text-base mt-0">
                  * Submit your application online <br />
                  * Our team reviews documentation portal
                  <br />
                  * Processing time is typically 24–48 business hours <br /> *
                  You will receive an approval confirmation email
                </Text>
              </Section>
              <Section className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-4 mb-6">
                <Text className="text-base font-semibold mb-2">
                  Ordering & Delivery:
                </Text>
                <Text className="text-base mt-0">
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
              </Section>
              <Text className="text-base">
                We distribute produce, dairy, dry goods, beverages, and
                specialty foodservice products throughout the Gulf Coast region.
                <br />
                <br />
                <strong>We look forward to reviewing your application.</strong>
              </Text>
              <Text className="text-base mt-10 text-[#404040]">
                Best regards,
                <br />
                <strong className="text-black"> Jimenez Produce</strong>
                <br />
                Customer Accounts Department
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CustomerInvite;
