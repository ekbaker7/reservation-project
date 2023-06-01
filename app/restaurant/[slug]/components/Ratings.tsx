import { Review } from "@prisma/client";
import Stars from "../../../components/Stars";

function Ratings({ rating, reviews} : {rating: number, reviews: Review[]}) {
  return (
    <div className="flex items-end">
      <div className="ratings mt-2 flex items-center">
        <p><Stars rating={rating} /></p>
        <p className="text-reg ml-3">{rating.toFixed(1)}</p>
      </div>
      <div className="">
        <p className="text-reg ml-4">{reviews.length} review{reviews.length != 1 ? 's' : ''}</p>
      </div>
    </div>
  );
}

export default Ratings;
