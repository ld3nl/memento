import "../styles/globals.css";

export const metadata = {
  title: "Memento Mori Online Table Generator - Calculate Your Life in Weeks",
  description:
    "Discover how many weeks you've lived with our Memento Mori Online Table Generator. Input your DOB to visualize your life across 10 decades, based on an 80-year lifespan",
  openGraph: {
    title: "Memento Mori Online Table Generator - Calculate Your Life in Weeks",
    description:
      "Discover how many weeks you've lived with our Memento Mori Online Table Generator. Input your DOB to visualize your life across 10 decades, based on an 80-year lifespan",
    images: [
      "https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3",
    ], // Optional, add an image for social sharing
  },
  // Optional Twitter card tags
  twitter: {
    card: "summary_large_image",
    title: "Memento Mori Online Table Generator - Calculate Your Life in Weeks",
    description:
      "Discover how many weeks you've lived with our Memento Mori Online Table Generator. Input your DOB to visualize your life across 10 decades, based on an 80-year lifespan",
    images: [
      "https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3",
    ],
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-black flex min-h-screen">
        {children}
      </body>
    </html>
  );
}
