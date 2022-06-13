import { useLiveQuery } from "dexie-react-hooks";
import { db, getTotal } from "../../db";
import { PieChart } from "react-minimal-pie-chart";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const expenses = useLiveQuery(() => db.expenses.toArray());
  const income = useLiveQuery(() => db.income.toArray());

  return (
    <div className="mx-auto flex w-[min(400px,85vw)] flex-col justify-center">
      <h2 className="py-2 text-center text-lg font-bold">Dashboard</h2>
      {/* {JSON.stringify(data)} */}
      {income && expenses && (
        <div className="mx-auto flex flex-col max-w-max">

            <div className="h-12 relative w-full bg-sky-200">
                <span className="flex absolute items-center justify-center h-full pr-2 font-bold w-full">{getTotal(expenses) > getTotal(income) ? '100' : isNaN(getTotal(expenses) / getTotal(income) * 100) ? '0' : (getTotal(expenses) / getTotal(income) * 100).toFixed(0)}%</span>
              <div className={`h-full  ${getTotal(expenses) > getTotal(income) ? 'bg-red-500' : 'bg-red-400'}`} style={{width: getTotal(expenses) > getTotal(income) ? '100%' : isNaN(getTotal(expenses) / getTotal(income) * 100) ? '0%' : `${(getTotal(expenses) / getTotal(income) * 100).toFixed(0)}%`}}>
              </div>
          </div>
          <div className="flex mt-2">
            <h3 className="px-3 text-lg font-bold text-green-600 ">
              Total Income:
            </h3>
            <span className=" px-3  text-lg font-bold text-green-600 flex items-center justify-end flex-grow">
              ${getTotal(income).toFixed(2)}
            </span>
          </div>
          <div className="flex">
            <h3 className="px-3  text-lg font-bold text-red-600">
              Total Expenses:{" "}
            </h3>
            <span className=" px-3  text-lg font-bold text-red-600 flex items-center justify-end flex-grow">
              ${getTotal(expenses).toFixed(2)}
            </span>
          </div>
          <div className="flex mt-2">
            <h3 className={`rounded-l ${getTotal(expenses) > getTotal(income) ? 'bg-red-200 text-red-900' : 'bg-green-200 text-green-800'}   py-1 px-3 text-lg font-bold `}>
              {getTotal(expenses) > getTotal(income) ? 'Overbudget' : 'Leftover'}:
            </h3>
            <span className={`rounded-r flex items-center justify-end flex-grow ${getTotal(expenses) > getTotal(income) ? 'bg-red-200 text-red-900' : 'bg-green-200 text-green-800'} py-1 px-3 text-lg font-bold`}>
              ${(getTotal(income) - getTotal(expenses)).toFixed(2)}
            </span>
          </div>



        </div>
      )}
    </div>
  );
};

export default Dashboard;
