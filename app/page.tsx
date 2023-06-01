import { Inter } from "@next/font/google";
import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import { PrismaClient } from "@prisma/client";
import { fetchAllRestaurants } from "../lib/dbUtils";

const prisma = new PrismaClient();

const inter = Inter({ subsets: ["latin"] });

export default async function Home() {
  const restaurants = await fetchAllRestaurants();

  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </main>
  );
}
