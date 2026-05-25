import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frontend",
};

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
