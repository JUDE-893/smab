import { ChartAreaInteractive } from "@/components/charts/chart-area-interactive"

const chartData = [
    { date: "2024-04-01", leads: 222 },
    { date: "2024-04-02", leads: 97 },
    { date: "2024-04-03", leads: 167 },
    { date: "2024-04-04", leads: 242 },
    { date: "2024-04-05", leads: 373 },
    { date: "2024-04-06", leads: 301 },
    { date: "2024-04-07", leads: 245 },
    { date: "2024-04-08", leads: 409 },
    { date: "2024-04-09", leads: 59 },
    { date: "2024-04-10", leads: 261 },
    { date: "2024-04-11", leads: 327 },
    { date: "2024-04-12", leads: 292 },
    { date: "2024-04-13", leads: 342 },
    { date: "2024-04-14", leads: 137 },
    { date: "2024-04-15", leads: 120 },
    { date: "2024-04-16", leads: 138 },
    { date: "2024-04-17", leads: 446 },
    { date: "2024-04-18", leads: 364 },
    { date: "2024-04-19", leads: 243 },
    { date: "2024-04-20", leads: 89 },
    { date: "2024-04-21", leads: 137 },
    { date: "2024-04-22", leads: 224 },
    { date: "2024-04-23", leads: 138 },
    { date: "2024-04-24", leads: 387 },
    { date: "2024-04-25", leads: 215 },
    { date: "2024-04-26", leads: 75 },
    { date: "2024-04-27", leads: 383 },
    { date: "2024-04-28", leads: 122 },
    { date: "2024-04-29", leads: 315 },
    { date: "2024-04-30", leads: 454 },
    { date: "2024-05-01", leads: 165 },
    { date: "2024-05-02", leads: 293 },
    { date: "2024-05-03", leads: 247 },
    { date: "2024-05-04", leads: 385 },
    { date: "2024-05-05", leads: 481 },
    { date: "2024-05-06", leads: 498 },
    { date: "2024-05-07", leads: 388 },
    { date: "2024-05-08", leads: 149 },
    { date: "2024-05-09", leads: 227 },
    { date: "2024-05-10", leads: 293 },
    { date: "2024-05-11", leads: 335 },
    { date: "2024-05-12", leads: 197 },
    { date: "2024-05-13", leads: 197 },
    { date: "2024-05-14", leads: 448 },
    { date: "2024-05-15", leads: 473 },
    { date: "2024-05-16", leads: 338 },
    { date: "2024-05-17", leads: 499 },
    { date: "2024-05-18", leads: 315 },
    { date: "2024-05-19", leads: 235 },
    { date: "2024-05-20", leads: 177 },
    { date: "2024-05-21", leads: 82 },
    { date: "2024-05-22", leads: 81 },
    { date: "2024-05-23", leads: 252 },
    { date: "2024-05-24", leads: 294 },
    { date: "2024-05-25", leads: 201 },
    { date: "2024-05-26", leads: 213 },
    { date: "2024-05-27", leads: 420 },
    { date: "2024-05-28", leads: 233 },
    { date: "2024-05-29", leads: 78 },
    { date: "2024-05-30", leads: 340 },
    { date: "2024-05-31", leads: 178 },
    { date: "2024-06-01", leads: 178 },
    { date: "2024-06-02", leads: 470 },
    { date: "2024-06-03", leads: 103 },
    { date: "2024-06-04", leads: 439 },
    { date: "2024-06-05", leads: 88 },
    { date: "2024-06-06", leads: 294 },
    { date: "2024-06-07", leads: 323 },
    { date: "2024-06-08", leads: 385 },
    { date: "2024-06-09", leads: 438 },
    { date: "2024-06-10", leads: 155 },
    { date: "2024-06-11", leads: 92 },
    { date: "2024-06-12", leads: 492 },
    { date: "2024-06-13", leads: 81 },
    { date: "2024-06-14", leads: 426 },
    { date: "2024-06-15", leads: 307 },
    { date: "2024-06-16", leads: 371 },
    { date: "2024-06-17", leads: 475 },
    { date: "2024-06-18", leads: 107 },
    { date: "2024-06-19", leads: 341 },
    { date: "2024-06-20", leads: 408 },
    { date: "2024-06-21", leads: 169 },
    { date: "2024-06-22", leads: 317 },
    { date: "2024-06-23", leads: 480 },
    { date: "2024-06-24", leads: 132 },
    { date: "2024-06-25", leads: 141 },
    { date: "2024-06-26", leads: 434 },
    { date: "2024-06-27", leads: 448 },
    { date: "2024-06-28", leads: 149 },
    { date: "2024-06-29", leads: 103 },
    { date: "2024-06-30", leads: 446 },
  ]
  
  const chartConfig = {
    visitors: {
      label: "Leads",
    },
    leads: {
      label: "Leads",
      color: "var(--primary)",
    },

  } 

  const chartMetaData = {
    title : "New Leads",
    description: 'metrics of new leads collected',
    dataKey: "date"
  }
export function NewLeadsChart() {

    return (
      <ChartAreaInteractive
        chartMetaData={chartMetaData}
        chartConfig={chartConfig}
        chartData={chartData}
       />
    )
  }