import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import ReserveHeader from "./components/ReserveHeader";
import ReserveForm from "./components/ReserveForm";
import { Fragment } from "react";
import { fetchRestaurantBySlug } from "../../../lib/dbUtils";
import { notFound } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default async function Reserve({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { date: string; partySize: string };
}) {
  const restaurant = await fetchRestaurantBySlug(params.slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <Fragment>
      <div className="border-t h-screen">
        <div className="py-9 w-3/5 m-auto">
          <ReserveHeader restaurant={restaurant} date={searchParams.date} partySize={searchParams.partySize} />
          <ReserveForm slug={params.slug} partySize={searchParams.partySize} date={searchParams.date} />
        </div>
      </div>
    </Fragment>
  );
}
