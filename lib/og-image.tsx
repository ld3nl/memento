import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function contentOgImage({
  title,
  kicker = "Memento Mori",
}: {
  title: string;
  kicker?: string;
}) {
  const titleSize = title.length > 58 ? 48 : title.length > 36 ? 56 : 64;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#09090b",
          color: "#fafafa",
        }}
      >
        <div
          style={{
            width: 18,
            height: "100%",
            backgroundColor: "#dc2626",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#a1a1aa",
              fontFamily: "Georgia, serif",
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              lineHeight: 1.15,
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#a1a1aa",
              fontFamily: "Georgia, serif",
            }}
          >
            Life in weeks
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
