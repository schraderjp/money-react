import { useEffect, useLayoutEffect, useRef, useState } from "react";
import EditExpense from "../expenses/EditExpense";
import Expense from "../expenses/Expense";
import Modal from "../Modal";
import { db, Expense as E, getTotal, IncomeSource } from "../../db";
import { useLiveQuery } from "dexie-react-hooks";
import AddExpense from "../expenses/AddExpense";
import {
  FaCheck,
  FaFilter,
  FaPlus,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa";
import { config, useTransition, animated } from "@react-spring/web";

const Expenses = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const expenses = useLiveQuery(() => {
    if (sort === "asc") return db.expenses.toCollection().sortBy("amount");
    if (sort === "desc")
      return db.expenses.toCollection().reverse().sortBy("amount");
    return db.expenses.toArray();
  }, [sort]);
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
      <div className="mx-auto flex w-[min(400px,85vw)] items-center justify-between pt-1 text-lg font-bold">
        <div className="flex w-full items-center justify-between">
          <span className="mr-auto w-full flex-auto px-1 text-red-600">
            $
            {filter
              ? filteredExpenses && getTotal(filteredExpenses).toFixed(2)
              : expenses && getTotal(expenses).toFixed(2)}
          </span>

          <div className="mx-auto flex w-full flex-auto items-center justify-center gap-x-1 px-1">
            <button
              onClick={() =>
                sort === "" || sort === "desc"
                  ? setSort("asc")
                  : setSort("desc")
              }
              className="flex h-8 w-8 items-center justify-center rounded border bg-slate-300 p-[0.3rem] text-neutral-800 ring-slate-400 hover:brightness-90 active:ring "
            >
              {sort === "asc" ? (
                <FaSortAmountUp />
              ) : sort === "desc" ? (
                <FaSortAmountDown />
              ) : (
                <FaSort />
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`flex h-8 w-8 items-center justify-center rounded ${
                  filter !== ""
                    ? "bg-slate-400 ring-slate-500"
                    : "bg-slate-300 ring-slate-400"
                }  p-[0.3rem] text-neutral-800  hover:brightness-90 active:ring`}
              >
                <FaFilter />
              </button>
              {showFilterMenu && (
                <div className="absolute top-[110%] z-10 rounded bg-slate-300 shadow-lg">
                  <button
                    className={`flex w-full items-center rounded-t py-1 px-2 text-lg font-semibold hover:text-blue-700`}
                    onClick={() => {
                      setFilter("");
                      setShowFilterMenu(false);
                    }}
                  >
                    <span
                      className={`flex px-1 ${
                        filter === "" ? "" : "opacity-0"
                      }`}
                    >
                      <FaCheck size={16} />
                    </span>
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
                          className="flex w-full items-center rounded-t py-1 px-2 text-lg font-semibold hover:text-blue-700"
                          key={category}
                          onClick={() => {
                            setFilter(category);
                            setShowFilterMenu(false);
                          }}
                        >
                          <span
                            className={`flex px-1 ${
                              filter === category ? "" : "opacity-0"
                            }`}
                          >
                            <FaCheck size={16} />
                          </span>
                          {category}
                        </button>
                      ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full flex-auto items-end justify-center">
            <button
              onClick={async () => {
                setActiveId(null);
                setIsOpen(true);
              }}
              className="ml-auto select-none rounded-full bg-red-300 px-2 py-2 text-center font-bold drop-shadow-md transition-transform active:scale-95"
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </div>

      {expenses && (
        <>
          <div
            ref={ref}
            className="mt-2 flex flex-col items-center overflow-x-hidden overflow-y-scroll"
          >
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
