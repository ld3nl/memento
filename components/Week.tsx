"use client";
import React from "react";
import { WeekProps } from "../lib/types";

// Week component to display a single week with conditional styling
const Week = ({ weekIndex, isFilled }: WeekProps) => {
  return (
    <div
      className={`size-2 border border-black dark:border-purple-500 ${
        isFilled ? "bg-black dark:bg-purple-500" : ""
      } ${weekIndex > 26 ? "ml-auto" : ""}`}
    ></div>
  );
};

export default Week;
