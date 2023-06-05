import { NextApiRequest, NextApiResponse } from "next";
import {
  createBooking,
  createBookingTables,
  getTablesForRestaurant,
} from "../../../../lib/availabilityUtils";
import {
  SearchTimesWithTables,
  NewBookingType,
  BookingTableType,
} from "../../../../lib/dbModels";
import { findAvailableTables } from "../../../../services/restaurant/findAvailbleTables";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    const partySizeAsInt = parseInt(partySize);

    if (partySizeAsInt < 1 || partySizeAsInt > 8) {
      return res.status(400).json({
        errorMessage: "Invalid party size",
      });
    }

    const {
      bookerEmail,
      bookerPhone,
      bookerFirstName,
      bookerLastName,
      bookerOccasion,
      bookerRequest,
    } = req.body as {
      bookerEmail: string;
      bookerPhone: string;
      bookerFirstName: string;
      bookerLastName: string;
      bookerOccasion: string;
      bookerRequest: string;
    };

    const restaurant = await getTablesForRestaurant(slug);

    if (!restaurant || !restaurant.tables) {
      return res.status(400).json({
        errorMessage: "Invalid data provided",
      });
    }

    const restaurantOpenDateTime = new Date(`${day}T${restaurant.open_time}`);
    const restaurantCloseDateTime = new Date(`${day}T${restaurant.close_time}`);
    const reservationDateTime = new Date(`${day}T${time}`);
    if (
      reservationDateTime < restaurantOpenDateTime ||
      reservationDateTime > restaurantCloseDateTime
    ) {
      return res.status(400).json({
        errorMessage: "Restaurant is not open during the requested time.",
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

    const searchTimeWithTables = searchTimesWithTables.find((searchTime) => {
      return (
        searchTime.date.toISOString() === reservationDateTime.toISOString()
      );
    });

    if (!searchTimeWithTables) {
      return res.status(400).json({
        errorMessage: "No availability for date/time selected",
      });
    }

    const tablesCount: {
      2: number[];
      4: number[];
    } = {
      2: [],
      4: [],
    };

    const sumSeats = searchTimeWithTables.tables.reduce(
      (sum, table) => sum + table.seats,
      0
    );

    if (sumSeats < partySizeAsInt) {
      return res.status(400).json({
        errorMessage: "Not enough seating for selected date/time",
      });
    }

    searchTimeWithTables.tables.forEach((table) => {
      if (table.seats === 2) {
        tablesCount["2"].push(table.id);
      } else if (table.seats === 4) {
        tablesCount["4"].push(table.id);
      }
    });

    const tablesToBook: number[] = [];
    let seatsRemaining = partySizeAsInt;

    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tablesCount["4"].length) {
          tablesToBook.push(tablesCount["4"][0]);
          tablesCount["4"].shift();
          seatsRemaining = seatsRemaining - 4;
        } else {
          tablesToBook.push(tablesCount["2"][0]);
          tablesCount["2"].shift();
          seatsRemaining = seatsRemaining - 2;
        }
      } else {
        if (tablesCount["2"].length) {
          tablesToBook.push(tablesCount["2"][0]);
          tablesCount["2"].shift();
          seatsRemaining = seatsRemaining - 2;
        } else {
          tablesToBook.push(tablesCount["4"][0]);
          tablesCount["4"].shift();
          seatsRemaining = seatsRemaining - 4;
        }
      }
    }

    const newBooking = await createBooking({
      booker_email: bookerEmail,
      booker_first_name: bookerFirstName,
      booker_last_name: bookerLastName,
      booker_phone: bookerPhone,
      booker_occasion: bookerOccasion,
      booker_request: bookerRequest,
      restaurant_id: restaurant.id,
      number_of_people: partySizeAsInt,
      booking_time: reservationDateTime,
    });

    const bookingTablesData: BookingTableType[] = tablesToBook.map((ttb) => {
      return { booking_id: newBooking.id, table_id: ttb };
    });

    const newBookingTables = await createBookingTables(bookingTablesData)

    return res
      .status(200)
      .json({ newBooking, newBookingTables });
  }
}
