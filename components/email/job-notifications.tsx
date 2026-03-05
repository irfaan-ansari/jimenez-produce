import { EmailTemplate } from "./email-template";
import { Section, Text } from "@react-email/components";

interface Props {
  name: string;
  position: string;
  location: string;
  email: string;
  phone: string;
  status: string;
  statusReason?: string;
  statusDetails?: string;
  internalNotes?: string;
}

const STATUS_MESSAGE = {
  new: "A new job application has been received.",
  interview: "The candidate has been moved to the Interview stage.",
  pending: "An agreement has been sent to the candidate.",
  hired: "Congratulations! The candidate has been officially hired.",
  rejected:
    "The application has been closed and the candidate was not selected.",
};

export const JobApplicationAdmin = ({
  name,
  position,
  location,
  email,
  phone,
  status = "new",
  statusReason,
  statusDetails,
  internalNotes,
}: Props) => {
  return (
    <EmailTemplate heading="Job Application Update" template="admin">
      <Section className="p-6">
        <Text className="text-xl text-black font-semibold mb-2">
          Hello Team,
        </Text>

        <Text className="text-lg text-[#404040]">
          {STATUS_MESSAGE[status as keyof typeof STATUS_MESSAGE]}
        </Text>

        <Section className="border border-[#f4f5f6] p-6 mt-6">
          <Text className="text-base mb-1">
            <strong>Name:</strong> {name}
          </Text>
          <Text className="text-base mb-1">
            <strong>Position:</strong> {position}
          </Text>
          <Text className="text-base mb-1">
            <strong>Facility:</strong> {location}
          </Text>
          <Text className="text-base mb-1">
            <strong>Contact Details:</strong> {email} | {phone}
          </Text>
        </Section>

        {/* Dynamic Update Section */}
        {(statusDetails || internalNotes) && (
          <Section className="border-l-4 border-[#80b83a] bg-[#f9fafb] p-6 mt-6">
            <Text className="text-xs uppercase font-bold text-[#80b83a] mt-0 mb-2">
              Current Stage: {status.toUpperCase()}
            </Text>

            {statusReason && <Text> Reason: {statusReason}</Text>}
            {statusDetails && (
              <Text className="text-base text-black mt-0 mb-2 italic">
                "{statusDetails}"
              </Text>
            )}

            {internalNotes && (
              <>
                <Text className="text-xs uppercase font-bold text-gray-400 mt-4 mb-1">
                  Internal Notes:
                </Text>
                <Text className="text-sm text-[#404040] mt-0">
                  {internalNotes}
                </Text>
              </>
            )}
          </Section>
        )}
      </Section>
    </EmailTemplate>
  );
};

export default JobApplicationAdmin;
