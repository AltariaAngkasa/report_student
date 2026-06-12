import type { Metadata } from "next";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Lentera Kelas — Catatan Karakter Siswa",
  description:
    "Bantu guru menulis kesimpulan karakter siswa secara cepat dengan bantuan AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${fredoka.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="aurora-bg" aria-hidden="true">
          <div className="orb-3" />
        </div>
        {children}
      </body>
    </html>
  );
}
