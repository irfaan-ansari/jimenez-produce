import { Metadata } from "next";
import { notFound } from "next/navigation";
import Markdown from "@/components/markdown";
import { Container } from "@/components/container";
import { OPEN_POSITIONS } from "@/lib/constants/web";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ position: string }>;
}): Promise<Metadata> => {
  const { position } = await params;

  const content = OPEN_POSITIONS.find((pos) => pos.href === position);

  if (!content) return {};

  return {
    title: content.title,
    description: content.description,
  };
};

const ApplicationPage = async ({
  params,
}: {
  params: Promise<{ position: string }>;
}) => {
  const { position } = await params;

  const content = OPEN_POSITIONS.find((pos) => pos.href === position);

  if (!content) notFound();

  return (
    <>
      {/* page title */}
      <section className="py-16 bg-highlight text-primary-foreground">
        <Container>
          <div className="flex flex-col items-center h-full">
            <div className="space-y-6 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-semibold uppercase">
                {content.title}
              </h2>
              <p className="text-lg">{content.description}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* page content */}
      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-8 gap-16 @container">
            {/* requirments/additional details - desktop */}
            <div className="col-span-8 lg:col-span-3 lg:order-2">
              <div className="bg-secondary p-6 sticky top-24">
                <Markdown content={content.details} />
              </div>
            </div>
            <div className="col-span-8 lg:col-span-5">
              {/* form */}
              <content.form
                position={content.title}
                location={content.location}
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ApplicationPage;
