import { useTopImpactData } from "@/hooks/useTopImpactData";
import { TopImpactPieChart } from "@/components/TopImpactPieChart";
import { ScenariosBarChart } from "@/components/ScenariosBarChart";
import { useScenariosData } from "@/hooks/useScenariosData";
import ScenariosTable from "@/components/ScenariosTable";

export const DashboardPage = () => {
  const { data: impactData, isLoading: isImpactDataLoading } = useTopImpactData();
  const { data: scenariosData, isLoading: isScenariosDataLoading } = useScenariosData();

  if (isImpactDataLoading || isScenariosDataLoading) {
    return <h1>Loading data</h1>;
  }

  return (
    <div className="p-4 space-y-8">
      <TopImpactPieChart data={impactData} />
      <ScenariosBarChart data={scenariosData} />
      <ScenariosTable data={scenariosData} />
    </div>
  );
};
