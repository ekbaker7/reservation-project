"use client";
import { useState } from "react";
import { partySize, times, convertToDisplayTime, Time } from "../../../../data";
import ReactDatePicker from "react-datepicker";
import useAvailabilities from "../../../../hooks/useAvailabilities";
import { CircularProgress } from "@mui/material";
import Link from "next/link";

function ReservationCard({
  openTime,
  closeTime,
  slug,
}: {
  openTime: string;
  closeTime: string;
  slug: string;
}) {
  const { data, loading, error, fetchAvailabilities } = useAvailabilities();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState(openTime);
  const [selectedPartySize, setSelectedPartySize] = useState(2);
  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split("T")[0]);
      return setSelectedDate(date);
    }
    return setSelectedDate(null);
  };

  const filterTimeByRestaurantOpenWindow = (): typeof times => {
    const timesWithinWindow: typeof times = [];

    let isWithinWindow = false;
    times.forEach((time) => {
      if (time.time === openTime) {
        isWithinWindow = true;
      }
      if (isWithinWindow) {
        timesWithinWindow.push(time);
      }
      if (time.time === closeTime) {
        isWithinWindow = false;
      }
    });

    return timesWithinWindow;
  };

  const handleClick = async () => {
    await fetchAvailabilities({
      slug,
      day,
      time,
      partySize: selectedPartySize,
    });
  };

  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party Size</label>
        <select
          className="py-3 border-b font-light"
          name=""
          id=""
          value={selectedPartySize}
          onChange={(e) => setSelectedPartySize(parseInt(e.target.value))}
        >
          {partySize.map((ps) => (
            <option key={`party-size-${ps.value}`} value={ps.value}>
              {ps.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <ReactDatePicker
            selected={selectedDate}
            onChange={handleChangeDate}
            className="py-3 border-b font-light text-reg w-28"
            dateFormat={"MMMM d"}
            wrapperClassName="w-[48%]"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            name=""
            id=""
            className="py-3 border-b font-light"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {filterTimeByRestaurantOpenWindow().map((time) => (
              <option key={`time-${time.time}`} value={time.time}>
                {time.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? <CircularProgress color="inherit" /> : "Find a Time"}
        </button>
      </div>
      {data && data.length ? (
        <div className="mt-4">
          <p className="text-reg">Select a Time</p>
          <div className="flex flex-wrap mt-2">
            {data.map((availability) => {
              return availability.available ? (
                <Link
                  href={`/reserve/${slug}?date=${day}T${availability.time}&partySize=${selectedPartySize}`}
                  className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
                >
                  <p className="text-sm font-bold">{convertToDisplayTime(availability.time as Time)}</p>
                </Link>
              ) : (
                <p className="bg-gray-300 p2 w-24 mb-3 rounded mr-3"></p>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ReservationCard;
