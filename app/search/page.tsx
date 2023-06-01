import Header from "./components/Header";
import SearchSideBar from "./components/SearchSideBar";
import RestaurantSearchCard from "./components/RestaurantSearchCard";
import { Fragment } from "react";
import { PRICE } from "@prisma/client";
import {
  fetchRestaurantsBySearch,
  fetchCusines,
  fetchLocations,
} from "../../lib/dbUtils";
import { RestaurantCardType } from "../../lib/dbModels";

export default async function Search({
  searchParams,
}: {
  searchParams: { city?: string; cuisine?: string; price?: PRICE };
}) {
  let restaurants: RestaurantCardType[] = [];
  if (
    searchParams &&
    (searchParams.city || searchParams.cuisine || searchParams.price)
  ) {
    restaurants = await fetchRestaurantsBySearch(searchParams);
  }

  let cuisines = await fetchCusines();
  let locations = await fetchLocations();

  let noResultsArr = [];

  if (searchParams.city) {
    noResultsArr.push(
      <span key="no-results-1" className="capitalize">
        "{searchParams.city}"
      </span>
    );
  }
  if (searchParams.cuisine) {
    noResultsArr.push(
      <span key="no-results-2" className="capitalize">
        {noResultsArr.length > 0 ? ", " : ""}"{searchParams.cuisine}"
      </span>
    );
  }
  if (searchParams.price) {
    noResultsArr.push(
      <span key="no-results-3" className="capitalize">
        {noResultsArr.length > 0 ? ", " : ""}"{searchParams.price}"
      </span>
    );
  }

  return (
    <Fragment>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          locations={locations}
          cuisines={cuisines}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length ? (
            restaurants.map((restaurant) => (
              <RestaurantSearchCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))
          ) : (
            <div>
              <p>
                <span>Sorry, no restaurants found for </span>
                {noResultsArr.map((item) => item)}
                <span>.</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
