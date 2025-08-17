import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


type TrendDirection = "up" | "down";

type MetricCardData = {
  title: string;
  description: string;
  trendValue: number;
  trendDirection: TrendDirection;
  metricMessage: string;
};

type MetricBoxProps = {
  data: MetricCardData;
};

export function MetricBox({ data }: MetricBoxProps): React.ReactElement {

  let TrendIcon = data?.trendDirection === "up" ? IconTrendingUp : IconTrendingDown;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{data?.description}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {data?.title}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <TrendIcon />
            {data?.trendValue}%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium text-muted-foreground">
          {data?.metricMessage} <TrendIcon className="size-4" />
        </div>
      </CardFooter>
    </Card>)
}
