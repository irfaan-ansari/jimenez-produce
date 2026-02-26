import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CTA } from "@/components/cta";
import { HOME_SECTIONS } from "@/lib/constants/web";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { Container } from "@/components/container";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GettingStartedList } from "@/components/getting-started-progress";

const { hero, serve, steps, chooseUs, marquee, categories } = HOME_SECTIONS;
export default function Page() {
  return (
    <>
      {/* hero */}
      <section>
        <div className="grid items-center grid-cols-1 overflow-hidden">
          {/* image */}
          <div className="col-start-1 row-start-1 size-full">
            <Image
              width={1800}
              height={900}
              src={hero.image}
              alt="Hero banner"
              priority
              className="w-full h-full max-h-192  object-cover object-center"
            />
          </div>
          {/* content */}
          <div className="col-start-1 row-start-1 size-full">
            <Container className="h-full">
              <div className="relative py-20 max-w-2xl">
                <span className="absolute -inset-40 bg-primary/10 mask-x-from-70% mask-y-from-90% backdrop-blur-xs"></span>
                <div className="flex items-start flex-col gap-8 relative ">
                  <h1 className="text-5xl/tight md:text-7xl/tight font-bold uppercase font-heading">
                    {hero.title}
                  </h1>
                  <h2 className="text-xl max-w-lg">{hero.description}</h2>
                  <p className="text-sm italic">{hero.badge}</p>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild size="xl" className="">
                      <Link href="/about">Apply for an Account</Link>
                    </Button>
                    <Button
                      asChild
                      size="xl"
                      variant="outline"
                      className="text-foreground"
                    >
                      <Link href="/about">View Products</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </section>

      {/* who we serve */}
      <section className="mt-16">
        <Container>
          <div className="space-y-8">
            <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-bold uppercase">
              Who We Serve
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
              {serve.map((item, i) => (
                <Card className="ring-0 shadow-sm" key={item.title}>
                  <CardHeader>
                    <span className="inline-flex size-12 items-center justify-center bg-highlight text-primary-foreground rounded-lg">
                      <item.icon className="size-6" />
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-10">
                    <h4 className="text-3xl uppercase font-semibold font-heading">
                      {item.title}
                    </h4>
                    <p className="text-base">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* suppliers marquee */}
      <section className="mt-16">
        <Container className="relative overflow-hidden">
          <Marquee className="gap-16">
            <div className="flex gap-16 items-center">
              {marquee.map((img, i) => (
                <div
                  className="bg-linear-to-br from-foreground/5 to-foreground/20"
                  key={img + i}
                >
                  <Image
                    src={img}
                    alt={img}
                    width={200}
                    height={200}
                    className="size-20"
                  />
                </div>
              ))}
            </div>
          </Marquee>
          <div className="from-background pointer-events-none absolute inset-y-0 -left-4 w-24 bg-linear-to-r"></div>
          <div className="from-background pointer-events-none absolute inset-y-0 -right-4 w-24 bg-linear-to-l"></div>
        </Container>
      </section>

      {/* categories */}
      <section className="mt-16">
        <Container>
          <div className="space-y-8">
            <div className="flex flex-col items-start gap-4 justify-between sm:flex-row sm:items-center">
              <h2 className="text-4xl font-semibold font-heading">
                Featured Categories
              </h2>
              <Button asChild size="xl">
                <Link href="/products">
                  View catalog
                  <ArrowRight />
                </Link>
              </Button>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-8">
                {categories.map((cat, i) => (
                  <CarouselItem
                    key={i}
                    className="pl-8 basis-2/3 md:basis-1/3 lg:basis-1/4"
                  >
                    <Link
                      href={`/catalog?cat=${cat.title}`}
                      className="block pb-0.5 pl-0.5 hover:[&_img]:scale-110"
                    >
                      <div className="rounded-[0.5rem] shadow-sm overflow-hidden bg-linear-to-br from-secondary via-background to-secondary  relative">
                        <div className="overflow-hidden">
                          <Image
                            width={600}
                            height={900}
                            src={cat.image}
                            alt={cat.image}
                            className="relative z-2 w-full transition ease-out object-cover rounded-t-[0.5rem] aspect-square backdrop-blur-3xl"
                          />
                        </div>
                        <div className="p-6">
                          <h4 className="text-lg font-semibold">{cat.title}</h4>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-3" />
              <CarouselNext className="-right-3" />
            </Carousel>
          </div>
        </Container>
      </section>

      {/* getting started */}
      <section className="mt-16 bg-secondary py-16">
        <Container>
          <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row">
              <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-bold uppercase">
                Getting Started with <br />
                <span className="text-primary">Jimenez Produce</span>
              </h2>
              <p className="opacity-80 text-base/normal max-w-sm ml-auto">
                We make it easy for foodservice operations to start working with
                Jimenez Produce. Our onboarding process is designed to be clear,
                efficient, and focused on getting your account set up quickly.
              </p>
            </div>

            <GettingStartedList steps={steps} />
          </div>
        </Container>
      </section>

      {/* why choose us */}
      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-8 max-w-2xl">
              <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-bold uppercase">
                Why Choose Us
              </h2>
              <div className="flex flex-col gap-6">
                {chooseUs.map((item) => (
                  <div className="flex items-start gap-4" key={item.title}>
                    <div className="shrink-0 pt-1">
                      <CircleCheck className="size-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-medium font-heading">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-secondary aspect-[1/0.8]">
              <Image
                width={600}
                height={600}
                src="/why-choose-us.jpeg"
                alt="Event cover"
                className="object-cover aspect-[1/0.8]"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* fast delivery area */}
      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1">
            <div className="col-start-1 row-start-1 rounded-lg overflow-hidden">
              <Image
                src="/reliable-delivery.jpeg"
                width={1600}
                height={600}
                alt="Truck image"
                className="w-full h-172 md:h-152 object-cover object-right"
              />
            </div>

            <div className="col-start-1 row-start-1 flex flex-col h-full justify-center relative">
              <span className="absolute inset-0 z-0 bg-linear-to-r from-black/60 backdrop-blur-sm"></span>
              <div className="max-w-4xl mx-auto text-center px-6 py-20">
                <h2 className="text-4xl/tight relative sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-bold uppercase text-primary-foreground">
                  Fast & Reliable Delivery
                </h2>
                <p className="text-white text-lg mt-4 relative">
                  We take pride in delivering our products with our own fleet of
                  trucks, operated exclusively by professional drivers. This
                  ensures the highest level of care, reliability, and efficiency
                  in every delivery. With our dedicated team and well-maintained
                  vehicles, we guarantee that your orders arrive on time, every
                  time. Trust us for seamless, punctual, and professional
                  service from start to finish.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* coverage area */}

      {/* safetty and quality */}
      <section className="mt-16">
        <Container>
          <div className="space-y-8">
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-bold uppercase">
                Food Safety & Quality
              </h2>
              <p className="text-muted-foreground">
                We take food safety seriously. From receiving to delivery, our
                trained team handles every step with care, cleanliness, and
                consistency. You can count on us for safe, reliable distribution
                that helps your operation run smoothly and confidently.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOME_SECTIONS.quality.map((item, i) => (
                <div key={i} className="space-y-6 rounded-lg overflow-hidden">
                  <div className="aspect-video bg-secondary rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      width={600}
                      height={400}
                      alt={item.title}
                      className="aspect-video object-cover"
                    />
                  </div>
                  <h4 className="text-xl font-medium">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* cta */}
      <CTA />
    </>
  );
}
