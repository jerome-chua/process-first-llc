import { useTopImpactData } from "@/hooks/useProcessedData";
import { TopImpactPieChart } from "@/components/TopImpactPieChart";
import { ScenariosBarChart } from "@/components/ScenariosBarChart";

export const DashboardPage = () => {
  const { data, isLoading } = useTopImpactData();

  if (isLoading) {
    return <h1>Loading data</h1>;
  }

  return (
    <>
      <TopImpactPieChart data={data} />
      <ScenariosBarChart />
    </>
  );
};
