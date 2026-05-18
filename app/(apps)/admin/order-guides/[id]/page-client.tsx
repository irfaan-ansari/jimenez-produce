"use client";
import { useParams } from "next/navigation";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { useAdminOrderGuide } from "@/hooks/use-orders";
import { OrderGuideForm } from "../_components/order-guide-form";

export const PageClient = () => {
  const params = useParams();
  const id = params.id;
  const {
    data: result,
    isPending,
    isError,
    error,
  } = useAdminOrderGuide(id as string);

  if (isPending) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }
  const { data } = result;

  const formData = {
    id: data.id,
    name: data.name,
    description: data.description || "",
    items: data.items.map((item) => ({
      title: item.title,
      categories: item.categories || [],
      image: item.image,
      price: item.finalPrice,
      productId: item.productId,
    })),
    teams: data.teams.map((team) => ({
      id: String(team.id),
      name: team.name,
    })),
  };

  return <OrderGuideForm initialData={formData} />;
};
