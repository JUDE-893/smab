import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MetricBox } from '@/components/custom/MetricBox'


type Metric = {
  title: string;
  description: string;
  trendValue: number;
  trendDirection: TrendDirection;
  metricMessage: string;
};

type SectionCardsProps = {
  metrics: Metric[];
};

export function SectionCards({metrics}: SectionCardsProps) {
  
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {
        metrics && metrics.map( (mtr, ind) => {
          return <MetricBox key={ind} data={mtr} />
        })
      }
    </div>
  )
}





// ------------------------------
// <Card className="@container/card">
//   <CardHeader>
//     <CardDescription>Total Revenue</CardDescription>
//     <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//       $1,250.00
//     </CardTitle>
//     <CardAction>
//       <Badge variant="outline">
//         <IconTrendingUp />
//         +12.5%
//       </Badge>
//     </CardAction>
//   </CardHeader>
//   <CardFooter className="flex-col items-start gap-1.5 text-sm">
//     <div className="line-clamp-1 flex gap-2 font-medium">
//       Trending up this month <IconTrendingUp className="size-4" />
//     </div>
//     <div className="text-muted-foreground">
//       Visitors for the last 6 months
//     </div>
//   </CardFooter>
// </Card>
