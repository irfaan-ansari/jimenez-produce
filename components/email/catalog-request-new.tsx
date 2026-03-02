import { EmailTemplate } from "./email-template";
import { Section, Text } from "@react-email/components";

interface CustomerApprovedProps {
  name: string;
  company: string;
  message: string;
}

const CatalogRequestNew = ({
  name,
  message,
  company,
}: CustomerApprovedProps) => {
  return (
    <EmailTemplate template="customer" heading="Request Submitted">
      <Section className="p-6">
        <Text className="text-xl text-black font-semibold mb-2">
          Hello {name || "Name"},
        </Text>

        <Text className="text-lg">
          We have received catalog access request for {company || "Company"}.
          Our team is currently reviewing your submission.
        </Text>

        <Text className="text-lg">{message || "Message"}</Text>

        <Section className="shadow-sm p-6 mt-4">
          <Text className="text-lg uppercase font-semibold text-[#80b83a]">
            Need Assistance?
          </Text>

          <Text className="text-lg">
            If you have any questions regarding your catalog access status,
            please contact our support team for further assistance.
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

export default CatalogRequestNew;
