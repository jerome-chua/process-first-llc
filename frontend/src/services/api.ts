import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export interface TopVariable {
  equipment: string;
  type: string;
  name: string;
  value: number;
  unit: string;
}

export interface SetpointImpact {
  equipment: string;
  setpoint: string;
  weightage: number;
  unit: string;
}

export interface Scenario {
  scenario: string;
  kpi_value: number;
}

export const mockApi = {
  getProcessData: async () => {
    try {
      const response = await apiClient.get("/process-data");
      return response.data;
    } catch (error) {
      console.error("Error fetching process data:", error);
      throw error;
    }
  },

  getTopImpact: async (): Promise<any> => {
    try {
      const response = await apiClient.get("/top-impact");
      return response.data;
    } catch (error) {
      console.error("Error fetching top impacts:", error);
      throw error;
    }
  },

  getScenarios: async (): Promise<Scenario[]> => {
    try {
      const response = await apiClient.get("/scenarios");
      return response.data;
    } catch (error) {
      console.error("Error fetching scenarios:", error);
      throw error;
    }
  },

  getSetpointImpacts: async (): Promise<SetpointImpact[]> => {
    try {
      const response = await apiClient.get("/setpoint-impacts");
      return response.data;
    } catch (error) {
      console.error("Error fetching setpoint impacts:", error);
      throw error;
    }
  },
};
