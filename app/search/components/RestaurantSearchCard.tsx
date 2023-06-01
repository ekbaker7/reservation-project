import Link from "next/link";
import { RestaurantCardType } from "../../../lib/dbModels"
import Price from "../../components/Price";
import Stars from "../../components/Stars";

function RestaurantSearchCard({restaurant} : {restaurant: RestaurantCardType}) {
  const displayRating = (rating: number) => {
    if (rating > 4.5) {
      return 'Amazing'
    }
    else if (rating > 4) {
      return 'Incredible'
    }
    else if (rating > 3) {
      return 'Excellent'
    }
    else if (rating == 0) {
      return 'No reviews yet!'
    }
    else {
      return 'Good'
    }
  }

  return (
    <div className="border-b flex pb-5 ml-4">
      <img
        src={restaurant.main_image}
        alt=""
        className="w-44 h-36 rounded"
      />
      <div className="pl-5">
        <h2 className="text-3xl">{restaurant.name}</h2>
        <div className="flex items-start">
          <div className="flex mb-2"><Stars rating={restaurant.rating} /></div>
          <p className="ml-2 text-sm">{displayRating(restaurant.rating)}</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <Price price={restaurant.price} />
            <p className="mr-4 capitalize">{restaurant.cuisine.name}</p>
            <p className="mr-4 capitalize">{restaurant.location.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`/restaurant/${restaurant.slug}`}>View more information</Link>
        </div>
      </div>
    </div>
  );
}

export default RestaurantSearchCard;
