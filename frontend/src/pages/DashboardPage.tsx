import { useTopImpactData } from "@/hooks/useProcessedData";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TopImpactPieChart } from "@/components/TopImpactPieChart";

export const DashboardPage = () => {
  const { data, isLoading } = useTopImpactData();

  if (isLoading) {
    return <h1>Loading data</h1>;
  }

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Top Impact</CardTitle>
          <CardDescription>{data.top_summary_text}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <TopImpactPieChart data={data} />
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            <b>Insight:</b> Prioritise controlling Air temperature for maximum
            impact <TrendingUp className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </>
  );
};
