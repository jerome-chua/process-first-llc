import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp } from "lucide-react";
import { TopPerformingChart } from "./TopPerformingChart";

const chartConfig = {
  temperature: {
    label: "Temperature Impact",
  },
  "Air Temperature": {
    label: "Air",
    color: "hsl(var(--chart-1))",
  },
  "Fuel Temperature": {
    label: "Fuel",
    color: "hsl(var(--chart-2))",
  },
  "HEX-100 - Cold Fluid Temperature": {
    label: "HEX-100",
    color: "hsl(var(--chart-3))",
  },
  Others: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const colorMap: { [key: string]: string } = {
  "Air Temperature": "#4f46e5",
  "Fuel Temperature": "#f59e0b",
  "HEX-100 - Cold Fluid Temperature": "#10b981",
  "Others": "#6b7280",
};

interface Props {
  data: any;
}

export const mapTopImpactToChartFormat = (topImpactData: any) => {
  if (!topImpactData || !topImpactData.top_impact) return [];

  return Object.entries(topImpactData.top_impact).map(([key, value]) => {
    return {
      name: key,
      temperature: Number(value),
      fill: colorMap[key] || "#6b7280",
    };
  });
};

export const TopImpactChart = ({ data }: Props) => {
  return (
      <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top Impact</CardTitle>
        <CardDescription>{data.top_summary_text}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={mapTopImpactToChartFormat(data)}
            dataKey="temperature"
            label
            nameKey="name"
          />
        </PieChart>
      </ChartContainer>
      </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              <b>Insight:</b> Prioritise controlling Air temperature for maximum
              impact <TrendingUp className="h-4 w-4" />
            </div>
          </CardFooter>
        </Card>      
  );
}; 