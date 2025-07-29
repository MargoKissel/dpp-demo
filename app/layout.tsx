// src/app/layout.tsx
import "./globals.css"; // обязательно подключаем Tailwind
import { ReactNode } from "react";

export const metadata = {
  title: "Digitaler Produktpass",
  description: "MVP eines Digital Product Passport",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-gray-50 text-gray-800 min-h-screen flex justify-center p-4">
        {children}
      </body>
    </html>
  );
}
