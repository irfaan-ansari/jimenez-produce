"use client";
import { useParams } from "next/navigation";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { useOrderGuide } from "@/hooks/use-orders";
import { OrderGuideForm } from "../_components/order-guide-form";

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
    id: data.id,
    teamId: data.teamId,
    name: data.name,
    description: data.description || "",
    items: data.items.map((item) => ({
      title: item.title,
      categories: item.categories || [],
      image: item.image,
      price: item.finalPrice,
      productId: item.productId,
    })),
  };

  return <OrderGuideForm initialData={formData} />;
};
