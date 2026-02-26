import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@/components/ui/map";
import { Container } from "@/components/container";
import { CONTACT_SECTIONS } from "@/lib/constants/web";
import { ContactForm } from "@/components/contact-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Metadata } from "next";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { AtSign, MapPinned, Phone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with our team for reliable foodservice delivery, product inquiries, or account support across the Gulf Coast.",
};
const ContactPage = () => {
  return (
    <>
      {/* page title*/}
      <section className="bg-highlight py-16 text-primary-foreground">
        <Container>
          <div className="flex flex-col items-center h-full">
            <div className="space-y-6 text-center max-w-xl mx-auto">
              <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-semibold uppercase">
                Contact us
              </h2>
              <p className="text-lg">
                Looking for a reliable distribution partner? Get in touch with
                our team to learn how we can support your business.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* contact cards */}
      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CONTACT_SECTIONS.contacts.map((contact, i) => (
              <Card key={i} className="ring-0 shadow-sm">
                <CardHeader className="flex items-center gap-2">
                  <span className="size-12 border inline-flex items-center justify-center text-highlight">
                    <contact.icon className="size-5" />
                  </span>
                  {/* <CardTitle className="text-xl font-semibold">
                    {contact.title}
                  </CardTitle> */}
                </CardHeader>
                <CardContent className="pt-6 md:pt-10 flex flex-col text-base">
                  <h5 className="text-xl font-heading font-medium mb-2">
                    {contact.label}
                  </h5>
                  <a
                    href={`tel:${contact.phone}`}
                    className="hover:underline transition ease-out mb-1"
                  >
                    {contact.phone}
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:underline transition ease-out mb-4"
                  >
                    {contact.email}
                  </a>
                  <p className="text-muted-foreground">{contact.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* contact form */}
      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-bold uppercase">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground">
                  Quick answers to common questions about our products,
                  deliveries, and warehouse operations.
                </p>
              </div>
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
              >
                {CONTACT_SECTIONS.faqs.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index + 1}`}>
                    <AccordionTrigger
                      data-slot="accordion-trigger"
                      className="focus-visible:border-ring text-base focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&_svg:not([class*='plus-'])]:hidden"
                    >
                      {item.title}
                      <Plus className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200 plus-icon" />
                    </AccordionTrigger>

                    <AccordionContent className="text-muted-foreground">
                      {item.content}

                      {item.cta && (
                        <div className="mt-4">
                          <Button className="px-4" asChild variant="default">
                            <a
                              href="https://order.jimenezproduce.com"
                              target="_blank"
                              className="no-underline! hover:text-primary-foreground!"
                            >
                              Place Your Order
                            </a>
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div
              className="space-y-8 bg-secondary p-6 lg:p-8"
              id="contact-form"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-semibold font-heading">
                  Request catalog
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form to receive our latest product catalog and
                  connect with our team to find the right solutions for your
                  operation.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="max-w-lg">
              <div className="space-y-6 sticky top-28">
                <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-bold uppercase">
                  Warehouses
                </h2>
                <p className="opacity-80 text-base/normal">
                  Our Robertsdale and Lafayette warehouses allow us to structure
                  AM-focused routes along the I-10 corridor and surrounding
                  markets.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-8 flex-1">
              {CONTACT_SECTIONS.locations.map((loc) => (
                <div className="space-y-4 bg-card shadow-sm p-6" key={loc.name}>
                  <h5 className="text-lg font-semibold">{loc.name}</h5>
                  <div className="space-y-2">
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
                  <div className="space-y-8 mt-10">
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold">Office Hours</h4>
                      <p className="opacity-80">
                        Monday to Saturday,
                        <span className="font-medium opacity-100 ml-2">
                          9:00 AM – 5:00 PM
                        </span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold">Receiving Hours</h4>
                      <p className="opacity-80">
                        <span className="font-medium opacity-100 mr-2">
                          8:00 AM – 4:00 PM,
                        </span>
                        by appointment only
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      {/* map */}
      <section className="mt-16 h-[500px] w-full">
        <Map zoom={4} center={[-90.0174859, 30.282803]}>
          {CONTACT_SECTIONS.locations.map((location) => (
            <MapMarker
              key={location.name}
              longitude={location.lng}
              latitude={location.lat}
            >
              <MarkerContent>
                <div className="size-7 bg-primary rounded-full inline-flex items-center justify-center relative">
                  <span className="absolute inset-0 bg-primary/40 rounded-full animate-ping duration-1000"></span>
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
                <div className="p-1">{location.name}</div>
              </MarkerTooltip>
            </MapMarker>
          ))}
        </Map>
      </section>
    </>
  );
};

export default ContactPage;
