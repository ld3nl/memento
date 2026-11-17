import * as stylex from "@stylexjs/stylex";
import { tokens } from "../../styles/tokens.stylex";

interface MementoCardProps {
  weekNumber: string;
  age: string;
  quote?: string;
  author?: string;
  milestone?: {
    title: string;
    date: string;
  };
  prompt?: string;
}

const styles = stylex.create({
  card: {
    width: "20rem",
    borderRadius: "1.5rem",
    backgroundColor: tokens.card,
    padding: "1.5rem",
    fontFamily: tokens.fontSans,
    color: tokens.white,
  },
  header: {
    display: "flex",
    alignItems: "center",
    columnGap: "0.5rem",
    marginBottom: "0.75rem",
  },
  dot: {
    height: "0.375rem",
    width: "0.375rem",
    borderRadius: 9999,
    backgroundColor: tokens.mark,
  },
  week: {
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    letterSpacing: tokens.trackingMark,
    textTransform: "uppercase",
    color: tokens.mark,
  },
  age: {
    margin: 0,
    fontFamily: tokens.fontDisplay,
    fontSize: tokens.cardTitle,
    lineHeight: 1,
    letterSpacing: tokens.trackingCard,
  },
  rule: {
    height: 1,
    marginBlock: "1.25rem",
    backgroundColor: `color-mix(in oklab, ${tokens.surface} 10%, transparent)`,
  },
  ruleTight: {
    height: 1,
    marginBlock: "1rem",
    backgroundColor: `color-mix(in oklab, ${tokens.surface} 10%, transparent)`,
  },
  reflection: {
    marginBottom: "1.25rem",
  },
  kicker: {
    marginBottom: "0.625rem",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    letterSpacing: tokens.trackingMarkTight,
    color: tokens.mark,
  },
  milestoneKicker: {
    marginBottom: "0.75rem",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    letterSpacing: tokens.trackingMarkTight,
    color: tokens.mark,
  },
  quote: {
    position: "relative",
    margin: 0,
    paddingLeft: "1.5rem",
    fontFamily: tokens.fontDisplay,
    fontStyle: "italic",
    color: `color-mix(in oklab, ${tokens.white} 95%, transparent)`,
  },
  mark: {
    pointerEvents: "none",
    position: "absolute",
    top: "-0.125rem",
    left: 0,
    fontFamily: tokens.fontDisplay,
    fontSize: tokens.cardMark,
    lineHeight: 1,
    color: `color-mix(in oklab, ${tokens.mark} 35%, transparent)`,
    userSelect: "none",
  },
  quoteText: {
    margin: 0,
    fontSize: tokens.cardBody,
    lineHeight: 1.375,
  },
  cite: {
    display: "block",
    marginTop: "0.5rem",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    fontWeight: 500,
    fontStyle: "normal",
    letterSpacing: "0.05em",
    color: tokens.mark,
  },
  milestoneRow: {
    display: "flex",
    alignItems: "flex-start",
    columnGap: "0.75rem",
  },
  trophy: {
    marginTop: "0.125rem",
    display: "flex",
    height: "2rem",
    width: "2rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklab, ${tokens.mark} 70%, transparent)`,
  },
  trophyIcon: {
    height: "1rem",
    width: "1rem",
    color: tokens.mark,
  },
  milestoneTitle: {
    fontFamily: tokens.fontDisplay,
    fontSize: tokens.cardBody,
    lineHeight: 1.25,
    fontWeight: 600,
  },
  milestoneDate: {
    marginTop: "0.125rem",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    letterSpacing: "0.025em",
    color: `color-mix(in oklab, ${tokens.white} 60%, transparent)`,
  },
  prompt: {
    marginTop: "1.75rem",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: `color-mix(in oklab, ${tokens.white} 10%, transparent)`,
    paddingTop: "1rem",
  },
  promptText: {
    margin: 0,
    textAlign: "center",
    fontSize: tokens.cardCaption,
    letterSpacing: "0.025em",
    color: `color-mix(in oklab, ${tokens.white} 70%, transparent)`,
  },
});

export function MementoCard({
  weekNumber,
  age,
  quote = "You have power over your mind — not outside events. Realize this, and you will find strength.",
  author = "EPICTETUS",
  milestone,
  prompt = "What will you do with this week?",
}: MementoCardProps) {
  return (
    <article {...stylex.props(styles.card)}>
      <div {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.dot)} />
        <span {...stylex.props(styles.week)}>{weekNumber}</span>
      </div>

      <h1 {...stylex.props(styles.age)}>{age}</h1>

      <div {...stylex.props(styles.rule)} />

      <section {...stylex.props(styles.reflection)}>
        <div {...stylex.props(styles.kicker)}>STOIC REFLECTION</div>
        <blockquote {...stylex.props(styles.quote)}>
          <span {...stylex.props(styles.mark)}>"</span>
          <p {...stylex.props(styles.quoteText)}>{quote}</p>
          <cite {...stylex.props(styles.cite)}>- {author}</cite>
        </blockquote>
      </section>

      {milestone && (
        <>
          <div {...stylex.props(styles.ruleTight)} />

          <section>
            <div {...stylex.props(styles.milestoneKicker)}>MILESTONE</div>
            <div {...stylex.props(styles.milestoneRow)}>
              <div {...stylex.props(styles.trophy)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  {...stylex.props(styles.trophyIcon)}
                  viewBox="0 0 256 256"
                  aria-hidden="true"
                >
                  <title>Trophy</title>
                  <line
                    x1="96"
                    y1="224"
                    x2="160"
                    y2="224"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <line
                    x1="128"
                    y1="184"
                    x2="128"
                    y2="224"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <path
                    d="M58,128H48A32,32,0,0,1,16,96V80a8,8,0,0,1,8-8H56"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <path
                    d="M198,128h10a32,32,0,0,0,32-32V80a8,8,0,0,0-8-8H200"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <path
                    d="M56,48H200v63.1c0,39.7-31.75,72.6-71.45,72.9A72,72,0,0,1,56,112Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                </svg>
              </div>
              <div>
                <div {...stylex.props(styles.milestoneTitle)}>
                  {milestone.title}
                </div>
                <div {...stylex.props(styles.milestoneDate)}>
                  {milestone.date}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <div {...stylex.props(styles.prompt)}>
        <p {...stylex.props(styles.promptText)}>{prompt}</p>
      </div>
    </article>
  );
}
