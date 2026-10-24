
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowRightOnRectangle,
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineCalendarDays,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCreditCard,
  HiOutlineUserCircle,
} from "react-icons/hi2";

const menuItems = [
  {
    label: "داشبورد",
    path: "/student/dashboard",
    icon: HiOutlineHome,
  },
  {
    label: "انتخاب واحد",
    path: "/student/enrollment",
    icon: HiOutlineBookOpen,
  },
  {
    label: "برنامه هفتگی",
    path: "/student/schedule",
    icon: HiOutlineCalendarDays,
  },
  {
    label: "نمرات و کارنامه",
    path: "/student/grades",
    icon: HiOutlineClipboardDocumentCheck,
  },
  {
    label: "امور مالی",
    path: "/student/finance",
    icon: HiOutlineCreditCard,
  },
  {
    label: "اطلاعات دانشجو",
    path: "/student/profile",
    icon: HiOutlineUserCircle,
  },
];

export default function StudentLayout() {
  const navigate = useNavigate();

  const student = {
    first_name: "دانشجو",
    last_name: "",
    student_number: "",
  };

  const studentName =
    `${student.first_name || ""} ${student.last_name || ""}`.trim() ||
    "دانشجو";

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/Login", { replace: true });
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <HiOutlineAcademicCap size={27} />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-black text-slate-900 sm:text-xl">
                سامانه آموزشیار
              </h1>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                پنل مدیریت امور دانشجویی
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold text-slate-800">
                {studentName}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {student.student_number
                  ? `شماره دانشجویی: ${student.student_number}`
                  : "پنل دانشجو"}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-700">
              {student.first_name?.[0] || "د"}
            </div>

            <button
              type="button"
              onClick={logout}
              title="خروج از حساب"
              aria-label="خروج از حساب"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <HiOutlineArrowRightOnRectangle size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 pt-5 sm:px-6 lg:px-8">
        <nav
          aria-label="منوی اصلی دانشجو"
          className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
        >
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    [
                      "flex shrink-0 items-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition sm:px-5",
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                        : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700",
                    ].join(" ")
                  }
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>

      <main className="mx-auto min-h-[calc(100vh-250px)] max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-slate-500 sm:flex-row sm:px-6 sm:text-right lg:px-8">
          <p>سامانه آموزشیار | پنل دانشجویی</p>
          <p>تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
    </div>
  );
}
