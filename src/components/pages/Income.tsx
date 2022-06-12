import { config, useTransition, animated } from "@react-spring/web";
import { useLiveQuery } from "dexie-react-hooks";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa";
import { db, getTotal } from "../../db";
import AddIncome from "../income/AddIncome";
import EditIncome from "../income/EditIncome";
import IncomeSource from "../income/IncomeSource";
import Modal from "../Modal";

const Income = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const income = useLiveQuery(() => db.income.toArray());
  const transitions = useTransition(income, {
    immediate: !ref.current,
    from: {
      opacity: 0,
      height: "0",
      marginTop: "0",
      marginBottom: "0",
    },
    enter: {
      opacity: 1,
      height: "4rem",
      marginTop: "0.25rem",
      marginBottom: "0.5rem",
    },
    leave: { opacity: 0, height: "0", marginTop: "0", marginBottom: "0" },
    keys: function (item) {
      return item?.id as number;
    },
    delay: 50,
    config: config.default,
  });

  return (
    <>
      <div className="mx-auto flex w-[min(400px,85vw)] pt-1 text-lg font-bold">
        <h2 className="px-1 text-green-600">Total:</h2>
        <span className="px-1 text-green-600">
          ${income && getTotal(income).toFixed(2)}
        </span>
        <div className="ml-auto flex gap-x-1 px-1">
          <button className="flex h-8 w-8 items-center justify-center rounded border bg-neutral-300 p-[0.3rem] text-neutral-800 ring-neutral-400 hover:brightness-90 active:ring ">
            <FaSort />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded bg-neutral-300 p-[0.3rem] text-neutral-800 ring-neutral-400 hover:brightness-90 active:ring">
            <FaFilter />
          </button>
        </div>
      </div>

      {income && (
        <>
          <div ref={ref} className="mt-2 flex flex-col items-center">
            {transitions((styles, item) => (
              <animated.div style={styles}>
                <IncomeSource
                  frequency={item!.frequency}
                  contributor={item!.contributor}
                  label={item!.label}
                  amount={item!.amount}
                  setActiveId={setActiveId}
                  onOpen={setIsOpen}
                  id={item!.id}
                />
              </animated.div>
            ))}
          </div>
          <div className="flex w-full justify-center">
            <button
              onClick={async () => {
                setActiveId(null);
                setIsOpen(true);
              }}
              className="mx-auto mb-1 mt-3 w-[min(400px,85vw)] select-none rounded bg-green-300 px-2 py-2 text-center font-bold drop-shadow-md transition-transform active:scale-95"
            >
              Add Income Source
            </button>
          </div>
        </>
      )}
      <Modal
        title={
          typeof activeId === "number"
            ? "Edit Income Source"
            : "Add Income Source"
        }
        open={isOpen}
        onClose={() => setIsOpen(false)}
        content={
          typeof activeId === "number" ? (
            <EditIncome onClose={() => setIsOpen(false)} activeId={activeId} />
          ) : (
            <AddIncome onClose={() => setIsOpen(false)} />
          )
        }
      />
    </>
  );
};

export default Income;
