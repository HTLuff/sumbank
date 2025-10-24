// src/pages/Transfer.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addTransfer, getData } from "../store";
import Header from "../components/Header";
import Footer from "../components/Footer";

const GBP = "GBP";
const fmtMoney = (n: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: GBP }).format(
    n
  );

/** Sanitize an editing string: allow digits and a single dot; clamp to 2 decimals; fix leading '.' */
function sanitizeDecimalInput(input: string): string {
  // allow digits and commas/dots; map comma -> dot for some keyboards
  let s = input.replace(/,/g, ".").replace(/[^\d.]/g, "");

  // keep only the first dot
  const firstDot = s.indexOf(".");
  if (firstDot !== -1) {
    s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, "");
  }

  // split into parts
  const [intRaw = "", decRaw] = s.split(".");

  // handle leading dot -> "0."
  let intPart = intRaw;
  if (intPart === "" && (decRaw !== undefined || s.startsWith("."))) {
    intPart = "0";
  }

  // if user just typed the dot, keep it (don't drop it)
  if (decRaw === "") return `${intPart}.`;

  // if there is a decimal part, clamp to 2 digits
  if (typeof decRaw === "string") {
    return `${intPart}.${decRaw.slice(0, 2)}`;
  }

  // no decimal part
  return intPart;
}

/** Convert a sanitized decimal string to integer pence */
function toPence(s: string): number {
  if (!s) return 0;
  const [intPart, decPartRaw = ""] = s.split(".");
  const cents = (decPartRaw + "00").slice(0, 2); // pad to 2
  const pounds = parseInt(intPart || "0", 10);
  const pence = parseInt(cents || "0", 10);
  const total = pounds * 100 + pence;
  return Number.isFinite(total) ? total : 0;
}

/** Format integer pence back to two-decimal editing string */
function penceToEdit(p: number): string {
  return (p / 100).toFixed(2);
}

export default function Transfer() {
  const navigate = useNavigate();
  const { user } = getData();

  // Form state
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(penceToEdit(0)); // editable string
  const [pence, setPence] = useState(0); // integer minor units

  // UI state
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Accessibility refs for focus management in the dialog
  const confirmRef = useRef<HTMLDivElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);

  // Derived validation
  const hasRecipient = to.trim().length > 0;
  const hasPositive = pence > 0;
  const hasFunds = pence <= Math.round(user.balance * 100);
  const canContinue = hasRecipient && hasPositive && hasFunds && !loading;

  const prettyAmount = useMemo(() => fmtMoney(pence / 100), [pence]);

  // Handle amount input changes with strict sanitation
  function onAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = sanitizeDecimalInput(e.target.value);
    setEditing(next);
    setPence(toPence(next));
  }

  // Normalize on blur
  function onAmountBlur() {
    setEditing(penceToEdit(pence));
  }

  // Open confirm dialog
  function onOpenConfirm(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!canContinue) return;
    setConfirmOpen(true);
  }

  // Focus the dialog when it opens
  useEffect(() => {
    if (confirmOpen) confirmRef.current?.focus();
  }, [confirmOpen]);

  // Confirm and submit transfer
  async function onConfirmTransfer() {
    try {
      setLoading(true);
      // Simulate latency
      await new Promise((r) => setTimeout(r, 400));

      // Convert pence → pounds only at the API boundary
      addTransfer({
        to: to.trim(),
        amount: pence / 100,
        note: note.trim() || undefined,
      });

      setLoading(false);
      setConfirmOpen(false);
      navigate("/balance");
    } catch (error: unknown) {
      setLoading(false);
      setConfirmOpen(false);

      if (error instanceof Error) setErr(error.message);
      else if (typeof error === "string") setErr(error);
      else setErr("Transfer failed");
      // Return focus to the button that opened the dialog
      openBtnRef.current?.focus();
    }
  }

  // Cancel confirm dialog
  function onCancelConfirm() {
    setConfirmOpen(false);
    // Return focus to the button that opened the dialog
    openBtnRef.current?.focus();
  }

  return (
    <div className="min-h-dvh bg-white text-neutral-900">
      <Header />

      <main className="mx-auto max-w-md px-6 pb-24">
        <h1 className="text-2xl font-semibold">Make a transfer</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Available {fmtMoney(user.balance)}
        </p>

        <form
          onSubmit={onOpenConfirm}
          className="mt-8 space-y-5"
          aria-describedby="form-errors"
        >
          {/* Recipient */}
          <div className="space-y-2">
            <label htmlFor="to" className="block text-sm font-medium">
              Recipient
            </label>
            <input
              id="to"
              name="to"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-neutral-400"
              placeholder="Coffee Shop"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Amount (GBP) */}
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                £
              </span>
              <input
                id="amount"
                name="amount"
                inputMode="decimal"
                autoComplete="off"
                className="w-full rounded-xl border border-neutral-200 bg-white pl-7 pr-3 py-3 text-base outline-none transition focus:border-neutral-400"
                placeholder="0.00"
                value={editing}
                onChange={onAmountChange}
                onBlur={onAmountBlur}
                aria-invalid={!hasPositive || !hasFunds}
                aria-describedby="amount-hint amount-error"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span id="amount-hint" className="text-neutral-500">
                {prettyAmount}
              </span>
              <span
                id="amount-error"
                className="text-rose-600"
                role="status"
                aria-live="polite"
              >
                {!hasPositive && editing !== "" ? "Enter a valid amount" : ""}
                {hasPositive && !hasFunds ? " Insufficient funds" : ""}
              </span>
            </div>
          </div>

          {/* Note optional */}
          <div className="space-y-2">
            <label htmlFor="note" className="block text-sm font-medium">
              Note
            </label>
            <input
              id="note"
              name="note"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-neutral-400"
              placeholder="Optional message"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Error banner */}
          {err && (
            <div
              id="form-errors"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              role="alert"
            >
              {err}
            </div>
          )}

          {/* Continue → opens confirm dialog */}
          <button
            ref={openBtnRef}
            type="submit"
            disabled={!canContinue}
            className={`w-full rounded-xl px-4 py-3 text-base font-semibold text-white transition ${
              !canContinue
                ? "bg-neutral-300"
                : "bg-neutral-900 hover:bg-neutral-800 active:bg-black"
            }`}
            aria-haspopup="dialog"
            aria-controls="confirm-dialog"
          >
            Continue
          </button>

          {/* Cancel back to balance */}
          <div className="grid grid-cols-1 gap-3">
            <Link
              to="/balance"
              className="rounded-xl bg-neutral-900 px-4 py-3 text-center font-semibold text-white hover:bg-neutral-800 active:bg-black"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>

      {/* Confirm dialog */}
      {confirmOpen && (
        <div
          role="dialog"
          id="confirm-dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
          onClick={(e) => {
            // click outside to close
            if (e.target === e.currentTarget) onCancelConfirm();
          }}
        >
          <div
            ref={confirmRef}
            tabIndex={-1}
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl outline-none"
          >
            <h2 id="confirm-title" className="text-lg font-semibold">
              Confirm transfer
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Please review the details before sending.
            </p>

            <dl className="mt-4 divide-y divide-neutral-200 rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <dt className="text-sm text-neutral-600">To</dt>
                <dd className="truncate text-sm font-medium text-neutral-900">
                  {to.trim()}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <dt className="text-sm text-neutral-600">Amount</dt>
                <dd className="text-sm font-semibold text-neutral-900">
                  {prettyAmount}
                </dd>
              </div>
              {note.trim() && (
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <dt className="text-sm text-neutral-600">Note</dt>
                  <dd className="truncate text-sm text-neutral-900">
                    {note.trim()}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onCancelConfirm}
                className="rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium hover:bg-neutral-50 active:bg-neutral-100"
              >
                Back
              </button>
              <button
                type="button"
                onClick={onConfirmTransfer}
                disabled={loading}
                className={`rounded-xl px-4 py-3 text-sm font-semibold text-white ${
                  loading
                    ? "bg-neutral-300"
                    : "bg-neutral-900 hover:bg-neutral-800 active:bg-black"
                }`}
              >
                {loading ? "Sending…" : "Send money"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
