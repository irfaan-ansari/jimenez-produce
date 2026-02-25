import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@/components/ui/map";
import Image from "next/image";
import { Metadata } from "next";
import { CTA } from "@/components/cta";
import Markdown from "@/components/markdown";
import { Marquee } from "@/components/ui/marquee";
import { Container } from "@/components/container";
import { Card, CardTitle } from "@/components/ui/card";
import { AtSign, MapPinned, Phone } from "lucide-react";
import {
  ABOUT_SECTIONS,
  CONTACT_SECTIONS,
  COVERAGE_LOCATIONS,
} from "@/lib/constants/web";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about our commitment to reliable foodservice distribution, fresh produce sourcing, and dependable delivery for Gulf Coast restaurants.",
};

const AboutPage = () => {
  return (
    <>
      {/* page title */}
      <section className="bg-highlight py-16 text-primary-foreground">
        <Container>
          <div className="flex flex-col items-center h-full">
            <div className="space-y-6 text-center max-w-xl mx-auto">
              <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-semibold uppercase">
                About us
              </h2>
              <p className="text-lg">
                We are a produce and foodservice distributor built on
                reliability and quality. As your trusted partner, we deliver
                consistent products and dependable service you can count on.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* who are we */}
      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="space-y-4 max-w-lg">
                <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-semibold uppercase">
                  Who Are We
                </h2>
                <p className="text-muted-foregorund">
                  We are a team of professionals committed to supporting the
                  success of our customers. Our people understand the demands of
                  the foodservice industry and take pride in doing things the
                  right way—every time. Through disciplined processes, hands-on
                  service, and a partnership mindset, we help our customers
                  operate confidently and efficiently.
                  <br />
                  <br />
                  With experienced leadership and a dedicated team, we operate
                  with a strong focus on food safety, quality control, and
                  operational efficiency. From our warehouse to your kitchen, we
                  maintain high standards to ensure product integrity at every
                  step.
                </p>
              </div>
            </div>
            <div className="bg-secondary aspect-[1/0.8]">
              <Image
                src="/truck-wrap.jpg"
                alt="What we do"
                width={900}
                height={900}
                className="aspect-[1/0.8] object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* what we do */}
      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="bg-secondary">
              <Image
                src="/hero-2.png"
                alt="What we do"
                width={900}
                height={900}
                className="aspect-[1/0.8] object-cover"
              />
            </div>
            <div className="space-y-8">
              <div className="space-y-4 max-w-lg">
                <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-semibold uppercase">
                  What We Do
                </h2>
                <p className="text-muted-foregorund">
                  We focus on dependable service, consistent product quality,
                  and professional operations designed to meet the demands of
                  foodservice environments. <br /> <br />
                  We operate like a service partner, not just another truck.
                  That means route planning around your prep time, consistent
                  quality checks, bilingual support, and a team that actually
                  picks up the phone when you need help.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <Card className="ring-0 shadow-sm">
                  <div className="space-y-6 px-6">
                    <CardTitle className="text-3xl font-bold text-primary">
                      150+
                    </CardTitle>
                    <p className="text-base text-muted-foreground">
                      Active Customers
                    </p>
                  </div>
                </Card>
                <Card className="ring-0 shadow-sm">
                  <div className="space-y-6 px-6">
                    <CardTitle className="text-3xl font-bold text-primary">
                      10+
                    </CardTitle>
                    <p className="text-base text-muted-foreground">
                      Coverage Areas
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* coverage area */}
      <section className="mt-16 overflow-hidden">
        <Container>
          <div className="space-y-4">
            <h2 className="text-4xl/tight shrink-0 sm:text-5xl/tight md:text-7xl/tight font-heading font-semibold uppercase min-w-xs">
              coverage area
            </h2>
            <div className="space-y-0 flex-wrap overflow-hidden">
              <Marquee pauseOnHover className="[--duration:80s]">
                {COVERAGE_LOCATIONS.map((area, i) => (
                  <span
                    key={i}
                    className="h-8 px-3 border inline-flex items-center justify-center"
                  >
                    {area.label}
                  </span>
                ))}
              </Marquee>
              <Marquee reverse pauseOnHover className="[--duration:80s]">
                {COVERAGE_LOCATIONS.map((area, i) => (
                  <span
                    key={i}
                    className="h-8 border px-3 inline-flex items-center justify-center"
                  >
                    {area.label}
                  </span>
                ))}
              </Marquee>
            </div>
          </div>
          <div className="h-100 mt-8">
            <Map zoom={5} center={[-89.0174859, 31.282803]}>
              {COVERAGE_LOCATIONS.map((area) => (
                <MapMarker
                  key={area.label}
                  longitude={area.lng}
                  latitude={area.lat}
                >
                  <MarkerContent>
                    <div className="size-7 bg-primary rounded-full inline-flex items-center justify-center relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-primary-foreground size-4 opacity-80"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
                      </svg>
                    </div>
                  </MarkerContent>

                  <MarkerTooltip className="bg-background text-foreground rounded-[1rem]">
                    <div className="p-1">{area.label}</div>
                  </MarkerTooltip>
                </MapMarker>
              ))}
            </Map>
          </div>
        </Container>
      </section>

      {/* how we work */}
      <section className="mt-16">
        <Container>
          <div className="space-y-8">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-semibold uppercase">
                How We Work
              </h2>
              <p className="opacity-80 text-base/normal">
                We don’t promise perfection — we promise responsiveness,
                consistency, and a focus on long-term relationships. Our
                approach is simple, reliable, and built around supporting your
                day-to-day operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ABOUT_SECTIONS.howWeWork.map((item, i) => (
                <div key={i} className="flex flex-col gap-4 shadow-sm p-6">
                  <h4 className="text-xl font-medium font-heading">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* warehouses and story */}
      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="max-w-xl space-y-4">
                <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-semibold uppercase">
                  Warehouses
                </h2>
                <p className="text-muted-foregorund">
                  Our Robertsdale and Lafayette warehouses allow us to structure
                  AM-focused routes along the I-10 corridor and surrounding
                  markets.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                {CONTACT_SECTIONS.locations.map((loc) => (
                  <div className="space-y-2" key={loc.name}>
                    <h5 className="text-lg font-semibold">{loc.name}</h5>
                    <div className="space-y-1">
                      {loc.phone && (
                        <div className="flex items-center gap-2">
                          <span className="shadow-sm size-8 rounded-full text-primary-foreground bg-highlight inline-flex items-center justify-center">
                            <Phone className="size-4" />
                          </span>
                          <a
                            href={`tel:${loc.phone}`}
                            className="text-muted-foreground hover:underline hover:text-foreground transition ease-out"
                          >
                            {loc.phone}
                          </a>
                        </div>
                      )}
                      {loc.email && (
                        <div className="flex items-center gap-2">
                          <span className="shadow-sm size-8 rounded-full text-primary-foreground bg-highlight inline-flex items-center justify-center">
                            <AtSign className="size-4" />
                          </span>
                          <a
                            href={`mailto:${loc.email}`}
                            className="text-muted-foreground hover:underline hover:text-foreground transition ease-out"
                          >
                            {loc.email}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="shadow-sm size-8 rounded-full text-primary-foreground bg-highlight inline-flex items-center justify-center">
                          <MapPinned className="size-4" />
                        </span>
                        <p className="text-muted-foreground">{loc.street}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-8 bg-primary/20 p-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-semibold font-heading">
                  Built to grow
                </h2>
              </div>
              <Markdown content={ABOUT_SECTIONS.story} />
            </div>
          </div>
        </Container>
      </section>

      {/* cta */}
      <CTA />
    </>
  );
};

export default AboutPage;
