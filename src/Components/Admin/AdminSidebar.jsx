import { NavLink } from "react-router-dom";
import {
  FiActivity,
  FiBookOpen,
  FiCalendar,
  FiClipboard,
  FiGrid,
  FiHome,
  FiLayers,
  FiLogOut,
  FiSettings,
  FiShield,
  FiUsers,
  FiUserCheck,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";

const menuGroups = [
  {
    title: "داشبورد",
    items: [{ label: "نمای کلی", path: "/admin/dashboard", icon: FiHome }],
  },
  {
    title: "مدیریت کاربران",
    items: [
      { label: "همه کاربران", path: "/admin/users", icon: FiUsers },
      { label: "دانشجویان", path: "/admin/students", icon: FiUserCheck },
      { label: "استادان", path: "/admin/professors", icon: FiBookOpen },
      { label: "کارکنان", path: "/admin/staff", icon: FiShield },
    ],
  },
  {
    title: "ساختار آموزشی",
    items: [
      {
        label: "دانشکده‌ها و گروه‌ها",
        path: "/admin/departments",
        icon: FiLayers,
      },
      { label: "انتخاب واحد", path: "/admin/enrollments", icon: FiClipboard },
      {
        label: "زمان‌بندی انتخاب واحد",
        path: "/admin/registrationwindows",
        icon: FiCalendar,
      },
      { label: "دروس", path: "/admin/courses", icon: FiBookOpen },
      {
        label: "کلاس‌ها و برنامه هفتگی",
        path: "/admin/classes",
        icon: FiCalendar,
      },
      { label: "نیمسال‌های تحصیلی", path: "/admin/semesters", icon: FiGrid },

      {
        label: "دروس ارائه‌شده",
        path: "/admin/offeringcourses",
        icon: FiBookOpen,
      },
    ],
  },
  {
    title: "سامانه",
    items: [
      { label: "گزارش‌ها", path: "/admin/reports", icon: FiTrendingUp },
      { label: "فعالیت‌ها", path: "/admin/activity", icon: FiActivity },
      { label: "تنظیمات", path: "/admin/settings", icon: FiSettings },
    ],
  },
];

export default function AdminSidebar({ open, onClose, onLogout }) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="بستن منو"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-[270px] flex-col border-l border-slate-200 bg-white transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-[82px] items-center gap-3 border-b border-slate-100 px-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white">
            <FiBookOpen size={25} />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="font-extrabold text-slate-900">آموزش‌یار</h1>
            <p className="mt-1 text-xs text-slate-500">سامانه مدیریت آموزش</p>
          </div>

          <button
            type="button"
            aria-label="بستن منو"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="mx-4 mt-5 flex items-center gap-3 rounded-2xl bg-blue-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 font-bold text-white">
            م
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">مدیر سامانه</p>
            <p className="mt-1 text-xs text-blue-700">پنل مدیریت</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {menuGroups.map((group) => (
            <div key={group.title} className="mb-5">
              <p className="mb-2 px-3 text-[11px] font-bold text-slate-400">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/admin/dashboard"}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                          isActive
                            ? "bg-blue-700 font-semibold text-white shadow-md shadow-blue-700/15"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`
                      }
                    >
                      <Icon size={19} className="shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-rose-600 hover:bg-rose-50"
          >
            <FiLogOut size={19} />
            خروج از حساب کاربری
          </button>
        </div>
      </aside>
    </>
  );
}
