import Link from "next/link";
import Form from "../components/Form";

const Page = () => {
  return (
    <>
      <Form />{" "}
      <div className="mx-auto flex max-w-lg sm:px-4">
        <Link
          href="/about"
          className="mt-4 ml-auto text-sm text-black underline md:w-2/3 dark:text-purple-500"
        >
          About this Calendar
        </Link>
      </div>
    </>
  );
};

export default Page;
