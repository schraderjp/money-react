import React, { useEffect, useRef, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { addExpense, Expense } from "../../db";

const AddExpense = ({ onClose }: { onClose: Function }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  let focused = useRef(false);
  async function onSave() {
    await addExpense({
      label: expense.label,
      category: expense.category,
      amount: expense.amount,
      frequency: "annually",
    });
    onClose();
  }

  function onEnter(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      onSave();
    }
  }
  const [expense, setExpense] = useState({
    label: "",
    category: "",
    amount: 0.0,
  });

  useEffect(() => {
    if (focused.current === true) return;
    if (inputRef.current !== null) {
      inputRef.current.focus();
      console.log("ULE Ran");
    }
    focused.current = true;
  }, []);
  return (
    <div className="flex min-w-[20rem] flex-col">
      {expense && (
        <>
          <label className="my-1" htmlFor="label">
            Expense
          </label>
          <input
            ref={inputRef}
            onKeyDown={onEnter}
            className="rounded bg-neutral-200 p-1 text-lg focus:outline-none focus:ring"
            type="text"
            onChange={(e) => {
              setExpense({ ...expense, label: e.target.value });
            }}
            defaultValue={expense?.label}
          />
          <label className="mb-1 mt-2" htmlFor="label">
            Category
          </label>
          <input
            onKeyDown={onEnter}
            className="rounded bg-neutral-200 p-1 text-lg focus:outline-none focus:ring"
            type="text"
            onChange={async (e) => {
              setExpense({ ...expense, category: e.target.value });
            }}
            defaultValue={expense?.category}
          />
          <label className="mb-1 mt-2" htmlFor="label">
            Amount
          </label>
          <CurrencyInput
            prefix="$"
            onKeyDown={onEnter}
            id="amount-input"
            name="expense-amount-input"
            decimalScale={2}
            className="rounded bg-neutral-200 p-1 text-lg focus:outline-none focus:ring"
            defaultValue={expense?.amount}
            onValueChange={async (value, _) => {
              if (typeof value === "string")
                setExpense({ ...expense, amount: parseFloat(value) });
            }}
          />
          <button
            className="mx-auto mt-3 w-full select-none rounded bg-sky-300 px-2 py-2 text-center font-bold drop-shadow-md transition-transform active:scale-95"
            onClick={onSave}
          >
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default AddExpense;
