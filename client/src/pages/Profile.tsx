// src/pages/Profile.tsx
import { Link } from "react-router-dom";
import { getData } from "../store";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Profile() {
  const { user } = getData();

  return (
    <div className="min-h-dvh bg-white text-neutral-900">
      {/* Header */}
      <Header />

      {/* Main */}
      <main className="mx-auto max-w-md px-6 pb-24">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-1 text-sm text-neutral-600">Account details</p>

        {/* Card */}
        <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          {/* Avatar and name */}
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-neutral-100 text-lg font-semibold">
              {user.name?.[0] ?? "T"}
            </div>
            <div>
              <p className="text-base font-semibold">
                {user.name || "Test User"}
              </p>
              <p className="text-xs text-neutral-600">Customer ID {user.id}</p>
            </div>
          </div>

          {/* Info list */}
          <dl className="mt-5 divide-y divide-neutral-200 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <dt className="text-sm text-neutral-600">Email</dt>
              <dd className="truncate text-sm font-medium text-neutral-900">
                you@example.com
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <dt className="text-sm text-neutral-600">Name</dt>
              <dd className="truncate text-sm font-medium text-neutral-900">
                {user.name || "Test User"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <dt className="text-sm text-neutral-600">Notifications</dt>
              <dd className="text-sm font-medium text-neutral-900">Enabled</dd>
            </div>
          </dl>

          {/* Actions – placeholders for now */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-500"
              title="Coming soon"
            >
              Edit profile
            </button>
            <Link
              to="/balance"
              className="rounded-xl bg-neutral-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-neutral-800 active:bg-black"
            >
              Back to balance
            </Link>
          </div>
        </section>

        {/* Shortcuts */}
        <section className="mt-8">
          <div className="mt-3 grid grid-cols-1 gap-3">
            <Link
              to="/signin"
              className="rounded-xl cursor-pointer bg-rose-400 px-4 py-3 text-white text-center text-sm font-medium hover:bg-rose-600 active:bg-rose-600"
            >
              Sign Out
            </Link>
          </div>
        </section>
      </main>

      {/* Bottom nav */}
      <Footer />
    </div>
  );
}
