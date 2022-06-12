import { useEffect, useLayoutEffect, useRef, useState } from "react";
import EditExpense from "../expenses/EditExpense";
import Expense from "../expenses/Expense";
import Modal from "../Modal";
import { db, Expense as E, getTotal, IncomeSource } from "../../db";
import { useLiveQuery } from "dexie-react-hooks";
import AddExpense from "../expenses/AddExpense";
import { FaFilter, FaSort } from "react-icons/fa";
import { config, useTransition, animated } from "@react-spring/web";

const Expenses = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const expenses = useLiveQuery(() => db.expenses.toArray());
  const filteredExpenses = useLiveQuery(
    () =>
      db.expenses.toArray((val) =>
        val.filter((item) => item.category === filter)
      ),
    [filter]
  );
  const categories = useLiveQuery(() =>
    db.expenses.toArray((val) => val.map((item) => item.category))
  );

  const ref = useRef<HTMLDivElement>(null);
  const transitions = useTransition(filter ? filteredExpenses : expenses, {
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
      <div className="mx-auto flex w-[min(400px,85vw)] justify-between pt-1 text-lg font-bold">
        <div>
          <span className=" px-1  text-red-600">Total:</span>
          <span className="px-1  text-red-600">
            ${expenses && getTotal(expenses).toFixed(2)}
          </span>
        </div>

        {filter && (
          <div className="mx-auto">
            <span className="px-1">{filter}:</span>
            <span className=" px-1 ">
              ${filteredExpenses && getTotal(filteredExpenses).toFixed(2)}
            </span>
          </div>
        )}
        <div className="ml-auto flex gap-x-1 px-1">
          <button className="flex h-8 w-8 items-center justify-center rounded border bg-slate-300 p-[0.3rem] text-neutral-800 ring-slate-400 hover:brightness-90 active:ring ">
            <FaSort />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex h-8 w-8 items-center justify-center rounded bg-slate-300 p-[0.3rem] text-neutral-800 ring-slate-400 hover:brightness-90 active:ring"
            >
              <FaFilter />
            </button>
            {showFilterMenu && (
              <div className="absolute top-[110%] z-10 rounded bg-slate-300 shadow-lg">
                <button
                  className="flex w-full rounded-t py-1 px-2 text-lg font-semibold hover:text-blue-700"
                  onClick={() => {
                    setFilter("");
                    setShowFilterMenu(false);
                  }}
                >
                  All
                </button>
                {categories &&
                  [...new Set(categories)]
                    .sort((a, b) => {
                      if (a.toLowerCase() > b.toLowerCase()) return 1;
                      if (a.toLowerCase() < b.toLowerCase()) return -1;
                      return 0;
                    })
                    .map((category) => (
                      <button
                        className="flex w-full rounded-t py-1 px-2 text-lg font-semibold hover:text-blue-700"
                        key={category}
                        onClick={() => {
                          setFilter(category);
                          setShowFilterMenu(false);
                        }}
                      >
                        {category}
                      </button>
                    ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {expenses && (
        <>
          <div ref={ref} className="mt-2 flex flex-col items-center">
            {transitions((styles, item) => (
              <animated.div style={styles}>
                <Expense
                  frequency={item!.frequency}
                  category={item!.category}
                  label={item!.label}
                  amount={item!.amount}
                  setActiveId={setActiveId}
                  onOpen={setIsOpen}
                  id={item!.id}
                  key={item!.id}
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
              className="mx-auto mb-1 mt-3 w-[min(400px,85vw)] select-none rounded bg-red-300 px-2 py-2 text-center font-bold drop-shadow-md transition-transform active:scale-95"
            >
              Add Expense
            </button>
          </div>
        </>
      )}

      <Modal
        title={typeof activeId === "number" ? "Edit Expense" : "Add Expense"}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        content={
          typeof activeId === "number" ? (
            <EditExpense onClose={() => setIsOpen(false)} activeId={activeId} />
          ) : (
            <AddExpense onClose={() => setIsOpen(false)} />
          )
        }
      />
    </>
  );
};

export default Expenses;
