import { Cuisine, Location, PRICE, Review, Booking_Table, Table } from "@prisma/client";

// INTERFACES

export interface RestaurantDetailsType {
  id: number;
  name: string;
  images: string[];
  description: string;
  slug: string;
  reviews: Review[];
  rating: number;
  open_time: string;
  close_time: string;
  location: Location;
  main_image: string;
}

export interface LocationSearch {
  id: number;
  name: string;
}

export interface CuisineSearch {
  id: number;
  name: string;
}

export interface RestaurantCardType {
  id: number;
  name: string;
  main_image: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
  slug: string;
  reviews: number;
  rating: number;
}

export interface NewUserType {
  first_name: string;
  last_name: string;
  city: string;
  password: string;
  email: string;
  phone: string;
}

export interface UserInformationType {
  id: number;
  first_name: string;
  last_name: string;
  city: string;
  email: string;
  phone: string;
}

export interface BookingSearchType {
  number_of_people: number;
  booking_time: string;
  booking_tables: Booking_Table[]
}

export interface CompressedBookingType {
  [key: string]: {
    [tableNumber: number]: Boolean
  }
}

export interface TableType {
  id: number,
  seats: number
}

export interface AvailableTimes {
  time: string,
  available: Boolean
}

export interface RestaurantTables {
  id: number;
  open_time: string;
  close_time: string;
  tables: Table[]
}

export interface SearchTimesWithTables {
  date: Date;
  time: string;
  tables: Table[];
}

export interface NewBookingType {
  number_of_people:  number;
  booking_time:      Date;
  booker_email:      string;
  booker_phone:      string;
  booker_first_name: string;
  booker_last_name:  string;
  booker_occasion?:   string;
  booker_request?:    string;
  restaurant_id:     number;
}

export interface BookingTableType {
  booking_id: number
  table_id: number
}