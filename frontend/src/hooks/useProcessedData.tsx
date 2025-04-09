// src/hooks/useProcessData.ts
import { useState, useEffect } from "react";
import { mockApi, TopImpact } from "../services/api";

export function useTopImpacts() {
  const [data, setData] = useState<TopImpact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await mockApi.getTopImpacts();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
}
