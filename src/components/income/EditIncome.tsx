import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useRef } from "react";
import { db } from "../../db";
import CurrencyInput from "react-currency-input-field";

type EditIncomeProps = {
  activeId: number;
  onClose: Function;
};

const EditIncome = ({ activeId, onClose }: EditIncomeProps) => {
  const source = useLiveQuery(() => db.income.get({ id: activeId }));
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
        Income Source
      </label>
      <input
        onKeyDown={onEnter}
        className="rounded bg-neutral-200 p-1 text-lg focus:outline-none focus:ring"
        type="text"
        onChange={async (e) => {
          db.income.update(activeId, { label: e.target.value });
        }}
        defaultValue={source?.label}
      />
      <label className="mb-1 mt-2" htmlFor="label">
        Contributor
      </label>
      <input
        onKeyDown={onEnter}
        className="rounded bg-neutral-200 p-1 text-lg focus:outline-none focus:ring"
        type="text"
        onChange={async (e) => {
          db.income.update(activeId, { contributor: e.target.value });
        }}
        defaultValue={source?.contributor}
      />
      <label className="mb-1 mt-2" htmlFor="label">
        Amount
      </label>
      {source && (
        <CurrencyInput
          onKeyDown={onEnter}
          prefix="$"
          id="amount-input"
          name="source-amount-input"
          decimalScale={2}
          className="rounded bg-neutral-200 p-1 text-lg focus:outline-none focus:ring"
          defaultValue={source?.amount}
          onValueChange={async (value, _) => {
            if (typeof value === "string")
              db.income.update(activeId, { amount: parseFloat(value) });
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

export default EditIncome;
