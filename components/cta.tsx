import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Button } from "./ui/button";
import Link from "next/link";

export const CTA = ({ className }: { className?: string }) => {
  return (
    <section className={cn("mt-16 py-16 bg-highlight", className)}>
      <Container>
        <div className="space-y-8">
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl/tight sm:text-5xl/tight md:text-6xl/tight flex-1 font-heading font-semibold text-primary-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-foreground">
              If you operate a restaurant, food truck, or commercial kitchen,
              apply for a Jiménez Produce account to get started with a reliable
              foodservice distributor.
            </p>
          </div>
          <div className="text-center">
            <Button
              asChild
              size="xl"
              className="bg-foreground hover:bg-foreground/80"
            >
              <Link href="/apply">Apply for an Account</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
