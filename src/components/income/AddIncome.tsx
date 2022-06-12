import React, { useEffect, useRef, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { addIncome, IncomeSource } from "../../db";

const AddIncome = ({ onClose }: { onClose: Function }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  let focused = useRef(false);
  async function onSave() {
    await addIncome({
      label: source.label,
      contributor: source.contributor,
      amount: source.amount,
      frequency: "annually",
    });
    onClose();
  }

  function onEnter(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      onSave();
    }
  }
  const [source, setSource] = useState({
    label: "",
    contributor: "",
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
      {source && (
        <>
          <label className="my-1" htmlFor="label">
            Income Source
          </label>
          <input
            ref={inputRef}
            onKeyDown={onEnter}
            className="rounded bg-neutral-200 p-1 text-lg focus:outline-none focus:ring"
            type="text"
            onChange={(e) => {
              setSource({ ...source, label: e.target.value });
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
              setSource({ ...source, contributor: e.target.value });
            }}
            defaultValue={source?.contributor}
          />
          <label className="mb-1 mt-2" htmlFor="label">
            Amount
          </label>
          <CurrencyInput
            prefix="$"
            onKeyDown={onEnter}
            id="amount-input"
            name="income-amount-input"
            decimalScale={2}
            className="rounded bg-neutral-200 p-1 text-lg focus:outline-none focus:ring"
            defaultValue={source?.amount}
            onValueChange={async (value, _) => {
              if (typeof value === "string")
                setSource({ ...source, amount: parseFloat(value) });
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

export default AddIncome;
