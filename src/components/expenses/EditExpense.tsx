import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useRef } from "react";
import { db } from "../../db";
import CurrencyInput from "react-currency-input-field";

type EditExpenseProps = {
  activeId: number;
  onClose: Function;
};

const EditExpense = ({ activeId, onClose }: EditExpenseProps) => {
  const expense = useLiveQuery(() => db.expenses.get({ id: activeId }));
  console.log(expense);
  const inputRef = useRef<HTMLInputElement>(null);
  let focused = useRef(false);

  function onEnter(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      onClose();
    }
  }

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
      <label className="my-1" htmlFor="label">
        Expense
      </label>
      <input
        onKeyDown={onEnter}
        className="rounded bg-neutral-200 p-1 text-lg focus:outline-none focus:ring"
        type="text"
        onChange={async (e) => {
          db.expenses.update(activeId, { label: e.target.value });
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
          db.expenses.update(activeId, { category: e.target.value });
        }}
        defaultValue={expense?.category}
      />
      <label className="mb-1 mt-2" htmlFor="label">
        Amount
      </label>
      {expense && (
        <CurrencyInput
          onKeyDown={onEnter}
          prefix="$"
          id="amount-input"
          name="expense-amount-input"
          decimalScale={2}
          className="rounded bg-neutral-200 p-1 text-lg focus:outline-none focus:ring"
          defaultValue={expense?.amount}
          onValueChange={async (value, _) => {
            if (typeof value === "string")
              db.expenses.update(activeId, { amount: parseFloat(value) });
          }}
        />
      )}
      <button
        className="mx-auto mt-3 w-full select-none rounded bg-sky-300 px-2 py-2 text-center font-bold drop-shadow-md transition-transform active:scale-95"
        onClick={() => onClose()}
      >
        Done
      </button>
    </div>
  );
};

export default EditExpense;
