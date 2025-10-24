import { Link } from "react-router-dom";
import { getData } from "../store";
import Header from "../components/Header";
import Footer from "../components/Footer";

const fmtMoney = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "GBP",
  }).format(n);

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export default function Balance() {
  const { user, transactions } = getData();

  const txs = [...transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="min-h-dvh bg-white text-neutral-900">
      {/* Header */}
      <Header />

      <main className="mx-auto max-w-md px-6 pb-24">
        <p className="text-sm text-neutral-600">Hello</p>
        <h1 className="text-2xl font-semibold">{user.name}</h1>

        <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-600">Current balance</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight">
            {fmtMoney(user.balance)}
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              to="/transfer"
              className="flex-1 rounded-xl bg-neutral-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-neutral-800 active:bg-black"
            >
              Make a transfer
            </Link>
            <Link
              to="/profile"
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-center text-sm font-medium hover:bg-neutral-50 active:bg-neutral-100"
            >
              Profile
            </Link>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-semibold">Recent transfers</h2>
          <ul className="mt-3 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white shadow-sm">
            {txs.map((t) => {
              const isCredit = t.amount > 0;
              return (
                <li
                  key={t.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.to}</p>
                    <p className="mt-0.5 text-xs text-neutral-600">
                      {fmtDate(t.timestamp)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        isCredit ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isCredit ? "+" : ""}
                      {fmtMoney(t.amount)}
                    </p>
                  </div>
                </li>
              );
            })}
            {txs.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-neutral-600">
                No transfers yet
              </li>
            )}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
