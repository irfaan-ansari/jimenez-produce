import { Column, Heading, Img, Row, Section } from "@react-email/components";

export const Header = () => {
  return (
    <Section className="flex gap-4 p-6">
      <Row className="gap-4">
        <Column>
          <Img
            src={`${process.env.BETTER_AUTH_URL}/logo.png`}
            width="60"
            height="60"
            alt="Logo"
            className="h-14 w-auto"
          />
        </Column>
        <Column>
          <Heading className="ml-4 inline-block text-center font-semibold text-xl text-black">
            Jimenez Produce
          </Heading>
        </Column>
      </Row>
    </Section>
  );
};
