import { useTopImpactData } from "@/hooks/useTopImpactData";
import { TopImpactPieChart } from "@/components/TopImpactPieChart";
import { ScenariosBarChart } from "@/components/ScenariosBarChart";
import { useScenariosData } from "@/hooks/useScenariosData";

export const DashboardPage = () => {
  const { data: impactData, isLoading: isImpactDataLoading } = useTopImpactData();
  const { data: scenariosData, isLoading: isScenariosDataLoading } = useScenariosData();

  if (isImpactDataLoading || isScenariosDataLoading) {
    return <h1>Loading data</h1>;
  }

  console.log("see data: ", scenariosData);

  return (
    <>
      <TopImpactPieChart data={impactData} />
      <ScenariosBarChart  data={scenariosData} />
    </>
  );
};
