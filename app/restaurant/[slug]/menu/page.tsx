import RestaurantNavBar from "../components/RestaurantNavBar";
import Menu from "./components/Menu";
import { Fragment } from "react";
import { fetchRestaurantMenu } from "../../../../lib/dbUtils";

export default async function RestaurantMenu({params}: {params: {slug: string}}) {
  const menu = await fetchRestaurantMenu(params.slug)

  return (
    <Fragment>
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
        <div className="bg-white w-[100%] rounded p-3">
          <RestaurantNavBar slug={params.slug}/>
          <Menu menu={menu}/>
        </div>
      </div>
    </Fragment>
  );
}
