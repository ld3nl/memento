import Link from "next/link";
import Form from "../components/Form";

const Page = () => {
  return (
    <>
      <Form />{" "}
      <div className="mx-auto flex max-w-sm sm:px-4 md:max-w-lg">
        <Link
          href="/about"
          className="mt-4 text-sm text-black underline md:ml-auto md:w-2/3 dark:text-purple-500"
        >
          About this Calendar
        </Link>
      </div>
    </>
  );
};

export default Page;
