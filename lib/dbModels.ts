import { Cuisine, Location, PRICE, Review } from "@prisma/client";

// INTERFACES

export interface RestaurantDetailsType {
  id: number;
  name: string;
  images: string[];
  description: string;
  slug: string;
  reviews: Review[];
  rating: number;
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
