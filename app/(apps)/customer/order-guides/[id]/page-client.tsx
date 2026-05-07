"use client";
import { useParams } from "next/navigation";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { useOrderGuide } from "@/hooks/use-orders";
import { OrderGuideForm } from "../order-guide-form";

export const PageClient = () => {
  const params = useParams();
  const id = params.id;
  const {
    data: result,
    isPending,
    error,
    isError,
  } = useOrderGuide(id as string);

  if (isPending) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }
  const { data } = result;

  const formData = {
    name: data.name,
    description: data.description,
    items: data.items.map((item) => ({
      title: item.title,
      identifier: item.identifier,
      categories: item.categories,
      image: item.image,
      basePrice: item.finalPrice,
      productId: item.productId,
      quantity: item.quantity,
      position: item.position,
    })),
  };

  // @ts-expect-error
  return <OrderGuideForm initialData={formData} />;
};
