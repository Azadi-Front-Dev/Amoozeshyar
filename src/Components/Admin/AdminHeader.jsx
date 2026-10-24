
import { FiBell, FiMenu, FiSearch } from "react-icons/fi";

export default function AdminHeader({
  title,
  userName,
  onMenuClick,
  search,
  onSearchChange,
}) {
  return (
    <header className="sticky top-0 z-30 flex h-[74px] items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 xl:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="باز کردن منو"
          onClick={onMenuClick}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
        >
          <FiMenu size={21} />
        </button>

        <div className="min-w-0">
          <p className="text-xs text-slate-400">پنل مدیریت / آموزش‌یار</p>
          <h2 className="mt-1 truncate text-lg font-bold text-slate-800">
            {title}
          </h2>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <label className="hidden h-10 w-56 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-blue-400 md:flex xl:w-72">
          <FiSearch className="shrink-0 text-slate-400" size={18} />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="جست‌وجو..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>

        <button
          type="button"
          aria-label="اعلان‌ها"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <FiBell size={19} />
        </button>

        <div className="hidden text-left sm:block">
          <p className="max-w-36 truncate text-sm font-semibold text-slate-800">
            {userName}
          </p>
          <p className="mt-1 text-xs text-slate-400">مدیر سامانه</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
          {userName?.trim()?.charAt(0) || "م"}
        </div>
      </div>
    </header>
  );
}
