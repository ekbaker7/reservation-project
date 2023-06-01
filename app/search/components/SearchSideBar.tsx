import Link from "next/link";
import { PRICE } from "@prisma/client";
import { LocationSearch, CuisineSearch } from "../../../lib/dbModels";

function SearchSideBar({
  locations,
  cuisines,
  searchParams,
}: {
  locations: LocationSearch[];
  cuisines: CuisineSearch[];
  searchParams: { city?: string; cuisine?: string; price?: string };
}) {
  const prices = [
    {
      key: "PRICE-BTN-1",
      price: PRICE.CHEAP,
      label: "$$",
      selectedClass: "border w-full text-reg font-bold rounded-l p-2",
      defaultClass: "border w-full text-reg font-light rounded-l p-2",
    },
    {
      key: "PRICE-BTN-2",
      price: PRICE.REGULAR,
      label: "$$$",
      selectedClass: "border-r border-t border-b w-full text-reg font-bold p-2",
      defaultClass: "border-r border-t border-b w-full text-reg font-light p-2",
    },
    {
      key: "PRICE-BTN-3",
      price: PRICE.EXPENSIVE,
      label: "$$$$",
      selectedClass:
        "border-r border-t border-b w-full text-reg font-bold rounded-r p-2",
      defaultClass:
        "border-r border-t border-b w-full text-reg font-light rounded-r p-2",
    },
  ];

  return (
    <div className="w-1/5">
      <div className="border-b pb-4 flex flex-col">
        <h1 className="mb-2">Region</h1>
        {locations.map((location) => (
          <Link
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                city: location.name,
              },
            }}
            key={`location-key-${location.id}`}
            className={
              searchParams &&
              searchParams.city &&
              searchParams.city.toLowerCase() === location.name.toLowerCase()
                ? "text-reg capitalize font-bold"
                : "text-reg font-light capitalize"
            }
          >
            {location.name}
          </Link>
        ))}
      </div>
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines.map((cuisine) => (
          <Link
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                cuisine: cuisine.name,
              },
            }}
            key={`cuisine-key-${cuisine.id}`}
            className={
              searchParams &&
              searchParams.cuisine &&
              searchParams.cuisine.toLowerCase() === cuisine.name.toLowerCase()
                ? "text-reg capitalize font-bold"
                : "text-reg font-light capitalize"
            }
          >
            {cuisine.name}
          </Link>
        ))}
      </div>
      <div className="pb-4 mt-3">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          {prices.map(({ key, price, label, selectedClass, defaultClass }) => (
            <Link
              key={key}
              href={{
                pathname: "/search",
                query: {
                  ...searchParams,
                  price: price,
                },
              }}
              className={
                searchParams &&
                searchParams.price &&
                searchParams.price === price
                  ? selectedClass
                  : defaultClass
              }
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchSideBar;
