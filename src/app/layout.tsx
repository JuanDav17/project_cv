import type { Metadata } from "next";
import "./globals.css";
import "./(frontend)/frontend.css";

export const metadata: Metadata = {
  title: {
    default: "MyCertify Frontend",
    template: "%s | MyCertify Frontend",
  },
  description: "Frontend UI for the MyCertify certification platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  const storedTheme = localStorage.getItem("certifypro-theme");
                  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  const theme = storedTheme ?? (prefersDark ? "dark" : "light");
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.classList.toggle("dark", theme === "dark");
                } catch (error) {
                  document.documentElement.dataset.theme = "light";
                }
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
