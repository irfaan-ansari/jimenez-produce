"use client";
import { use } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  CircleDashed,
  Loader,
  PackageCheck,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Timeline,
  TimelineItem,
  TimelineDate,
  TimelineTitle,
  TimelineHeader,
  TimelineContent,
  TimelineSeparator,
  TimelineIndicator,
} from "@/components/reui/timeline";
import { toast } from "sonner";
import { TaxRule } from "@/lib/types";
import { format } from "date-fns/format";
import { useTeam } from "@/hooks/use-teams";
import { Badge } from "@/components/ui/badge";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { PriceLevelSelectType, ProductSelectType } from "@/lib/db/schema";
import { CopyButton } from "@/components/copy-button";
import { STATUS_MAP } from "@/lib/constants/status-map";
import {
  formatPriceLevelAdjustment,
  formatUSD,
  getAvatarFallback,
} from "@/lib/utils";
import { ProductSelector } from "@/components/admin/product-selector";
import { TaxRulesSelector } from "@/components/admin/tax-rules-selector";
import { updateProductsToTeam, updateTaxRulesToTeam } from "@/server/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PriceLevelSelector } from "@/components/admin/price-level-selector";
import { authClient } from "@/lib/auth/client";
import { CustomerActions } from "../customer-actions";

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
            <Button size="default">Invite Member</Button>
            <CustomerActions data={data} showView />
          </div>
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

        {/* stats cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="flex-row items-start px-6 rounded-2xl">
            <div className="flex-1">
              <CardTitle className="mb-2 text-3xl font-bold">
                {data.stats?.activeCount}
              </CardTitle>
              <CardDescription className="mb-6 text-base font-semibold">
                {formatUSD(data.stats?.activeValue!)}
              </CardDescription>
              <span className="text-sm font-medium text-muted-foreground">
                Active Orders
              </span>
            </div>
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-amber-100 p-0 text-foreground">
              <CircleDashed className="size-4" />
            </span>
          </Card>
          <Card className="flex-row items-start px-6 rounded-2xl">
            <div className="flex-1">
              <CardTitle className="mb-2 text-3xl font-bold">
                {data.stats?.completedCount}
              </CardTitle>
              <CardDescription className="mb-6 text-base font-semibold">
                {formatUSD(data.stats?.completedValue!)}
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

        {/* Price level */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-semibold">Price level</CardTitle>
            <CardDescription>
              Manage price level of this account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PriceLevelForm data={data.priceLevel} teamId={data.id} />
          </CardContent>
        </Card>

        {/* Product access */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-semibold">
              Proprietary products
            </CardTitle>
            <CardDescription>
              Manage proprietary products for this account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductAccessForm data={data.products} teamId={data.id} />
          </CardContent>
        </Card>

        {/* Tax rules */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-semibold">Tax rules</CardTitle>
            <CardDescription>Manage tax rules of this account</CardDescription>
          </CardHeader>
          <CardContent>
            <TaxRulesForm data={data.taxRules} teamId={data.id} />
          </CardContent>
        </Card>

        {/* members */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-semibold">Members</CardTitle>
            <CardDescription>Manage members of this team</CardDescription>
          </CardHeader>
          <CardContent>
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
            {data?.orders?.map((order) => (
              <TimelineRow key={order.id} order={order} />
            ))}
          </Timeline>
        </CardContent>
      </Card>
    </div>
  );
};

// price level of customer account
const PriceLevelForm = ({
  data,
  teamId,
}: {
  data: PriceLevelSelectType | null;
  teamId: string;
}) => {
  const form = useForm({
    defaultValues: {
      priceLevel: data,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");
      const { error } = await authClient.organization.updateTeam({
        teamId,
        data: {
          priceLevelId: value.priceLevel?.id!,
        },
      });

      if (error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.success("Price level updated successfully", { id: toastId });
      }
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="priceLevel">
        {(field) => (
          <div className="space-y-4">
            {field.state.value?.id ? (
              <div className="flex items-center gap-2 w-full p-2 rounded-lg bg-secondary/20 border">
                <div className="flex-1 flex flex-col items-start gap-0.5">
                  <span className="font-medium">{field.state.value.name}</span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {field.state.value.appliesTo === "all"
                      ? "Applies to all items"
                      : "Per item adjustment"}
                  </span>
                </div>
                {field.state.value.appliesTo === "all" && (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-md ${
                      Number(field.state.value.adjustmentValue ?? 0) > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                  >
                    {formatPriceLevelAdjustment(
                      field.state.value.adjustmentType,
                      field.state.value.adjustmentValue || 0,
                    )}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">
                Click to select price level
              </div>
            )}
            <PriceLevelSelector
              value={field.state.value!}
              onValueChange={(value) => {
                field.handleChange({ ...value, id: Number(value.id) } as any);
              }}
            >
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-dashed"
              >
                <Plus /> Select price level
              </Button>
            </PriceLevelSelector>
          </div>
        )}
      </form.Field>
      <div className="flex justify-end">
        <form.Subscribe
          selector={({ isSubmitting, isDirty, canSubmit }) => ({
            isSubmitting,
            canSubmit,
            isDirty,
          })}
          children={({ isSubmitting, isDirty, canSubmit }) => {
            return (
              <Button
                type="submit"
                className="w-28"
                size="lg"
                disabled={isSubmitting || !isDirty || !canSubmit}
              >
                {isSubmitting ? <Loader className="animate-spin" /> : "Save"}
              </Button>
            );
          }}
        />
      </div>
    </form>
  );
};

// tax rules applied to customer account
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
      const { taxRules } = value;
      const taxRuleIds = taxRules?.map((t) => t.id);

      const toastId = toast.loading("Please wait...");
      const { success, error } = await updateTaxRulesToTeam({
        teamId,
        taxRuleIds,
      });

      if (success) {
        toast.success("Tax rules updated successfully", { id: toastId });
      } else {
        toast.error(error?.message, { id: toastId });
      }
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
            <div className="space-y-4">
              {taxRules.length > 0 ? (
                <div className="space-y-1">
                  {taxRules?.map((rule, i) => (
                    <div
                      key={rule.id}
                      className="flex items-center gap-2 py-2 rounded-lg p-2 border bg-secondary/20"
                    >
                      <span className="flex-1 font-medium">{rule.name}</span>

                      <span className="font-medium text-muted-foreground">
                        {rule.rate}%
                      </span>
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
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 border-dashed"
                >
                  <Plus /> Add tax rules
                </Button>
              </TaxRulesSelector>
            </div>
          );
        }}
      />
      <div className="mt-2 flex justify-end">
        <form.Subscribe
          selector={({ isSubmitting, isDirty, canSubmit }) => ({
            isSubmitting,
            canSubmit,
            isDirty,
          })}
          children={({ isSubmitting, isDirty, canSubmit }) => {
            return (
              <Button
                type="submit"
                className="w-28"
                size="lg"
                disabled={isSubmitting || !isDirty || !canSubmit}
              >
                {isSubmitting ? <Loader className="animate-spin" /> : "Save"}
              </Button>
            );
          }}
        />
      </div>
    </form>
  );
};

// propritory products that customer can access
const ProductAccessForm = ({
  data,
  teamId,
}: {
  data: ProductSelectType[];
  teamId: string;
}) => {
  console.log("data", data);
  const form = useForm({
    defaultValues: {
      products: data as ProductSelectType[],
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");

      const { products } = value;
      const productIds = products.map((p) => Number(p.id));

      const { success, error } = await updateProductsToTeam({
        teamId,
        productIds,
      });
      if (success) {
        toast.success("Products updated successfully", { id: toastId });
      } else {
        toast.error(error?.message, { id: toastId });
      }
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
            <div className="space-y-4">
              {products.length > 0 ? (
                <div className="space-y-1">
                  {products?.map((item, i) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 rounded-xl border bg-secondary/20"
                    >
                      <div className="flex flex-1 items-start gap-3">
                        <div className="shrink-0">
                          <Avatar className="size-9 rounded-lg ring-2 ring-green-600/40 ring-offset-1 **:rounded-lg after:hidden">
                            <AvatarImage src={item?.image as string} />
                            <AvatarFallback>
                              {getAvatarFallback((item.title as string)?.[0])}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="leading-tight font-medium whitespace-normal">
                            {item.title}
                          </h4>
                          <Badge
                            variant="secondary"
                            className="rounded-xl border border-border uppercase"
                          >
                            {item.identifier}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-28 self-center text-right text-muted-foreground font-medium">
                        {formatUSD(item.basePrice)}
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
                <Button
                  variant="outline"
                  size="sm"
                  className="border-dashed border-2"
                >
                  <Plus /> Add products
                </Button>
              </ProductSelector>
            </div>
          );
        }}
      />
      <div className="mt-2 flex justify-end">
        <form.Subscribe
          selector={({ isSubmitting, canSubmit, isDirty }) => ({
            isSubmitting,
            canSubmit,
            isDirty,
          })}
          children={({ isSubmitting, canSubmit, isDirty }) => {
            return (
              <Button
                type="submit"
                className="w-28"
                size="lg"
                disabled={isSubmitting || !isDirty || !canSubmit}
              >
                {isSubmitting ? <Loader className="animate-spin" /> : "Save"}
              </Button>
            );
          }}
        />
      </div>
    </form>
  );
};

// customer account members
const Members = ({ members }: { members: any[] }) => {
  if (members?.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground">
        No members found
      </div>
    );
  }
  return (
    <div className="space-y-1">
      {members?.map((member) => (
        <div className="flex items-center gap-4 p-2 rounded-lg bg-secondary/20 border">
          <div className="flex flex-1 items-center gap-3">
            <Avatar className="size-9 rounded-lg ring-2 ring-green-600/20 ring-offset-1 **:rounded-lg after:hidden">
              <AvatarImage src={member.image} />
              <AvatarFallback>{getAvatarFallback(member.name)}</AvatarFallback>
            </Avatar>

            <div className="space-y-0">
              <h4 className="text-sm font-medium">{member.name}</h4>
              <CopyButton value={member.phoneNumber!} />
            </div>
          </div>
          <CopyButton value={member.email} />
        </div>
      ))}
    </div>
  );
};

// order history timeline
const TimelineRow = ({ order }: { order: any }) => {
  const { status } = order;
  const map = STATUS_MAP[status as keyof typeof STATUS_MAP];
  return (
    <TimelineItem key={order.id} step={1}>
      <TimelineHeader className="flex items-start gap-2">
        <div className="flex-1">
          <TimelineDate>{format(order.createdAt, "MMM dd")}</TimelineDate>
          <TimelineTitle>#{order.id}</TimelineTitle>
        </div>
        <Badge
          variant="outline"
          style={{ "--color": map.color } as React.CSSProperties}
          className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
        >
          <map.icon className="text-(--color)" />
          {map.label}
        </Badge>
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
  );
};
