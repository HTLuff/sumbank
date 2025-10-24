import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const path = location.pathname;

  const linkClasses = (target: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      path === target
        ? "text-neutral-900 bg-neutral-100"
        : "text-neutral-700 hover:bg-neutral-100"
    }`;

  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-md border-t border-neutral-200 bg-white/95 backdrop-blur">
      <div className="flex items-stretch justify-around px-4 py-2.5">
        <Link to="/balance" className={linkClasses("/balance")}>
          Home
        </Link>
        <Link to="/transfer" className={linkClasses("/transfer")}>
          Send Money
        </Link>
        <Link to="/profile" className={linkClasses("/profile")}>
          Profile
        </Link>
      </div>
    </nav>
  );
}
