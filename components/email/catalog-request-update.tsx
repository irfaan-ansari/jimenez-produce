import { EmailTemplate } from "./email-template";
import { Button, Section, Text } from "@react-email/components";

interface CustomerApprovedProps {
  name: string;
  message?: string;
  company: string;
  status: string;
  link?: string;
  reason?: string;
}

const CatalogRequestUpdate = ({
  name,
  reason,
  message,
  company,
  status = "approved",
  link,
}: CustomerApprovedProps) => {
  return (
    <EmailTemplate template="customer" heading="Catalog Access Update">
      <Section className="p-6">
        <Text className="text-xl text-black font-semibold mb-2">
          Hello {name || "Name"},
        </Text>

        {status === "approved" && (
          <Text className="text-lg">
            We are pleased to inform you that your catalog access request for{" "}
            <strong>{company || "Company"}</strong> has been approved.
            <br />
            <br />
            You may now access our product catalog, including available items
            and related information.
          </Text>
        )}
        {status === "rejected" && (
          <Text className="text-lg">
            Thank you for your interest with Jimenez Produce.
            <br />
            <br />
            After reviewing your application, we are unable to approve your
            catalog access request at this time.
            <br />
            <br />
            This decision may be based on internal credit review, incomplete
            documentation, or service area limitations.
          </Text>
        )}
        {status === "revoked" && (
          <Text className="text-lg">
            Your catalog access has been discontinued following a recent account
            review.
            <br />
            <br />
            This action may be based on internal credit evaluation,
            documentation requirements, service area limitations, or account
            policy considerations.
          </Text>
        )}

        {link && (
          <Button
            href={link}
            target="_blank"
            className="bg-[#80b83a] rounded-lg p-4 text-white uppercase text-sm font-semibold inline-flex items-center mb-4"
          >
            View Products
          </Button>
        )}

        {reason && (
          <Section className="p-6 mt-4 border border-[#f4f5f6]">
            <Text className="text-lg uppercase font-semibold text-[#80b83a]">
              Reason: {reason}
            </Text>

            {message && <Text className="text-lg">{message}</Text>}
          </Section>
        )}

        <Section className="p-6 mt-4 border-[#f4f5f6]">
          <Text className="text-lg uppercase font-semibold text-[#80b83a]">
            Need Assistance?
          </Text>

          <Text className="text-lg">
            If you have any questions regarding catalog access, please contact
            our support team for further assistance.
          </Text>
        </Section>
      </Section>
    </EmailTemplate>
  );
};

export default CatalogRequestUpdate;
