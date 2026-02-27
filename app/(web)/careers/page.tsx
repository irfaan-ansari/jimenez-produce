import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { OPEN_POSITIONS } from "@/lib/constants/web";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore career opportunities in foodservice distribution. Join our team serving restaurants and commercial kitchens across the Gulf Coast.",
};

const CareersPage = () => {
  return (
    <>
      {/* page title*/}
      <section className="py-16 bg-highlight text-primary-foreground">
        <Container>
          <div className="flex flex-col items-center h-full">
            <div className="space-y-6 text-center max-w-xl mx-auto">
              <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-semibold uppercase">
                Careers
              </h2>
              <p className="text-lg">
                We believe great produce starts with great people. Join a
                dependable, fast-growing team committed to quality, safety, and
                service.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* open positions */}
      <section className="my-16">
        <Container className="max-w-4xl">
          <div className="flex flex-col gap-8">
            {OPEN_POSITIONS.map((position) => (
              <Link
                href={`/careers/${position.href}`}
                key={position.href}
                className="flex"
              >
                <Card>
                  <CardContent className="flex gap-8">
                    <div className="flex-1">
                      <CardTitle className="text-3xl uppercase font-semibold font-heading mb-4">
                        {position.title}
                      </CardTitle>
                      <div className="flex gap-4 items-center mb-6">
                        {position.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-sm h-6"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {position.location && (
                          <Badge variant="secondary" className="text-sm h-6">
                            {position.location}
                          </Badge>
                        )}
                      </div>

                      <CardDescription className="text-base">
                        {position.description}
                      </CardDescription>
                    </div>
                    <div className="shrink-0">
                      <Button size="lg" className="min-w-40">
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};

export default CareersPage;
