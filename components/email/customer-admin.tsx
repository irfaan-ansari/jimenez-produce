import { EmailTemplate } from "./email-template";
import { Section, Text } from "@react-email/components";

interface Props {
  name: string;
  phone: string;
  email: string;
  address: string;
  primaryContact: string;
  primaryPhone: string;
  primaryEmail: string;
  status: string;
  statusDetails?: string;
  statusReason?: string;
  internalNotes?: string;
}
const STATUS_MESSAGE = {
  new: "A new customer account application has been submitted.",
  under_review: "The customer account application is currently under review.",
  on_hold: "The customer account application has been placed on hold.",
  approved: "The customer account application has been approved.",
  rejected: "The customer account application has been rejected.",
};
export const CustomerAdmin = ({
  name,
  phone,
  email,
  address,
  primaryContact,
  primaryEmail,
  primaryPhone,
  status = "new",
  statusDetails,
  statusReason,
  internalNotes,
}: Props) => {
  return (
    <EmailTemplate heading="Customer Application Update" template="admin">
      <Section className="p-6">
        <Text className="text-xl text-black font-semibold mb-2">
          Hello Team,
        </Text>

        <Text className="text-lg">
          {STATUS_MESSAGE[status as keyof typeof STATUS_MESSAGE]}
        </Text>

        <Section className="border border-[#f4f5f6] p-6 mt-6">
          <Text className="text-lg uppercase font-semibold  my-0">
            Company Name:
          </Text>
          <Text className="text-base text-[#404040] mt-0">{name || "N/A"}</Text>

          <Text className="text-lg uppercase font-semibold my-0">
            Company Phone:
          </Text>
          <Text className="text-base text-[#404040] mt-0">
            {phone || "N/A"}
          </Text>

          <Text className="text-lg uppercase font-semibold my-0">
            Company Email:
          </Text>
          <Text className="text-base text-[#404040] mt-0">
            {email || "N/A"}
          </Text>

          <Text className="text-lg uppercase font-semibold my-0">Address:</Text>
          <Text className="text-base text-[#404040] mt-0">
            {address || "N/A"}
          </Text>

          <Text className="text-lg uppercase font-semibold my-0">
            Primary Contact:
          </Text>
          <Text className="text-base text-[#404040] mt-0">
            {primaryContact || "N/A"}
          </Text>

          <Text className="text-base font-semibold my-0">Phone:</Text>
          <Text className="text-base text-[#404040] mt-0">
            {primaryPhone || "N/A"}
          </Text>

          <Text className="text-base font-semibold my-0">Email:</Text>
          <Text className="text-base text-[#404040] mt-0">
            {primaryEmail || "N/A"}
          </Text>
        </Section>
        {statusReason && (
          <Section className="border border-[#f4f5f6] p-6 mt-6">
            <Text className="text-lg uppercase font-semibold text-[#80b83a] mt-0">
              Reason:
            </Text>
            {statusDetails && <Text className="text-lg">{statusDetails}</Text>}
            {internalNotes && (
              <>
                <Text className="text-lg uppercase font-semibold text-[#80b83a] mt-0">
                  Notes:
                </Text>
                <Text className="text-lg">{internalNotes}</Text>
              </>
            )}
          </Section>
        )}
      </Section>
    </EmailTemplate>
  );
};

export default CustomerAdmin;
