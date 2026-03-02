import { Section, Text } from "@react-email/components";

import { EmailTemplate } from "./email-template";

interface Props {
  name: string;
  company: string;
}

export const CustomerNew = ({ name, company }: Props) => {
  return (
    <EmailTemplate template="customer" heading="Application Submitted">
      <Section className="p-6">
        <Text className="text-xl text-black font-semibold mb-2">
          Hello {name || "Name"},
        </Text>

        <Text className="text-lg">
          Thank you for submitting your account application with{" "}
          <strong>Jimenez Produce</strong>, your trusted fresh produce
          distributor.
        </Text>

        <Text className="text-lg mb-0">
          Our Customer Accounts Department has received your application and
          will review it within 24–48 business hours.
        </Text>

        <Section className="border border-[#f4f5f6] p-6 mt-6">
          <Text className="text-lg uppercase font-semibold text-[#80b83a] mt-0">
            Next steps:
          </Text>

          <Text className="text-base font-semibold mb-0">
            • Our team reviews your submitted documentation. <br />
            • Once approved, you will receive a confirmation email. <br />•
            After approval, you can start placing orders for fresh produce,
            dairy, beverages, dry goods, and specialty foodservice items.
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

export default CustomerNew;
