import { Text, Section } from "@react-email/components";

export const Footer = () => {
  return (
    <Section className="bg-[#f9f9f9] p-6 text-center">
      <Text className="text-4xl font-bold text-[#626262]">Jimenez Produce</Text>
      <Text className="text-[#626262]">
        - 23141 Rubens Ln, Robertsdale, AL 36567
        <br />
        - 100 Goldenrod Dr, Lafayette, LA 70507
        <br />
        info@jimenezproduce.com
      </Text>
    </Section>
  );
};
