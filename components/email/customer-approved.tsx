import { EmailTemplate } from "./email-template";
import { Section, Text, Button } from "@react-email/components";

interface CustomerApprovedProps {
  name: string;
  company: string;
}

export const CustomerApproved = ({ name, company }: CustomerApprovedProps) => {
  return (
    <EmailTemplate template="customer" heading="Application Approved">
      <Section className="p-6">
        <Text className="text-xl text-black font-semibold mb-2">
          Hello {name || "Name"},
        </Text>

        <Text className="text-lg">
          We are pleased to inform you that your account application for{" "}
          <span className="font-semibold inline-block uppercase">
            {company}
          </span>{" "}
          has been approved.
        </Text>

        <Text className="text-xl font-semibold mt-8 mb-0">
          Your account is now active in our system.
        </Text>

        <Section className="border border-[#f4f5f6] p-6 mt-6">
          <Text className="text-lg uppercase font-semibold text-[#80b83a]">
            Ordering Information
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

        <Section className="border border-[#f4f5f6] p-6 mt-6">
          <Text className="text-lg uppercase font-semibold text-[#80b83a]">
            You may now begin placing orders through:
          </Text>
          <Text className="text-lg">
            <strong>*</strong> Your assigned sales representative
            <br />
            <strong>*</strong> Our online ordering portal
          </Text>

          <Button
            href="https://order.jimenezproduce.com"
            target="_blank"
            className="bg-[#80b83a] p-4 text-white uppercase text-sm font-semibold text-center justify-center flex items-center"
          >
            Place Your Order
          </Button>
        </Section>

        <Text className="text-lg">
          If you have any questions regarding pricing, delivery schedule, or
          product availability, please contact our team.
        </Text>
        <Text className="font-semibold text-lg">
          We look forward to serving your business.
        </Text>
      </Section>
    </EmailTemplate>
  );
};

export default CustomerApproved;
