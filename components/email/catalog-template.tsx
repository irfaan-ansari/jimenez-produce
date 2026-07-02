import { Button, Section, Text } from "@react-email/components";

import { EmailTemplate } from "./email-template";

interface Props {
  name?: string;
  pdfUrl: string;
  digitalUrl?: string;
}

export const CatalogTemplate = ({ name, pdfUrl, digitalUrl }: Props) => {
  return (
    <EmailTemplate template="customer" heading="Weekly Product Catalog">
      <Section className="p-6">
        <Text className="text-xl text-black font-semibold mb-2">Hello,</Text>

        <Text className="text-lg mb-4">
          Click the button below to view the latest products and prices.
        </Text>

        <Text className="text-base text-gray-700 mb-6">
          Click the button below to view the catalog in your browser.
        </Text>
        <Section className="my-8 text-center">
          <Button
            href={pdfUrl}
            className="rounded-md bg-green-700 px-6 py-3 text-white font-medium no-underline"
          >
            View Catalog
          </Button>
        </Section>
        <Text className="text-base text-gray-700 mt-6">
          If you have any questions or would like to place an order, simply
          reply to this email—we're happy to help.
        </Text>

        <Text className="text-base text-gray-700 mt-6">
          Thank you for choosing us!
        </Text>
      </Section>
    </EmailTemplate>
  );
};

export default CatalogTemplate;
