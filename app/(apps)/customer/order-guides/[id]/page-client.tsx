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
  console.log(data);
  return <OrderGuideForm />;
};
