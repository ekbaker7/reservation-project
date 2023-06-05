import axios from "axios";
import { useState } from "react";
import { AvailableTimes } from "../lib/dbModels";

const useAvailabilities = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<AvailableTimes[] | null>(null);

  const fetchAvailabilities = async ({
    slug,
    day,
    time,
    partySize,
  }: {
    slug: string;
    day: string;
    time: string;
    partySize: number;
  }) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await axios.get(`/api/restaurant/${slug}/availability`, {
        params: {
          day,
          time,
          partySize
        },
      });
      setData(response.data);
    } catch (error: any) {
      setError(error.response.data.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAvailabilities,
    loading,
    data,
    error
  };
};

export default useAvailabilities;
