import { useState, useEffect } from "react";
import { mockApi, TopScenariosTemperaturesResponse } from "../services/api";

export const useTopScenariosTemperatures = () => {
  const [data, setData] = useState<TopScenariosTemperaturesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await mockApi.getTopScenariosTemperatures();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
}; 