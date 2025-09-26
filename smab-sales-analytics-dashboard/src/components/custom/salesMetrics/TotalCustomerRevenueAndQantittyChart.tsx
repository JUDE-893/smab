"use client"

import { MonoChartBar } from '@/components/charts/MonoBarChart';
import { getCustomersMetrics } from '@/services/customersServices'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useTimeRange } from '@/hooks/useTimeRange'



  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "var(--chart-3)",
    },
    quantity: {
      label: "Quantity",
      color: "var(--chart-2)",
    }
  }

  const chartMetaData = {
    title : "Customers Statistics",
    description: 'metrics of total revenue and products quantity by client',
    dataKey: "customer_name",
    hideX: true,
    hideY: false,
    toolTipLabel: (value) => value,
    YaWidth:40

  }

export function TotalCustomerRevenueAndQantittyChart() {

  const timeRange = useTimeRange();

  const { data, isLoading, error } = useCustomQuery(
    ['customers-metrics', timeRange],
    async () => await getCustomersMetrics(timeRange)
  );

    return (
      <MonoChartBar
        chartMetaData={{...chartMetaData, isLoading: isLoading, error}}
        chartConfig={chartConfig}
        chartData={data}
        className='lg:px-[4%] lg:py-[3%]'
       />
    )
  }
