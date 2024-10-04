import "../styles/globals.css";

export const metadata = {
  title: "Memento",
  description: "Time you lived",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
