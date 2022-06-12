import { useLiveQuery } from "dexie-react-hooks";
import { db, getTotal } from "../../db";
import IncomeSource from "../income/IncomeSource";

const Dashboard = () => {
  const expenses = useLiveQuery(() => db.expenses.toArray());
  const income = useLiveQuery(() => db.income.toArray());

  return (
    <div className="mx-auto flex w-[min(400px,85vw)] flex-col justify-center">
      <h2 className="py-2 text-center text-lg font-bold">Dashboard</h2>
      {income && expenses && (
        <div className="mx-auto grid grid-cols-2 gap-y-3">
          <h3 className="px-3 text-lg font-bold text-green-800">
            Total Income:
          </h3>
          <span className="max-w-max px-3  text-lg font-bold text-green-800">
            ${getTotal(income).toFixed(2)}
          </span>
          <h3 className="px-3  text-lg font-bold text-red-800">
            Total Expenses:{" "}
          </h3>
          <span className="max-w-max px-3  text-lg font-bold text-red-800">
            ${getTotal(expenses).toFixed(2)}
          </span>
          <h3 className="rounded-l bg-sky-200 py-1 px-3 text-lg font-bold ">
            Leftover:
          </h3>
          <span className="max-w-max rounded-r bg-sky-200 py-1 px-3 text-lg font-bold">
            ${(getTotal(income) - getTotal(expenses)).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
