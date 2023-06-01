import { PrismaClient, Item } from "@prisma/client";
import {
  RestaurantCardType,
  RestaurantDetailsType,
  LocationSearch,
  CuisineSearch,
} from "./dbModels";
import { calculateRatingsAverage } from "./utils";

const prisma = new PrismaClient();

export async function fetchAllRestaurants(): Promise<RestaurantCardType[]> {
  const restaurantsRaw = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      main_image: true,
      cuisine: true,
      location: true,
      price: true,
      slug: true,
      reviews: true
    },
  });

  const restaurants: RestaurantCardType[] = restaurantsRaw.map((restaurant) => {
    return {
      ...restaurant,
      reviews: restaurant.reviews.length,
      rating: calculateRatingsAverage(restaurant.reviews)
    };
  });

  return restaurants;
}

export async function fetchRestaurantBySlug(
  slug: string
): Promise<RestaurantDetailsType> {
  const restaurantRaw = await prisma.restaurant.findUniqueOrThrow({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
      reviews: true
    },
  });

  const restaurant = {
    ...restaurantRaw,
    rating: calculateRatingsAverage(restaurantRaw.reviews)
  }

  return restaurant;
}

export async function fetchRestaurantsBySearch(
  searchParams: any
): Promise<RestaurantCardType[]> {
  let searchObj: any = {};

  if (searchParams.city) {
    searchObj.location = {
      name: {
        equals: searchParams.city,
        mode: "insensitive",
      },
    };
  }

  if (searchParams.cuisine) {
    searchObj.cuisine = {
      name: {
        equals: searchParams.cuisine,
        mode: "insensitive",
      },
    };
  }

  if (searchParams.price) {
    searchObj.price = {
      equals: searchParams.price,
    };
  }

  const restaurantsRaw = await prisma.restaurant.findMany({
    where: {
      ...searchObj,
    },
    select: {
      id: true,
      name: true,
      main_image: true,
      cuisine: true,
      location: true,
      price: true,
      slug: true,
      reviews: true
    },
  });

  const restaurants: RestaurantCardType[] = restaurantsRaw.map((restaurant) => {

    return {
      ...restaurant,
      reviews: restaurant.reviews.length,
      rating: calculateRatingsAverage(restaurant.reviews)
    };
  });

  return restaurants;
}

export async function fetchCusines(): Promise<CuisineSearch[]> {
  const cuisines = await prisma.cuisine.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return cuisines;
}

export async function fetchLocations(): Promise<LocationSearch[]> {
  const locations = await prisma.location.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return locations;
}

export async function fetchRestaurantMenu(slug: string): Promise<Item[]> {
  const restaurant = await prisma.restaurant.findUniqueOrThrow({
    where: {
      slug,
    },
    select: {
      items: true,
    },
  });

  if (!restaurant) {
    throw new Error();
  }

  return restaurant.items;
}
