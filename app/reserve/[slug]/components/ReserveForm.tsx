"use client";

import { useState, useEffect } from "react";
import useReservation from "../../../../hooks/useReservation";
import { CircularProgress } from "@mui/material";

function ReserveForm({
  slug,
  date,
  partySize,
}: {
  slug: string;
  date: string;
  partySize: string;
}) {
  const { loading, error, createReservation } = useReservation();

  const [inputs, setInputs] = useState({
    bookerEmail: "",
    bookerPhone: "",
    bookerFirstName: "",
    bookerLastName: "",
    bookerOccasion: "",
    bookerRequest: "",
  });

  const [disabled, setDisabled] = useState(true);
  const [didBook, setDidBook] = useState(false);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (loading) {
      setDisabled(true);
      return;
    }

    if (
      inputs.bookerEmail &&
      inputs.bookerPhone &&
      inputs.bookerFirstName &&
      inputs.bookerLastName
    ) {
      setDisabled(false);
      return;
    }

    setDisabled(true);
  }, [inputs, loading]);

  const handleOnClick = async () => {
    const [day, time] = date.split("T");

    await createReservation({
      slug,
      day,
      time,
      partySize,
      ...inputs,
      setDidBook,
    });
  };

  return (
    <div>
      {didBook ? (
        <div>
          <h1>You are all booked up!</h1>
          <p>Enjoy your meal.</p>
        </div>
      ) : (
        <div className="mt-10 flex flex-wrap justify-between w-[660px]">
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="First name"
            name="bookerFirstName"
            value={inputs.bookerFirstName}
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Last name"
            name="bookerLastName"
            value={inputs.bookerLastName}
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Phone number"
            name="bookerPhone"
            value={inputs.bookerPhone}
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Email"
            name="bookerEmail"
            value={inputs.bookerEmail}
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Occassion (optional)"
            name="bookerOccasion"
            value={inputs.bookerOccasion}
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Requests (optional)"
            name="bookerRequest"
            value={inputs.bookerRequest}
            onChange={handleChangeInput}
          />
          <button
            disabled={disabled}
            onClick={handleOnClick}
            className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
          >
            {loading ? (
              <CircularProgress color="inherit" />
            ) : (
              "Complete Reservation"
            )}
          </button>
          <p className="mt-4 text-sm">
            By clicking “Complete reservation” you agree to the OpenTable Terms
            of Use and Privacy Policy. Message & data rates may apply. You can
            opt out of receiving text messages at any time in your account
            settings or by replying STOP.
          </p>
        </div>
      )}
    </div>
  );
}

export default ReserveForm;
