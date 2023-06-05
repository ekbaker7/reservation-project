import { PrismaClient } from "@prisma/client";
import { CompressedBookingType, RestaurantTables, NewBookingType, BookingTableType } from "./dbModels";

let prisma;

if (!prisma) {
  prisma = new PrismaClient();
}

export async function getBookingsForRestaurant(
  restaurantSlug: string,
  bookingDay: string,
  beginningBookingTime: string,
  endingBookingTime: string
): Promise<CompressedBookingType> {
  const bookings = await prisma.booking.findMany({
    where: {
      restaurant: {
        slug: restaurantSlug,
      },
      booking_time: {
        gte: new Date(`${bookingDay}T${beginningBookingTime}`),
        lte: new Date(`${bookingDay}T${endingBookingTime}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      booking_tables: true,
    },
  });

  let compressedBookings = {};
  bookings.forEach((booking) => {
    compressedBookings[`${booking.booking_time.toISOString()}`] =
      booking.booking_tables.reduce((obj, table) => {
        return {
          ...obj,
          [table.table_id]: true,
        };
      }, {});
  });

  return compressedBookings;
}

export async function getTablesForRestaurant(
  restaurantSlug: string
): Promise<RestaurantTables> {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: restaurantSlug,
    },
    select: {
      id: true,
      open_time: true,
      close_time: true,
      tables: true,
    },
  });

  return restaurant;
}

export async function createBooking(newBookingData: NewBookingType) {
  const newBooking = await prisma.booking.create({
    data: {
      ...newBookingData
    },
  });

  return newBooking;
}

export async function createBookingTables(bookingTableDatas: BookingTableType[]) {
  const newBookingTable = await prisma.booking_Table.createMany({
    data: bookingTableDatas
  })

  return newBookingTable;
}