import Dexie, { Table } from "dexie";

export type Frequency =
  | "weekly"
  | "biweekly"
  | "monthly"
  | "bimonthly"
  | "semiannually"
  | "annually"
  | "once";

export interface Expense {
  id?: number;
  label: string;
  category: string;
  frequency: Frequency;
  amount: number;
}

export interface IncomeSource {
  id?: number;
  label: string;
  contributor: string;
  frequency: Frequency;
  amount: number;
}

export class MoneyDexie extends Dexie {
  expenses!: Table<Expense>;
  income!: Table<IncomeSource>;

  constructor() {
    super("moneyDb");
    this.version(1).stores({
      expenses: "++id, label, category, frequency, amount",
      income: "++id, label, contributor, frequency, amount",
    });
  }
}

export const db = new MoneyDexie();

// Add an expense
export async function addExpense(expense: Expense) {
  try {
    const id = await db.expenses.add(expense);
    return id;
  } catch (error) {
    console.error(error);
  }
}

export async function addItem(item: Expense | IncomeSource) {
  if ("contributor" in item) {
    try {
      const id = await db.income.add(item);
      return id;
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      const id = await db.expenses.add(item);
      return id;
    } catch (error) {
      console.error(error);
    }
  }
}

// Get total of expenses or income
export function getTotal(items: IncomeSource[] | Expense[]) {
  let total = 0;
  items?.forEach((item) => {
    total += item.amount;
  });
  return total;
}

// Add an income source
export async function addIncome(source: IncomeSource) {
  try {
    const id = await db.income.add(source);
    return id;
  } catch (error) {
    console.error(error);
  }
}
