import Link from "next/link";
import Form from "../components/Form";

const Page = () => {
  return (
    <>
      <Form />{" "}
      <div className=" max-w-lg mx-auto flex sm:px-4">
        <Link
          href="/about"
          className="text-sm text-black underline dark:text-purple-500 md:w-2/3 ml-auto mt-4"
        >
          About this Calendar
        </Link>
      </div>
    </>
  );
};

export default Page;
