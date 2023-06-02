import RestaurantNavBar from "./components/RestaurantNavBar";
import Title from "./components/Title";
import Ratings from "./components/Ratings";
import Description from "./components/Description";
import Images from "./components/Images";
import Reviews from "./components/Reviews";
import ReservationCard from "./components/ReservationCard";
import { Fragment } from "react";
import { fetchRestaurantBySlug } from "../../../lib/dbUtils";
import { notFound } from "next/navigation";

export default async function RestaurantDetails({params}: {params: {slug: string}}) {
  const restaurant = await fetchRestaurantBySlug(params.slug)

  if (!restaurant) {
    throw notFound()
  }

  return (
    <Fragment>
      <div className="bg-white w-[70%] rounded p-3">
        <RestaurantNavBar slug={restaurant.slug}/>
        <Title name={restaurant.name} />
        <Ratings rating={restaurant.rating} reviews={restaurant.reviews} />
        <Description description={restaurant.description} />
        <Images images={restaurant.images}/>
        <Reviews reviews={restaurant.reviews} />
      </div>
      <div className="w-[27%] relative text-reg">
        <ReservationCard />
      </div>
    </Fragment>
  );
}
