"use client";

const bg =
  "/img/Wrath Classic Fall of the Lich King Launch Screenshots/WoW_WrathClassic_Fall_of_the_Lich_King_(3)_png_jpgcopy.jpg";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
            `,
          }}
        />
      </head>
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url('${bg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(6,10,15,0.8), rgba(6,10,15,0.93), rgba(6,10,15,1))",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "2rem",
            maxWidth: "32rem",
          }}
        >
          <p
            style={{
              fontSize: "10rem",
              lineHeight: 1,
              fontWeight: 900,
              color: "rgba(220,38,38,0.8)",
              filter: "drop-shadow(0 0 40px rgba(220,38,38,0.3))",
            }}
          >
            500
          </p>

          <div
            style={{
              width: "6rem",
              height: "2px",
              margin: "1.5rem auto",
              background:
                "linear-gradient(90deg, transparent, rgba(180,140,60,0.6), transparent)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s linear infinite",
            }}
          />

          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: 700,
              color: "#f3f4f6",
              marginBottom: "0.75rem",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              color: "#9ca3af",
              marginBottom: "2.5rem",
              lineHeight: 1.6,
            }}
          >
            A critical error occurred. Please try again.
          </p>

          <button
            onClick={reset}
            style={{
              background: "rgba(180, 140, 60, 0.15)",
              border: "1px solid rgba(180, 140, 60, 0.4)",
              boxShadow: "0 0 20px rgba(180, 140, 60, 0.15)",
              color: "#b48c3c",
              padding: "0.875rem 2.5rem",
              borderRadius: "9999px",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
