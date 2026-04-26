import "./globals.css";
import { UserDataProvider } from "@/app/context/UserDataContext";

export const metadata = {
  title: "Ebizbro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserDataProvider>
          {children}
        </UserDataProvider>
      </body>
    </html>
  );
}