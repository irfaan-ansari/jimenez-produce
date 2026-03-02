import { EmailTemplate } from "./email-template";
import { Section, Text, Button } from "@react-email/components";

interface CustomerApprovedProps {
  name: string;
  message: string;
}

export const CustomerInvite = ({ name, message }: CustomerApprovedProps) => {
  return (
    <EmailTemplate template="customer" heading="Invitation to Apply">
      <Section className="p-6">
        <Text className="text-xl text-black font-semibold mb-2">
          Hello {name || "Name"},
        </Text>

        <Text className="text-lg">
          You have been invited to apply for a commercial food distribution
          account with Jimenez Produce.
        </Text>
        <Text className="text-lg">{message || "Message"}</Text>

        <Button
          href="https://jimenezproduce.com/apply"
          target="_blank"
          className="bg-[#80b83a] p-4 text-white uppercase text-sm font-semibold inline-flex items-center mb-4"
        >
          complete the application form
        </Button>

        <Section className="border-[#f4f5f6] border p-6 mt-6">
          <Text className="text-lg uppercase font-semibold text-[#80b83a]">
            How the Process Works:
          </Text>

          <Text className="text-lg">
            * Submit your application online <br />
            * Our team reviews documentation portal
            <br />
            * Processing time is typically 24–48 business hours <br /> * You
            will receive an approval confirmation email
          </Text>
        </Section>
        <Section className="border border-[#f4f5f6] p-6 mt-6">
          <Text className="text-lg uppercase font-semibold text-[#80b83a]">
            Ordering & Delivery:
          </Text>

          <Text className="text-lg">
            <strong>*</strong> Orders must be placed the day before delivery
            <br />
            <strong>*</strong> Daily cutoff time: 3:00 PM
            <br />
            <strong>*</strong> Deliveries are made the following scheduled
            delivery day
            <br />
            <strong>*</strong> Orders placed after 3:00 PM will move to the next
            available delivery date
          </Text>
        </Section>
        <Text className="text-lg">
          We distribute produce, dairy, dry goods, beverages, and specialty
          foodservice products throughout the Gulf Coast region.
        </Text>
        <Text className="font-semibold text-lg">
          We look forward to reviewing your application.
        </Text>
      </Section>
    </EmailTemplate>
  );
};

export default CustomerInvite;
