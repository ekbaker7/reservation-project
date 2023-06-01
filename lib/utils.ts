import { Review } from "@prisma/client";

export function calculateRatingsAverage (reviews: Review[]) {
    if (!reviews || !reviews.length) {
        return 0
    }

    return reviews.reduce((sum, review) => { return sum + review.rating }, 0) / reviews.length 
}