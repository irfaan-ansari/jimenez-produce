import { Container } from "@/components/container";
import { CustomerDataForm } from "@/components/customer-form/customer-data-form";

const CustomerFormPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ name: string }>;
}) => {
  const { name } = await searchParams;
  return (
    <>
      <section className="bg-highlight py-16 text-primary-foreground">
        <Container>
          <div className="flex h-full flex-col items-center">
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <h2 className="flex-1 font-heading text-4xl/tight font-semibold uppercase sm:text-5xl/tight md:text-7xl/tight">
                Company Information
              </h2>
              <p className="text-lg">
                Help us keep your details accurate so we can serve you better.
              </p>
            </div>
          </div>
        </Container>
      </section>
      <section className="mt-16">
        <Container className="mb-16 max-w-3xl p-8 shadow-sm">
          <CustomerDataForm name={name} />
        </Container>
      </section>
    </>
  );
};

export default CustomerFormPage;
