import fullStar from "../../public/icons/full-star.png";
import halfStar from "../../public/icons/half-star.png";
import emptyStar from "../../public/icons/empty-star.png";
import Image from "next/image";

function Stars({ rating }: { rating: number }) {
  const renderStars = () => {
    let starArr: JSX.Element[] = [];
    let floatRating = parseFloat(rating.toFixed(1));

    for (let i = 1; i < 6; i++) {
      if (i - 0.3 <= floatRating) {
        starArr.push(
          <Image
            key={`star-${i}`}
            src={fullStar}
            alt={""}
            className="w-4 h-4 mr-1"
          />
        );
      } else if (i - 0.8 <= floatRating && floatRating < i - 0.3) {
        starArr.push(
          <Image
            key={`star-${i}`}
            src={halfStar}
            alt={""}
            className="w-4 h-4 mr-1"
          />
        );
      } else {
        starArr.push(
          <Image
            key={`star-${i}`}
            src={emptyStar}
            alt={""}
            className="w-4 h-4 mr-1"
          />
        );
      }
    }

    return starArr;
  };

  return <div className="flex items-center">{renderStars()}</div>;
}

export default Stars;
