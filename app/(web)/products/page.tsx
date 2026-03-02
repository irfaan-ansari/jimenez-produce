import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";

import { fetcher } from "@/lib/helper/fetcher";
import { ProductResponse } from "@/lib/types";
import { Pagination } from "@/components/admin/pagination";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse our foodservice catalog featuring fresh produce and essential supplies for restaurants, food trucks, and commercial kitchens.",
};

const CatalogPage = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const query = (await searchParams) || {};

  const response = await fetcher<ProductResponse & { access: string }>(
    `${process.env.BETTER_AUTH_URL}/api/products`
  );

  const { data, access, pagination } = response;

  return (
    <section className="my-16">
      <Container>
        <div className="flex gap-6 justify-between items-center mb-6">
          <span className="font-medium font-heading uppercase">
            Products {pagination.total}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {data.map((product) => (
            <div
              key={product.identifier}
              className="rounded-[0.5rem] hover:[&_img]:scale-110 bg-linear-to-br from-secondary via-background to-secondary  relative shadow-sm"
            >
              <div className="rounded-[0.5rem] overflow-hidden relative aspect-square">
                {product.image && (
                  <Image
                    width={600}
                    height={900}
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="relative z-1 w-full object-contain transition ease-out aspect-square rounded-lg"
                  />
                )}
              </div>
              <div className="p-4 mt-auto">
                <h3 className="font-medium text-sm lg:text-base">
                  {product.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* pagination */}
        {access === "no_access" ? (
          <div className="mt-16 py-16 px-6 lg:px-16 bg-primary">
            <div className="space-y-8">
              <div className="space-y-4 text-center max-w-2xl mx-auto text-background">
                <h2 className="text-4xl/tight sm:text-5xl/tight md:text-6xl/tight flex-1 font-heading font-semibold">
                  Access Complete Catalog
                </h2>
                <p className=" text-lg">
                  Get access to our complete product catalog, bulk pricing, and
                  availability. Submit a quick request and our team will review
                  your access.
                </p>
              </div>
              <div className="text-center">
                <Button
                  asChild
                  size="xl"
                  className="bg-foreground hover:bg-foreground/80"
                >
                  <Link href="/contact#contact-form">Request Catalog</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Pagination
            page={pagination.page}
            limit={pagination.limit}
            total={pagination.total}
            totalPages={pagination.totalPages}
            onPageChange={(e) => console.log(e)}
          />
        )}
      </Container>
    </section>
  );
};

export default CatalogPage;
