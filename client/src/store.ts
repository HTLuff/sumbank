// src/store.ts
import seed from "./data/seed.json";

export type Tx = {
  id: string;
  amount: number; // negative for debit, positive for credit
  to: string;
  timestamp: string; // ISO string
  note?: string;
};

export type AppData = {
  user: { id: string; name: string; balance: number };
  transactions: Tx[];
};

const KEY = "sum-bank:data";

function init() {
  if (!localStorage.getItem(KEY)) {
    localStorage.setItem(KEY, JSON.stringify(seed));
  }
}

export function getData(): AppData {
  init();
  return JSON.parse(localStorage.getItem(KEY)!) as AppData;
}

function setData(data: AppData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function addTransfer(opts: {
  to: string;
  amount: number;
  note?: string;
}) {
  const { to, amount, note } = opts;
  const data = getData();

  // debit from current user
  const debit = Math.abs(amount);
  if (debit <= 0) throw new Error("Amount must be greater than zero");
  if (debit > data.user.balance) throw new Error("Insufficient funds");

  const tx: Tx = {
    id: `t_${Date.now()}`,
    amount: -debit,
    to,
    timestamp: new Date().toISOString(),
    note,
  };

  data.user.balance = Number((data.user.balance - debit).toFixed(2));
  data.transactions = [tx, ...data.transactions];
  setData(data);

  return tx;
}
