import type { Metadata } from "next";
import BackButton from "../../components/BackButton";
import LifeTable from "../../components/LifeTable";
import { KofiButton } from "../../components/KofiButton";
import { calculateFullAge } from "../../lib/common";

// Define the structure for your route params
interface Props {
  params: Promise<{ table: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Extract the birth date from params
  const awaitedParams = await params;
  const urlDateParam = awaitedParams?.table.slice(1);

  const ageData = calculateFullAge(urlDateParam.toString(), "yyyy,MM,dd");
  
  // Handle invalid date
  if (!ageData) {
    return {
      title: "Your Life in Weeks - Memento Mori",
      description: "Visualize your life in weeks with Memento Mori.",
    };
  }

  const age = ageData.years;
  const potentialYearsLeft = Math.max(80 - age, 0); // Assuming 80 as life expectancy

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
    <div className="group m-auto p-2">
      <BackButton />
      <h1 className="mb-8 text-center font-serif text-2xl leading-8 font-semibold tracking-wide text-black dark:text-purple-500">
        Memento Mori
      </h1>
      {/* <div className="grid gap-y-2 mb-4">
        <div className="grid grid-cols-52 w-208 mx-auto justify-end">
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
