"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackSwitchView } from "../lib/analytics";

type View = "table" | "burst";

export function SwitchViewLink({
  view,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { view: View }) {
  return (
    <Link
      {...props}
      onClick={event => {
        trackSwitchView(view);
        if (typeof onClick === "function") onClick(event);
      }}
    />
  );
}
