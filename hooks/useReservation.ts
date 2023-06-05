import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

const useReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = async ({
    slug,
    day,
    time,
    partySize,
    bookerEmail,
    bookerPhone,
    bookerFirstName,
    bookerLastName,
    bookerOccasion,
    bookerRequest,
    setDidBook
  }: {
    slug: string;
    day: string;
    time: string;
    partySize: string;
    bookerEmail: string;
    bookerPhone: string;
    bookerFirstName: string;
    bookerLastName: string;
    bookerOccasion: string;
    bookerRequest: string;
    setDidBook: Dispatch<SetStateAction<boolean>>
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `/api/restaurant/${slug}/reserve`,
        {
          bookerEmail,
          bookerPhone,
          bookerFirstName,
          bookerLastName,
          bookerOccasion,
          bookerRequest,
        },
        {
          params: {
            day,
            time,
            partySize,
          },
        }
      );

      setDidBook(true)
      return response.data;
    } catch (error: any) {
      setError(error.response.data.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createReservation,
    loading,
    error,
  };
};

export default useReservation;
