import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#ff4500",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 800,
            fontFamily: "sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          KC
        </span>
      </div>
    ),
    { ...size }
  );
}
