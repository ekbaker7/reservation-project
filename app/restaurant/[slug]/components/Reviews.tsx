import { Review } from "@prisma/client";
import ReviewCard from "./ReviewCard";

function Reviews({ reviews }: { reviews: Review[] }) {
  const hasReviews = reviews && reviews.length;

  return (
    <div>
      {hasReviews ? (
        <h1 className="font-bold text-3xl mt-10 mb-7 border-b pb-5">
          What {reviews.length}{" "}
          {reviews.length === 1 ? "person is" : "people are"} saying
        </h1>
      ) : (
        <></>
      )}
      {!hasReviews ? (
        <h1 className="font-bold text-3xl mt-10 mb-7 border-b pb-5">
          No reviews yet. Will you be the first?
        </h1>
      ) : (
        <></>
      )}

      <div>
        <div className="border-b pb-7 mb-7">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reviews;
