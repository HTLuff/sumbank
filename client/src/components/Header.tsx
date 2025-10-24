import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <header className="relative mx-auto flex max-w-md items-center justify-between px-6 py-4">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-400" />
        <span className="text-lg font-semibold tracking-tight">sum bank</span>
      </div>

      {/* Right section */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setOpen((s) => !s)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200"
          aria-label="Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-40 rounded-xl border border-neutral-200 bg-white shadow-md">
            <Link
              to="/balance"
              className="block w-full cursor-pointer rounded-t-xl px-4 py-2 text-left text-sm hover:bg-neutral-50 active:bg-neutral-100"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/profile"
              className="block w-full cursor-pointer px-4 py-2 text-left text-sm hover:bg-neutral-50 active:bg-neutral-100"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/signin");
              }}
              className="block w-full cursor-pointer rounded-b-xl px-4 py-2 text-left text-sm text-rose-600 hover:bg-neutral-50 active:bg-neutral-100 hover:text-rose-600"
            >
              Sign out
            </button>

            <button
              onClick={() => {
                setOpen(false);
                navigate("/admin");
              }}
              className="block w-full cursor-pointer rounded-b-xl px-4 py-2 text-left text-sm text-white bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-400"
            >
              View as Admin
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
