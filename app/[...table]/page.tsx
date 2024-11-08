import { Metadata, ResolvingMetadata } from "next";

import { calculateFullAge } from "../../lib/common";

import LifeTable from "../../components/LifeTable";

// Define the structure for your route params
interface Props {
  params: { table: string };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Extract the birth date from params
  const awaitedParams = await params;
  const urlDateParam = awaitedParams?.table.slice(1);
  const birthDate = new Date(urlDateParam);

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
