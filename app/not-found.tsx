import Link from "next/link";
import Image from "next/image";
import { HOME_SECTIONS } from "@/lib/constants/web";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";

const { hero } = HOME_SECTIONS;

const NotFound = () => {
  return (
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
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="w-full h-svh  object-cover object-left md:object-center"
          />
        </div>
        {/* content */}
        <div className="col-start-1 row-start-1 size-full backdrop-blur-2xl bg-black/20">
          <Container className="max-w-xl text-center py-20 h-full flex flex-col justify-center text-primary-foreground">
            <div className="flex flex-col gap-8 justify-center">
              <h1 className="text-4xl/tight sm:text-5xl/tight md:text-7xl/tight flex-1 font-heading font-bold uppercase">
                <span className="text-8xl md:text-9xl tracking-[1.5rem]">
                  404
                </span>
                <br />
                Page Not Found
              </h1>

              <h2 className="text-xl font-medium font-sans">
                The page you’re looking for could not be found. It may have been
                moved or removed.
              </h2>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="xl" className="">
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
