"use client";

import * as stylex from "@stylexjs/stylex";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { calculateLifeWeeks } from "../lib/date-utils";
import type { LifeWeekCountMode } from "../lib/life-grid-time";
import { lifeImageAlt, speakBirthDate } from "../lib/life-picture";
import { birthDateFromPathSegments, lifeImagePath } from "../lib/url-utils";
import { resolveWeekCountMode } from "../lib/week-count-mode";
import { breakpoints } from "../styles/breakpoints.stylex";
import { kicker } from "../styles/recipes/kicker.stylex";
import { tokens } from "../styles/tokens.stylex";
import { LifeSharePicture } from "./LifeSharePicture";

const styles = stylex.create({
  summary: {
    display: {
      default: "block",
      [breakpoints.print]: "none",
    },
    width: "100%",
    maxWidth: "48rem",
    marginInline: "auto",
    marginTop: {
      default: "4rem",
      [breakpoints.sm]: "5rem",
    },
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: `color-mix(in oklab, ${tokens.accent} 20%, transparent)`,
    paddingInline: "1rem",
    paddingTop: {
      default: "4rem",
      [breakpoints.sm]: "5rem",
    },
  },
  stats: {
    borderLeftWidth: 3,
    borderLeftStyle: "solid",
    borderLeftColor: tokens.accent,
    paddingLeft: {
      default: "1.5rem",
      [breakpoints.sm]: "2rem",
    },
  },
  lived: {
    fontFamily: tokens.fontMono,
    fontSize: {
      default: "3rem",
      [breakpoints.smOnly]: "3.75rem",
      [breakpoints.lg]: "4.5rem",
    },
    lineHeight: 1,
    fontWeight: 700,
    color: tokens.accent,
    fontVariantNumeric: "tabular-nums",
  },
  statLabel: {
    marginTop: "0.75rem",
    marginBottom: 0,
    fontSize: {
      default: "0.75rem",
      [breakpoints.sm]: "0.875rem",
    },
  },
  remaining: {
    marginTop: {
      default: "2.5rem",
      [breakpoints.sm]: "3rem",
    },
    fontFamily: tokens.fontMono,
    fontSize: {
      default: "2.25rem",
      [breakpoints.smOnly]: "3rem",
      [breakpoints.lg]: "3.75rem",
    },
    lineHeight: 1,
    fontWeight: 700,
    color: tokens.primary,
    fontVariantNumeric: "tabular-nums",
  },
  note: {
    marginTop: {
      default: "3rem",
      [breakpoints.sm]: "4rem",
    },
    marginBottom: 0,
    fontFamily: tokens.fontSans,
    fontSize: {
      default: "1rem",
      [breakpoints.sm]: "1.125rem",
    },
    lineHeight: 1.625,
    color: tokens.secondary,
  },
});

export function LifeCalendarSummary({ iso }: { iso: string }) {
  const searchParams = useSearchParams();
  const urlMode: LifeWeekCountMode =
    searchParams.get("weeks") === "calendar" ? "calendar" : "birthday-grid";
  const [mode, setMode] = useState<LifeWeekCountMode>(urlMode);

  useEffect(() => {
    // react-doctor-disable-next-line react-hooks-js/set-state-in-effect
    setMode(resolveWeekCountMode(searchParams));
  }, [searchParams]);

  const birth = birthDateFromPathSegments(iso.split("-"));
  const life = birth ? calculateLifeWeeks(birth, new Date(), mode) : null;
  const weeksLived = life?.weeksLived ?? 0;
  const weeksRemaining = life?.weeksRemaining ?? 0;
  const src = birth ? lifeImagePath(birth, mode) : "";

  return (
    <section {...stylex.props(styles.summary)}>
      <div {...stylex.props(styles.stats)}>
        <div {...stylex.props(styles.lived)}>{weeksLived.toLocaleString()}</div>
        <div {...stylex.props(kicker.base, styles.statLabel)}>Weeks lived</div>

        {weeksRemaining > 0 && (
          <>
            <div {...stylex.props(styles.remaining)}>
              {weeksRemaining.toLocaleString()}
            </div>
            <div {...stylex.props(kicker.base, styles.statLabel)}>
              Weeks remaining (est.)
            </div>
          </>
        )}
      </div>

      <p {...stylex.props(styles.note)}>
        Each square is a week. The filled ones are gone. Make the empty ones
        count.
      </p>
      <LifeSharePicture
        src={src}
        alt={lifeImageAlt(iso)}
        caption={`Born ${speakBirthDate(iso)}. The picture is the same count as the grid.`}
      />
    </section>
  );
}
