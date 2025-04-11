import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { useTopScenariosTemperatures } from "@/hooks/useTopScenariosTemperatures"

const chartConfig = {
  temperature: {
    label: "Temperature Impact",
  },
  "Air Temperature": {
    label: "Air",
    color: "#4f46e5",
  },
  "Fuel Temperature": {
    label: "Fuel",
    color: "#f59e0b", 
  },
  "HEX-100 Temperature": {
    label: "HEX-100",
    color: "#10b981",
  }
} satisfies ChartConfig;

export function TopScenariosTemperaturesChart() {
  const { data, isLoading } = useTopScenariosTemperatures();
  
  const topScenario = data?.top_scenarios?.[0];
  
  const chartData = React.useMemo(() => {
    if (!topScenario) return [];

    const airTemp = topScenario.temperatures["Air.temperature"]?.value || 0;
    const fuelTemp = topScenario.temperatures["Fuel.temperature"]?.value || 0;
    const hexTemp = topScenario.temperatures["HEX-100.cold_fluid_temperature"]?.value || 0;
    
    const total = airTemp + fuelTemp + hexTemp;
    
    return [
      {
        name: "Air Temperature",
        value: airTemp,
        percentage: ((airTemp / total) * 100).toFixed(1),
        fill: "#4f46e5"
      },
      {
        name: "Fuel Temperature",
        value: fuelTemp,
        percentage: ((fuelTemp / total) * 100).toFixed(1),
        fill: "#f59e0b"
      },
      {
        name: "HEX-100 Temperature",
        value: hexTemp,
        percentage: ((hexTemp / total) * 100).toFixed(1),
        fill: "#10b981"
      }
    ];
  }, [topScenario]);

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Best Performing Scenario</CardTitle>
          <CardDescription>Temperature distribution in the optimal scenario</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            Loading data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!topScenario) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Best Performing Scenario</CardTitle>
          <CardDescription>Temperature distribution in the optimal scenario</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Best Performing Scenario ({topScenario.scenario})</CardTitle>
        <CardDescription>Temperature distribution in the optimal scenario</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={({ payload }) => {
                if (payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg bg-white p-2 shadow-md">
                      <div className="font-medium">{data.name}</div>
                      <div>{data.value.toFixed(1)}K ({data.percentage}%)</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {topScenario.kpi_value.toFixed(1)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          K
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <b>Insight:</b> Best performing scenario with KPI value: {topScenario.kpi_value.toFixed(2)}K
        </div>
        <div className="leading-none text-muted-foreground">
        </div>
      </CardFooter>
    </Card>
  )
} 