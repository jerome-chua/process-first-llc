import { useTopImpactData } from "@/hooks/useTopImpactData";
import { TopImpactChart } from "@/components/TopImpactChart";
import { ScenariosBarChart } from "@/components/ScenariosBarChart";
import { useScenariosData } from "@/hooks/useScenariosData";
import ScenariosTable from "@/components/ScenariosTable";
import { TopScenariosTemperaturesChart } from "@/components/TopScenariosTemperaturesChart";
import { useState } from "react";

export const DashboardPage = () => {
  const { data: impactData, isLoading: isImpactDataLoading } = useTopImpactData();
  const { data: scenariosData, isLoading: isScenariosDataLoading } = useScenariosData();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleDownloadReport = async () => {
    try {
      setIsGeneratingReport(true);
      
      const generateResponse = await fetch('http://localhost:8000/api/generate-report');
      
      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.detail || 'Failed to generate report');
      }
      
      const downloadResponse = await fetch('http://localhost:8000/api/download-report');
      
      if (!downloadResponse.ok) {
        throw new Error('Failed to download report');
      }
      
      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'process_report.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (isImpactDataLoading || isScenariosDataLoading) {
    return <h1>Loading data</h1>;
  }

  if (!impactData || !scenariosData) {
    return <h1>No data available</h1>;
  }

  return (
    <div className="mt-8 p-4 space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Process Analysis Dashboard</h1>
        <button
          onClick={handleDownloadReport}
          disabled={isGeneratingReport}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
        >
          {isGeneratingReport ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Download Report'
          )}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TopImpactChart data={impactData} />
        <TopScenariosTemperaturesChart />
      </div>
      <ScenariosBarChart data={scenariosData} />
      <ScenariosTable data={scenariosData} />
    </div>
  );
};