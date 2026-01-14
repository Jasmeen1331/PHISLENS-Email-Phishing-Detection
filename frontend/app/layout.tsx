import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "PHISHLENS",
  description: "Explainable AI for phishing email detection",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* background blobs */}
        <div className="blobs">
          <div className="blob cyan" />
          <div className="blob purple" />
          <div className="blob blue" />
        </div>

        <Navbar />
        {children}
      </body>
    </html>
  );
}
