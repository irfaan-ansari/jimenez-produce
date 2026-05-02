"use client";
import { use } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline";
import { formatUSD, getAvatarFallback } from "@/lib/utils";
import { format } from "date-fns/format";
import { useTeam } from "@/hooks/use-teams";
import { Button } from "@/components/ui/button";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import {
  ChevronLeft,
  CircleDashed,
  Loader,
  PackageCheck,
  Plus,
  Trash2,
} from "lucide-react";
import { STATUS_MAP } from "@/lib/constants/status-map";
import { Badge } from "@/components/ui/badge";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { TaxRulesSelector } from "@/components/admin/tax-rules-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CopyButton } from "@/components/copy-button";
import { TaxRule } from "@/lib/types";
import { ProductSelector } from "@/components/admin/product-selector";
import { ProductSelectType } from "@/lib/db/schema";

export const PageClient = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { data: result, isPending, isError, error } = useTeam(id);

  // loading
  if (isPending) return <LoadingSkeleton />;

  // error
  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }

  const { data } = result;

  return (
    <div className="grid grid-cols-6 gap-8">
      <div className="col-span-6 space-y-6 lg:col-span-4">
        {/* page header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              asChild
              variant="outline"
              className="shrink-0 rounded-xl"
            >
              <Link href="/admin/customers/">
                <ChevronLeft /> Back
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">{data.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button size="lg">Invite Member</Button>
          </div>
        </div>

        {/* stats cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="flex-row items-start px-6">
            <div className="flex-1">
              <CardTitle className="mb-2 text-3xl font-bold">
                {/* @ts-expect-error */}
                {data.stats?.activeCount}
              </CardTitle>
              <CardDescription className="mb-6 text-base font-semibold">
                {/* @ts-expect-error */}
                {formatUSD(data.stats?.activeValue)}
              </CardDescription>
              <span className="text-sm font-medium text-muted-foreground">
                Active Orders
              </span>
            </div>
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-amber-100 p-0 text-foreground">
              <CircleDashed className="size-4" />
            </span>
          </Card>
          <Card className="flex-row items-start px-6">
            <div className="flex-1">
              <CardTitle className="mb-2 text-3xl font-bold">
                {/* @ts-expect-error */}
                {data.stats?.completedCount}
              </CardTitle>
              <CardDescription className="mb-6 text-base font-semibold">
                {/* @ts-expect-error */}
                {formatUSD(data.stats?.completedValue)}
              </CardDescription>
              <span className="text-sm font-medium text-muted-foreground">
                Completed Orders
              </span>
            </div>
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-green-100 p-0 text-foreground">
              <PackageCheck className="size-4" />
            </span>
          </Card>
        </div>

        {/* account info */}
        <Card className="rounded-2xl">
          <CardContent className="flex items-center gap-6">
            <Avatar className="size-16 shrink-0 ring-2 ring-primary/40 ring-offset-2 ring-offset-background lg:size-20">
              <AvatarImage src={data.logo} />
              <AvatarFallback>
                {getAvatarFallback(data?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-semibold">{data.name}</CardTitle>
              <CardDescription>{data.managerName}</CardDescription>
              <div className="mt-3 flex flex-col gap-1 lg:flex-row lg:gap-2">
                <CopyButton value={data.phone} />
                <CopyButton value={data.email} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product access */}
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Product access</CardTitle>
            <CardDescription>
              Manage product access of this team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductAccessForm data={data.products} teamId={data.id} />
          </CardContent>
        </Card>

        {/* Tax rules */}
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Tax rules</CardTitle>
            <CardDescription>Manage tax rules of this team</CardDescription>
          </CardHeader>
          <CardContent>
            <TaxRulesForm data={data.taxRules} teamId={data.id} />
          </CardContent>
        </Card>

        {/* members */}
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Members</CardTitle>
            <CardDescription>Manage members of this team</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Members members={data.members} />
          </CardContent>
        </Card>
      </div>
      <Card className="col-span-2 rounded-2xl bg-card">
        <CardHeader>
          <CardTitle className="font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-base">
          <Timeline defaultValue={1} className="w-full">
            {/* @ts-expect-error */}
            {data?.recentOrders?.map((order) => (
              <TimelineItem key={order.id} step={1}>
                <TimelineHeader className="flex items-start gap-2">
                  <div className="flex-1">
                    <TimelineDate>
                      {format(order.createdAt, "MMM dd")}
                    </TimelineDate>
                    <TimelineTitle>#{order.id}</TimelineTitle>
                  </div>
                  <TimelineBadge status={order.status} />
                </TimelineHeader>
                <TimelineIndicator />
                <TimelineSeparator />
                <TimelineContent className="space-y-0.5 rounded-xl bg-secondary p-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatUSD(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatUSD(order.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{order?.charges?.type}</span>
                    <span>{formatUSD(order?.charges?.amount)}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-base font-semibold text-foreground">
                    <span>Total</span>
                    <span>{formatUSD(order.total)}</span>
                  </div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </CardContent>
      </Card>
    </div>
  );
};

const TimelineBadge = ({ status }: { status: string }) => {
  const map = STATUS_MAP[status as keyof typeof STATUS_MAP];
  return (
    <Badge
      variant="outline"
      style={{ "--color": map.color } as React.CSSProperties}
      className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
    >
      <map.icon className="text-(--color)" />
      {map.label}
    </Badge>
  );
};

const TaxRulesForm = ({
  data,
  teamId,
}: {
  data: TaxRule[];
  teamId: string;
}) => {
  const form = useForm({
    defaultValues: {
      taxRules: data || ([] as any),
    },
    onSubmit: async ({ value }) => {
      toast.info("Form values", {
        description: JSON.stringify(value, null, 2),
      });
      // const toastId = toast.loading("Please wait...");
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="taxRules"
        mode="array"
        children={(field) => {
          const taxRules = field.state.value;
          return (
            <div className="space-y-2 rounded-lg border-l py-2 pl-2">
              {taxRules.length > 0 ? (
                <div className="space-y-1">
                  {taxRules?.map((rule, i) => (
                    <div
                      key={rule.id}
                      className="flex items-center rounded-lg border bg-secondary/20 p-2"
                    >
                      <div className="flex-1 space-x-4">
                        <span>{rule.name}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-medium">{rule.rate}%</span>
                      </div>
                      <Button
                        size="icon-xs"
                        type="button"
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          field.removeValue(i);
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : null}
              <TaxRulesSelector
                selected={field.state.value}
                setSelectedChange={(value) => {
                  const index = field.state.value.findIndex(
                    (s) => s.id === value.id,
                  );
                  if (index >= 0) {
                    field.removeValue(index);
                  } else {
                    field.pushValue({ ...value, id: Number(value.id) });
                  }
                }}
              >
                <Button variant="outline" size="sm">
                  <Plus /> Choose Tax Rules
                </Button>
              </TaxRulesSelector>
            </div>
          );
        }}
      />
      <div className="mt-2 flex justify-end">
        <form.Subscribe
          selector={({ isSubmitting }) => ({ isSubmitting })}
          children={({ isSubmitting }) => {
            return (
              <Button className="w-28" size="lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader className="animate-spin" /> : "Save"}
              </Button>
            );
          }}
        />
      </div>
    </form>
  );
};

const ProductAccessForm = ({
  data,
  teamId,
}: {
  data: ProductSelectType[];
  teamId: string;
}) => {
  const form = useForm({
    defaultValues: {
      products: [] as ProductSelectType[],
    },
    onSubmit: ({ value }) => {
      toast.info("Form values", {
        description: JSON.stringify(value, null, 2),
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="products"
        mode="array"
        children={(field) => {
          const products = field.state.value;
          return (
            <div className="space-y-2 rounded-lg border-l py-2 pl-2">
              {products.length > 0 ? (
                <div className="space-y-1">
                  {products?.map((rule, i) => (
                    <div
                      key={rule.id}
                      className="flex items-center rounded-lg border bg-secondary/20 p-2"
                    >
                      <div className="flex-1 space-x-4">
                        <span>{rule.title}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-medium">{rule.basePrice}</span>
                      </div>
                      <Button
                        size="icon-xs"
                        type="button"
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          field.removeValue(i);
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : null}
              <ProductSelector
                selected={field.state.value}
                setSelectedChange={(value) => {
                  const index = field.state.value.findIndex(
                    (s) => s.id === value.id,
                  );
                  if (index >= 0) {
                    field.removeValue(index);
                  } else {
                    field.pushValue({ ...value, id: value.id });
                  }
                }}
              >
                <Button variant="outline" size="sm">
                  <Plus /> Choose products
                </Button>
              </ProductSelector>
            </div>
          );
        }}
      />
    </form>
  );
};

const Members = ({ members }: { members: any[] }) => {
  return members?.map((member) => (
    <div className="flex items-center gap-4 px-6">
      <div className="flex flex-1 items-start gap-3 md:items-center">
        <Avatar className="size-9 rounded-lg ring-2 ring-green-600/20 ring-offset-1 **:rounded-lg after:hidden">
          <AvatarImage src="" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h4 className="mb-3 text-sm font-medium md:mb-0">John Doe</h4>
          <p className="text-sm text-muted-foreground md:hidden">0181728172</p>
          <p className="text-sm text-muted-foreground md:hidden">
            john.doe@gmail.com
          </p>
        </div>
      </div>
      <p className="hidden text-sm text-muted-foreground md:inline-block">
        0181728172
      </p>
      <p className="hidden text-sm text-muted-foreground md:inline-block">
        john.doe@gmail.com
      </p>
    </div>
  ));
};
