import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

interface TopImpactPieChartProps {
  data: any;
}

const mapTopImpactToChartFormat = (topImpactData: any) => {
  if (!topImpactData || !topImpactData.top_impact) return [];

  return Object.entries(topImpactData.top_impact).map(([key, value]) => {
    return {
      name: key,
      temperature: Number(value),
      fill: colorMap[key] || "#6b7280",
    };
  });
};

export const TopImpactPieChart = ({ data }: TopImpactPieChartProps) => {
  return (
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
  );
}; 