import { Time, convertToDisplayTime } from "../../../../data";
import { RestaurantDetailsType } from "../../../../lib/dbModels";
import { format } from "date-fns"

function ReserveHeader({ restaurant, date, partySize }: { restaurant: RestaurantDetailsType, date:string, partySize: string }) {

  const [day, time] = date.split("T")

  return (
    <div>
      <h3 className="font-bold">You're almost done!</h3>
      <div className="mt-5 flex">
        <img
          src={restaurant.main_image}
          alt=""
          className="w-32 h-18 rounded"
        />
        <div className="ml-4">
          <h1 className="text-3xl font-bold capitalize">{restaurant.name} - <span>{restaurant.location.name}</span></h1>
          <div className="flex mt-3">
            <p className="mr-6">{format(new Date(date), "cccc, LLLL do")}</p>
            <p className="mr-6">{convertToDisplayTime(time as Time)}</p>
            <p className="mr-6">{partySize} {partySize === "1" ? 'person' : 'people'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReserveHeader;
