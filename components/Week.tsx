import React from "react";
import { WeekProps } from "../lib/types";

const Week = ({ weekIndex, isFilled }: WeekProps) => {
  return (
    <div
      className={`size-2 border border-black ${isFilled ? "bg-black" : ""} ${
        weekIndex > 26 ? "ml-auto" : ""
      }`}
    ></div>
  );
};

export default Week;
