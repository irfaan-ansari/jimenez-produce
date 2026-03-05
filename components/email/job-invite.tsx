import { EmailTemplate } from "./email-template";
import { Section, Text, Button, Heading } from "@react-email/components";

interface Props {
  name: string;
  position: string;
  positionSlug: string;
}

export const JobInvitation = ({ name, position, positionSlug }: Props) => {
  return (
    <EmailTemplate heading="Join Our Team" template="customer">
      <Section className="p-8">
        <Heading className="text-2xl text-black font-bold mb-4">
          New Career Opportunity: {position}
        </Heading>

        <Heading className="text-xl font-bold text-black mb-6">
          Hi {name},
        </Heading>

        <Text className="text-lg leading-relaxed mb-6">
          We’re currently looking for a <strong>{position}</strong> to join our
          team at <strong>Jimenez Produce</strong>, and your profile caught my
          eye.
        </Text>

        <Text className="text-lg leading-relaxed mb-6">
          We’re specifically looking for someone who takes pride in their work
          and wants to play a key role in a fast-growing environment. Based on
          your experience, I think you’d be a great fit for the culture we’re
          building here.
        </Text>

        <Text className="text-lg font-semibold mb-10">
          Would you be open to taking a look at the role?
        </Text>

        <Button
          href={`https://jimenezproduce.com/careers/${positionSlug}`}
          className="bg-[#80b83a] text-white px-8 py-4 flex justify-center font-bold uppercase no-underline"
        >
          Apply Now
        </Button>
        <Text className="text-sm text-gray-400 mt-6">
          If you're not looking right now, feel free to pass this along to
          someone in your network!
        </Text>
      </Section>
    </EmailTemplate>
  );
};

export default JobInvitation;
