import "./globals.css";
import Navbar from "./components/Navbar";
import BackgroundFX from "./components/BackgroundFX";

export const metadata = { title: "PHISHLENS" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BackgroundFX />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
