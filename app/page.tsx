import Link from "next/link";
import Form from "../components/Form";

const Page = () => {
  return (
    <>
      <Form />{" "}
      <div className="my-auto text-center">
        <Link
          href="/about"
          className=" text-black dark:text-purple-500 underline text-sm"
        >
          About this Calendar
        </Link>
      </div>
    </>
  );
};

export default Page;
