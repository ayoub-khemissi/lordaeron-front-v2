import { Fira_Code as FontMono, Lexend } from "next/font/google";
import localFont from "next/font/local";

export const fontSans = Lexend({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontHeading = localFont({
  src: [
    {
      path: "../public/fonts/friz-quadrata-regular-os-5870333951e7c.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/friz-quadrata-bold-italic-os-5870341205e0f.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-heading",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
