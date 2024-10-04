import LifeTable from "../../components/LifeTable";

const TablePage = async ({ params }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const birthDate = new Date(params?.table.slice(1));
  return (
    <div>
      <LifeTable dob={birthDate} />
    </div>
  );
};

export default TablePage;
