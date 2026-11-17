"use client";

import { createContext } from "react";

export type InspectWeek = (lifeYear: number, weekIndex: number) => void;

export const WeekInspectContext = createContext<InspectWeek | null>(null);
