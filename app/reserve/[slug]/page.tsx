import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import ReserveHeader from "./components/ReserveHeader";
import ReserveForm from "./components/ReserveForm";
import { Fragment } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Reserve() {
  return (
    <Fragment>
      <div className="border-t h-screen">
        <div className="py-9 w-3/5 m-auto">
          <ReserveHeader />
          <ReserveForm />
        </div>
      </div>
    </Fragment>
  );
}
