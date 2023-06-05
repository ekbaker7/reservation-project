import { NextApiResponse } from "next";
import { times } from "../../data";
import {
  getBookingsForRestaurant,
  getTablesForRestaurant,
} from "../../lib/availabilityUtils";
import { RestaurantTables, SearchTimesWithTables } from "../../lib/dbModels";

export const findAvailableTables = async ({
  slug,
  day,
  time,
  partySize,
  res,
  restaurant
}: {
  slug: string;
  day: string;
  time: string;
  partySize: string;
  res: NextApiResponse,
  restaurant: RestaurantTables
}): Promise<SearchTimesWithTables[] | void> => {
  const searchTimes = times.find((t) => {
    return t.time === time;
  })?.searchTimes;

  if (!searchTimes) {
    return res.status(400).json({
      errorMessage: "Invalid data provided",
    });
  }

  const bookings = await getBookingsForRestaurant(
    slug,
    day,
    searchTimes[0],
    searchTimes[searchTimes.length - 1]
  );

  const tables = restaurant.tables;

  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  // Filter out tables with reservations already
  searchTimesWithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      if (bookings[t.date.toISOString()]) {
        if (bookings[t.date.toISOString()][table.id]) {
          return false;
        }
      }
      return true;
    })
  })

  return searchTimesWithTables
}
