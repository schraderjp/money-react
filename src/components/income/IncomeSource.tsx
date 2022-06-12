import React, { useState } from "react";
import { type Frequency } from "../../db";
import { FaEdit, FaTrash } from "react-icons/fa";
import { db } from "../../db";

const IncomeSource = ({
  label,
  amount,
  contributor,
  frequency,
  setActiveId,
  onOpen,
  id,
}: {
  label: string;
  amount: number;
  contributor: string;
  frequency: Frequency;
  setActiveId: Function;
  onOpen: Function;
  id: number | undefined;
}) => {
  return (
    <>
      <div className="my-1 grid w-[min(400px,85vw)] grid-cols-2 grid-rows-2 items-center gap-y-1 rounded-lg bg-green-100 px-2 py-1 drop-shadow-md">
        <div className="mx-1 flex items-center text-lg font-semibold text-neutral-700">
          {label}
        </div>
        <div className="mx-1 flex justify-end">
          <div className="rounded text-xl font-semibold text-green-700">
            ${amount.toFixed(2)}
          </div>
        </div>
        <div className="mx-1 flex items-center justify-start text-sm text-sky-900">
          {contributor}
        </div>
        <div className="mx-1 flex items-center justify-end">
          <button
            onClick={() => {
              setActiveId(id);
              onOpen(true);
            }}
            className="mx-1 h-max rounded bg-blue-200 p-[0.3rem] text-blue-900 ring-blue-400 active:ring "
          >
            <FaEdit size={18} />
          </button>
          <button
            onClick={() => {
              if (typeof id === "number") {
                db.income.delete(id);
              }
            }}
            className="ml-1 h-max rounded bg-red-200 p-[0.3rem] text-red-900 ring-red-400 active:ring"
          >
            <FaTrash size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

export default IncomeSource;
