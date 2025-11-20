import {
  Noto_Sans_Bengali,
  Plus_Jakarta_Sans,
  Poppins,
  Urbanist,
  Ubuntu,
} from "next/font/google";

export const notosans = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto",
});

export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export const ubuntuLight = Ubuntu({
  subsets: ["latin"],
  weight: "300",
  style: "normal",
});

export const ubuntuRegular = Ubuntu({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
});

export const ubuntuMedium = Ubuntu({
  subsets: ["latin"],
  weight: "500",
  style: "normal",
});

export const ubuntuBold = Ubuntu({
  subsets: ["latin"],
  weight: "700",
  style: "normal",
});

export const ubuntuLightItalic = Ubuntu({
  subsets: ["latin"],
  weight: "300",
  style: "italic",
});

export const ubuntuRegularItalic = Ubuntu({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const ubuntuMediumItalic = Ubuntu({
  subsets: ["latin"],
  weight: "500",
  style: "italic",
});

export const ubuntuBoldItalic = Ubuntu({
  subsets: ["latin"],
  weight: "700",
  style: "italic",
});
