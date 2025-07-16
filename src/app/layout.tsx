// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Posfin Todo List App",
  description: "A simple todo application built with Next.js 15 and TypeScript",
  icons: {
    icon: "/images/icon-posfin.jpg",
  },
};
  
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
