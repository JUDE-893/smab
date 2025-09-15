"use client"

import { HorizentalChartBar } from '@/components/charts/HorizentalBarChart';
import { getCustomersMetrics } from '@/services/customersServices'
import { useCustomQuery } from '@/hooks/useCustomQuery';
import { useTimeRange } from '@/hooks/useTimeRange';
import { formatPrice } from "@/lib/utils";

let chartConfig = {
  orders_count: {
    label: "Orders Count",
  }
}

const chartMetaData = {
  title: "Frequants Clients",
  description: 'Overview of total orders made by a customer',
  dataKey:"order_count",
  nameKey:"customer_name",
  hideLabel: false,
  hideX: true,
  hideY: false,
  YaWidth: 100
}

export function TotalCustomerOrdersChart() {

  const timeRange = useTimeRange();

  const { data, isLoading, error } = useCustomQuery(
    ['customers-metrics', timeRange],
    async () => await getCustomersMetrics(timeRange)
  );

  let dataRec =  data?.map((agt) => {
    return {...agt, fill: `var(--chart-3)`}
  });

  //  data?.forEach(element => {
  //   chartConfig[element?.barcode] = {label: `${element?.barcode} - ${element?.name}`}
  // });


    // In your TotalProductQuantity_Chart component:
    return (
      <HorizentalChartBar
        chartMetaData={{...chartMetaData, isLoading, error}}
        chartConfig={chartConfig}
        chartData={dataRec}
        itemsPerPage={12} // Optional: customize items per page
      />
    )
  }
