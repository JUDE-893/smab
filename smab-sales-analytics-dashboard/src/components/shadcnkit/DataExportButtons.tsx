import { useTimeRange } from '@/hooks/useTimeRange'
import { Button } from "@/components/ui/button"
import {
    Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";


export function DataExportButtons({ data, exportDataConfig }) {

  const timeRange = useTimeRange();

  if (exportDataConfig?.config?.length > 1) return (<ExportDataSelect data={data} exportDataConfig={exportDataConfig} timeRange={timeRange} />)
  return (
    <>
      {exportDataConfig?.config && exportDataConfig?.config?.map((cnf, i) => {
        let Icon = cnf.icon;

        return (<Button onClick={() => cnf?.action(data, timeRange)} variant="outline" size="sm">
          {Icon && <Icon />}
          <span className="hidden lg:inline">{cnf?.label}</span>
        </Button>)
      })
      }
    </>
  );
}

function ExportDataSelect({data, exportDataConfig, timeRange}) {

  const SelectIcon = exportDataConfig?.icon;

  return (
    <Select onValueChange={(value) => {
        exportDataConfig.config?.[+(value)]?.action(data, timeRange)
      }}>
      <SelectTrigger
        className="flex w-40  "
        size="sm"
        aria-label="Select a value"
      >
        {SelectIcon && <SelectIcon />}
        <span className="ml-[-25px]">{exportDataConfig?.label}</span>
      </SelectTrigger>

      <SelectContent className="rounded-xl">
        {exportDataConfig?.config &&
          exportDataConfig?.config?.map((cnf, i) => {
            const Icon = cnf.icon;
            return (
              <SelectItem
                key={i}
                value={i}
                className="rounded-lg"
              >
                {Icon && <Icon />}
                <span className="">{cnf?.label}</span>
              </SelectItem>
            );
          })}
      </SelectContent>
    </Select>
  );

}
