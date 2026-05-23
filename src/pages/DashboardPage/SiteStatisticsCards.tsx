import type { ComponentType } from "react";
import {
  CheckCircle2Icon,
  MessageCircleIcon,
  PackageIcon,
  RotateCcwIcon,
  StoreIcon,
  UsersRoundIcon,
  UserRoundCheckIcon,
  XCircleIcon,
  WifiIcon,
  RefreshCw,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteStatistics } from "@/hooks/api/user/useSiteStatistics";
import { Button } from "@/components/ui/button";

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="border py-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-1">
        <CardTitle className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
          {label}
        </CardTitle>
        <Icon className="text-muted-foreground size-3.5 shrink-0" />
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <p className="text-lg font-semibold tabular-nums">{value}</p>
        {hint ? (
          <p className="text-muted-foreground mt-0.5 text-[11px] leading-tight">
            {hint}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="border py-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="size-3.5 rounded" />
      </CardHeader>
      <CardContent className="space-y-2 px-3 pb-3">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  );
}

const formatCount = (n: number | undefined) => (n ?? 0).toLocaleString();

export function SiteStatisticsCards() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useSiteStatistics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="border-destructive/30 bg-destructive/5 text-destructive flex flex-col items-center justify-center gap-2 rounded-lg border px-4 py-8 text-center text-sm">
        <p>
          {error instanceof Error
            ? error.message
            : "Could not load site statistics."}
        </p>
        <button
          type="button"
          className="text-primary text-xs font-medium underline-offset-4 hover:underline"
          onClick={() => void refetch()}
        >
          Try again
        </button>
      </div>
    );
  }

  const cards = [
    {
      label: "Total users",
      value: formatCount(data.totalUsers),
      hint: "Registered",
      icon: UsersRoundIcon,
    },
    {
      label: "Active now",
      value: formatCount(data.activeUsers),
      hint: "Last 5 min API",
      icon: WifiIcon,
    },
    {
      label: "Importers",
      value: formatCount(data.totalImporters),
      hint: "Role",
      icon: UserRoundCheckIcon,
    },
    {
      label: "Exporters",
      value: formatCount(data.totalExporters),
      hint: "Role",
      icon: StoreIcon,
    },
    {
      label: "Chat peers",
      value: formatCount(data.totalPeers),
      hint: "Conversations",
      icon: MessageCircleIcon,
    },
    {
      label: "Total orders",
      value: formatCount(data.totalOrders),
      hint: "All time",
      icon: PackageIcon,
    },
    {
      label: "Delivered",
      value: formatCount(data.deliveredOrders),
      hint: "Completed",
      icon: CheckCircle2Icon,
    },
    {
      label: "Cancelled",
      value: formatCount(data.cancelledOrders),
      hint: "Orders",
      icon: XCircleIcon,
    },
    {
      label: "Returned",
      value: formatCount(data.returnedOrders),
      hint: "Orders",
      icon: RotateCcwIcon,
    },
  ] as const;

  return (
    <div className="space-y-2">
      <header className="space-y-1 flex justify-between ">
       <div className="">
       <h1 className="text-xl font-semibold tracking-tight">
          Operations overview
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Live platform metrics refresh when you reload the page. Tables below
          still use mock data.
        </p>
       </div>
      <Button onClick={()=>refetch()}><RefreshCw /></Button>
      </header>

      {isFetching ? (
        <p className="text-muted-foreground text-[11px]">Refreshing…</p>
      ) : null}
      <div className="grid grid-cols-3 gap-3 md:grid-cols-5 xl:grid-cols-9">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}
