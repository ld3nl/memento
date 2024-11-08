import { Metadata, ResolvingMetadata } from "next";

import { calculateFullAge } from "../../lib/common";

import LifeTable from "../../components/LifeTable";

// Define the structure for your route params
interface Props {
  params: Promise<{ table: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Extract the birth date from params
  const awaitedParams = await params;
  const urlDateParam = awaitedParams?.table.slice(1);

  const { years, months, days } = calculateFullAge(
    urlDateParam.toString(),
    "yyyy,MM,dd"
  );

  const age = years;
  const potentialYearsLeft = Math.max(80 - years, 0); // Assuming 80 as life expectancy

  return {
    title: `Your Life in Weeks - Age ${age} - Memento Mori`,
    description: `You are ${age} years old. Visualize your life in weeks, with approximately ${potentialYearsLeft} years potentially left.`,
    openGraph: {
      title: `Your Life in Weeks - Age ${age} - Memento Mori`,
      description: `You are ${age} years old. Visualize your life in weeks, with approximately ${potentialYearsLeft} years potentially left.`,
      images: [
        "https://utfs.io/f/vfxFGWyJBql9ItIbR6Xo9agjDwkvMBmbcn5rVxs62dfLEFUC",
      ], // Keep the same image or dynamically change based on age if you have such visuals
      url: `/table/${urlDateParam.toString().replace(/,/g, "/")}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Your Life in Weeks - Age ${age} - Memento Mori`,
      description: `You are ${age} years old. Visualize your life in weeks, with approximately ${potentialYearsLeft} years potentially left.`,
      images: [
        "https://utfs.io/f/vfxFGWyJBql9ItIbR6Xo9agjDwkvMBmbcn5rVxs62dfLEFUC",
      ],
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: [
        { url: "/apple-icon.png", sizes: "57x57" },
        { url: "/apple-icon-60x60.png", sizes: "60x60" },
        { url: "/apple-icon-72x72.png", sizes: "72x72" },
        { url: "/apple-icon-76x76.png", sizes: "76x76" },
        { url: "/apple-icon-114x114.png", sizes: "114x114" },
        { url: "/apple-icon-120x120.png", sizes: "120x120" },
        { url: "/apple-icon-144x144.png", sizes: "144x144" },
        { url: "/apple-icon-152x152.png", sizes: "152x152" },
        { url: "/apple-icon-180x180.png", sizes: "180x180" },
      ],
      other: [
        {
          rel: "icon",
          url: "/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/favicon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/android-icon-36x36.png",
          sizes: "36x36",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/android-icon-48x48.png",
          sizes: "48x48",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/android-icon-72x72.png",
          sizes: "72x72",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/android-icon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/android-icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/android-icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/ms-icon-70x70.png",
          sizes: "70x70",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/ms-icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/ms-icon-150x150.png",
          sizes: "150x150",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/ms-icon-310x310.png",
          sizes: "310x310",
          type: "image/png",
        },
      ],
    },
    manifest: "/manifest.json",
  };
}

const TablePage = async ({ params }) => {
  // A small delay to simulate fetching or some async operations
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Await params before using its properties to avoid errors
  const awaitedParams = await params;
  const birthDate = new Date(awaitedParams?.table.slice(1));

  return (
    <div className="p-2 m-auto">
      <h1 className="text-3xl text-black dark:text-purple-500 text-center mb-4 font-stretch-95%">
        Memento Mori
      </h1>
      <LifeTable dob={birthDate} />
    </div>
  );
};

export default TablePage;
