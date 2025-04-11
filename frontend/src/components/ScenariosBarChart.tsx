"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Cell } from "recharts"

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
} from "@/components/ui/chart"

interface ChartDataItem {
  scenario: string;
  air: number;
  fuel: number;
  coldFluid: number;
}

interface ElementData {
  Condition?: {
    [key: string]: string;
  };
  Setpoint?: {
    [key: string]: string;
  };
}

interface Props {
  data?: {
    scenario: string;
    kpi_value: number;
    elements: Record<string, ElementData>;  
  };
}

export function ScenariosBarChart({ data }: Props) {
  const chartData: ChartDataItem[] = data?.elements 
    ? Object.entries(data.elements).map(([index, element]) => {
        const airTemp = element.Setpoint?.["Air.temperature"] 
          ? parseFloat(element.Setpoint["Air.temperature"].replace("K", "")) 
          : 0;
        
        const fuelTemp = element.Setpoint?.["Fuel.temperature"] 
          ? parseFloat(element.Setpoint["Fuel.temperature"].replace("K", "")) 
          : 0;
        
        const coldFluidTemp = element.Setpoint?.["HEX-100.cold_fluid_temperature"] 
          ? parseFloat(element.Setpoint["HEX-100.cold_fluid_temperature"].replace("K", "")) 
          : 0;

        const total = airTemp + fuelTemp + coldFluidTemp;
        let airPercentage = total > 0 ? (airTemp / total) * 100 : 0;
        let fuelPercentage = total > 0 ? (fuelTemp / total) * 100 : 0;
        let coldFluidPercentage = total > 0 ? (coldFluidTemp / total) * 100 : 0;

        const sum = airPercentage + fuelPercentage + coldFluidPercentage;
        if (sum > 100) {
          const excess = sum - 100;
      
          const nonZeroCount = [airPercentage, fuelPercentage, coldFluidPercentage].filter(v => v > 0).length;
          const adjustment = excess / nonZeroCount;
          if (airPercentage > 0) airPercentage -= adjustment;
          if (fuelPercentage > 0) fuelPercentage -= adjustment;
          if (coldFluidPercentage > 0) coldFluidPercentage -= adjustment;
        }
        
        return {
          scenario: `S${index}`,
          air: Number(airPercentage.toFixed(1)),
          fuel: Number(fuelPercentage.toFixed(1)),
          coldFluid: Number(coldFluidPercentage.toFixed(1))
        };
      })
    : [];

  const chartConfig = {
    air: {
      label: "Air Temperature Contribution",
      color: "#4f46e5",
    },
    fuel: {
      label: "Fuel Temperature Contribution",
      color: "#f59e0b",
    },
    coldFluid: {
      label: "HEX-100 Temperature Contribution",
      color: "#10b981",
    },
  } satisfies ChartConfig

  const isHighlightedScenario = (scenario: string) => {
    return scenario === "S0" || scenario === "S47";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Temperature Distribution by Percentage</CardTitle>
        <CardDescription>
          Showing relative temperature contributions across {chartData.length} scenarios
          <div className="mt-2 text-sm">
            <span className="text-emerald-500 font-semibold">S0: Best performing scenario (KPI: 500.895K)</span>
            <br />
            <span className="text-red-500 font-semibold">S47: Worst performing scenario (KPI: 328.601K)</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="scenario"
                interval={2}
                angle={-45}
                textAnchor="end"
                height={60}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={16}
                      textAnchor="end"
                      fill={isHighlightedScenario(payload.value) ? (payload.value === "S0" ? "#059669" : "#dc2626") : "#666"}
                      transform="rotate(-45)"
                    >
                      {payload.value}
                    </text>
                  </g>
                )}
              />
              <YAxis 
                label={{ value: 'Contribution (%)', angle: -90, position: 'insideLeft' }}
                domain={[0, 100]}
                tickFormatter={(value) => Math.round(value).toString()}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  const labels = {
                    air: "Air Temperature",
                    fuel: "Fuel Temperature",
                    coldFluid: "HEX-100 Temperature"
                  };
                  return [`${Number(value).toFixed(1)}%`, labels[name as keyof typeof labels]];
                }}
              />
              <Legend />
              <ReferenceLine x="S0" stroke="#059669" strokeWidth={2} />
              <ReferenceLine x="S47" stroke="#dc2626" strokeWidth={2} />
              <Bar 
                dataKey="coldFluid" 
                name="HEX-100 Temperature" 
                stackId="a" 
                fill={chartConfig.coldFluid.color}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fillOpacity={isHighlightedScenario(entry.scenario) ? 1 : 0.8}
                  />
                ))}
              </Bar>
              <Bar 
                dataKey="fuel" 
                name="Fuel Temperature" 
                stackId="a" 
                fill={chartConfig.fuel.color}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fillOpacity={isHighlightedScenario(entry.scenario) ? 1 : 0.8}
                  />
                ))}
              </Bar>
              <Bar 
                dataKey="air" 
                name="Air Temperature" 
                stackId="a" 
                fill={chartConfig.air.color}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fillOpacity={isHighlightedScenario(entry.scenario) ? 1 : 0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          <b>Insight:</b> Each bar shows the relative contribution of temperatures, totaling 100% <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
