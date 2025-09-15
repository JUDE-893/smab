"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { getCustomersMetrics } from '@/services/customersServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useTimeRange } from '@/hooks/useTimeRange'

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";
import {
    ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import {
    IconTrendingUp,
} from "@tabler/icons-react";

import { DataTable } from '@/components/shadcnkit/data-table'
import { tableFilterConfig, exportDataConfig, skeletonRow, columns } from "@/components/config/customersCompos/dataTableConfig"


export function CustomersDataTable() {

  const timeRange = useTimeRange();

  const { data: d, isLoading, error } = useCustomQuery(
    ['customers-metrics', timeRange],
    async () => await getCustomersMetrics(timeRange)
  );

  let initialData = !(isLoading) ? d : Array.from({ length: 10 }, (_, i) => i).map((r) => skeletonRow )

    return (
        <DataTable
            initialData={initialData ?? []}
            columns={columns}
            tableFilterConfig={tableFilterConfig}
            exportDataConfig={exportDataConfig}
        />
    )
}
