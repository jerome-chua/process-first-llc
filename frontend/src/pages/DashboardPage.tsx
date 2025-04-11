import { useTopImpactData } from "@/hooks/useTopImpactData";
import { TopImpactChart } from "@/components/TopImpactChart";
import { ScenariosBarChart } from "@/components/ScenariosBarChart";
import { useScenariosData } from "@/hooks/useScenariosData";
import ScenariosTable from "@/components/ScenariosTable";
import { TopPerformingChart } from "@/components/TopPerformingChart";
import { useTopScenariosTemperatures } from "@/hooks/useTopScenariosTemperatures";
import { TopScenariosTemperaturesChart } from "@/components/TopScenariosTemperaturesChart";

export const DashboardPage = () => {
  const { data: impactData, isLoading: isImpactDataLoading } = useTopImpactData();
  const { data: scenariosData, isLoading: isScenariosDataLoading } = useScenariosData();

  if (isImpactDataLoading || isScenariosDataLoading) {
    return <h1>Loading data</h1>;
  }

  if (!impactData || !scenariosData) {
    return <h1>No data available</h1>;
  }

  return (
    <div className="p-4 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <TopImpactChart data={impactData} />
          <TopScenariosTemperaturesChart />
        </div>
        <ScenariosBarChart data={scenariosData} />
      <ScenariosTable data={scenariosData} />
    </div>
  );
};
