import Link from "next/link";
import Form from "../components/Form";

const Page = () => {
  return (
    <>
      <Form />{" "}
      <div className="my-3 text-center">
        <Link
          href="/about"
          className="text-sm text-black underline dark:text-purple-500"
        >
          About this Calendar
        </Link>
      </div>
    </>
  );
};

export default Page;
