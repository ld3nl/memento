import { Metadata } from "next";

import { calculateFullAge } from "../../lib/common";

import LifeTable from "../../components/LifeTable";

// Define the structure for your route params
interface Props {
  params: Promise<{ table: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Extract the birth date from params
  const awaitedParams = await params;
  const urlDateParam = awaitedParams?.table.slice(1);

  const { years } = calculateFullAge(urlDateParam.toString(), "yyyy,MM,dd");

  const age = years;
  const potentialYearsLeft = Math.max(80 - years, 0); // Assuming 80 as life expectancy

  return {
    title: `Your Life in Weeks - Age ${age} - Memento Mori`,
    description: `You are ${age} years old. Visualize your life in weeks, with approximately ${potentialYearsLeft} years potentially left.`,
    openGraph: {
      title: `Your Life in Weeks - Age ${age} - Memento Mori`,
      description: `You are ${age} years old. Visualize your life in weeks, with approximately ${potentialYearsLeft} years potentially left.`,

      url: `/table/${urlDateParam.toString().replace(/,/g, "/")}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Your Life in Weeks - Age ${age} - Memento Mori`,
      description: `You are ${age} years old. Visualize your life in weeks, with approximately ${potentialYearsLeft} years potentially left.`,
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
    <div className="group p-2 m-auto">
      <h1 className="font-serif leading-8 font-semibold tracking-wide text-2xl mb-8 text-black dark:text-purple-500 text-center">
        Memento Mori
      </h1>
      {/* <div className="grid gap-y-2 mb-4">
        <div className="grid grid-cols-52 w-[52rem] mx-auto justify-end">
          <div className="col-end-53 col-span-1">
            <input
              type="checkbox"
              id="customCheckbox"
              className="peer hidden"
            />
            <label
              htmlFor="customCheckbox"
              className="ms-auto relative cursor-pointer flex size-2 border border-black dark:border-purple-500 dark:peer-checked:bg-white dark:peer-checked:border-white peer-checked:bg-black peer-checked:border-black"
            ></label>
          </div>
        </div>
      </div> */}

      <LifeTable dob={birthDate} />
    </div>
  );
};

export default TablePage;
