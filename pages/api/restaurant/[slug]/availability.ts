import { NextApiRequest, NextApiResponse } from "next";
import {
  AvailableTimes,
  SearchTimesWithTables,
} from "../../../../lib/dbModels";
import { findAvailableTables } from "../../../../services/restaurant/findAvailbleTables";
import { getTablesForRestaurant } from "../../../../lib/availabilityUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    if (!day || !time || !partySize) {
      return res.status(400).json({
        errorMessage: "Invalid data provided",
      });
    }

    const restaurant = await getTablesForRestaurant(slug);

    if (!restaurant || !restaurant.tables) {
      return res.status(400).json({
        errorMessage: "Invalid data provided",
      });
    }

    const searchTimesWithTables = (await findAvailableTables({
      slug,
      day,
      time,
      partySize,
      res,
      restaurant,
    })) as SearchTimesWithTables[];

    if (!searchTimesWithTables) {
      return res.status(400).json({
        errorMessage: "Invalid data provided",
      });
    }

    // Construct the available times array
    const availablities: AvailableTimes[] = searchTimesWithTables
      .map((t) => {
        const sumSeats = t.tables.reduce((sum, table) => sum + table.seats, 0);

        return {
          time: t.time,
          available: sumSeats >= parseInt(partySize),
        };
      })
      .filter((availability) => {
        const timeIsAfterOpeningHour =
          new Date(`${day}T${availability.time}`) >=
          new Date(`${day}T${restaurant.open_time}`);
        const timeIsBeforeClosingHour =
          new Date(`${day}T${availability.time}`) <=
          new Date(`${day}T${restaurant.close_time}`);
        return timeIsAfterOpeningHour && timeIsBeforeClosingHour;
      });

    return res.status(200).json(availablities);
  }
}
