import { Heading, Img, Section } from "@react-email/components";

export const Header = () => {
  return (
    <Section className="py-10  text-center bg-[#80b83a]">
      <Img
        src={`https://jimenezproduce.com/logo.png`}
        width="100"
        height="100"
        alt="Logo"
        className="h-24 w-auto mx-auto aspect-square object-contain bg-white p-2 rounded-full"
      />
      <Heading className="text-4xl font-bold text-center text-white">
        Application Approved
      </Heading>
    </Section>
  );
};
