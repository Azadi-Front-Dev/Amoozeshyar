import { Link } from "react-router-dom";
import {
  FiActivity,
  FiArrowUpLeft,
  FiBookOpen,
  FiCalendar,
  FiClipboard,
  FiGrid,
  FiShield,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

const stats = [
  {
    label: "دانشجویان",
    description: "تعداد کل دانشجویان ثبت‌شده",
    icon: FiUsers,
    iconClass: "bg-blue-50 text-blue-700",
  },
  {
    label: "استادان",
    description: "تعداد کل استادان سامانه",
    icon: FiUserCheck,
    iconClass: "bg-indigo-50 text-indigo-700",
  },
  {
    label: "دروس فعال",
    description: "دروس قابل ارائه",
    icon: FiBookOpen,
    iconClass: "bg-cyan-50 text-cyan-700",
  },
  {
    label: "نیمسال جاری",
    description: "وضعیت نیمسال تحصیلی",
    icon: FiCalendar,
    iconClass: "bg-violet-50 text-violet-700",
  },
];

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function StatCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconClass}`}
        >
          <Icon size={23} />
        </div>

        <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
          آمار سامانه
        </span>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">{item.label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800">
          —
        </p>
        <p className="mt-2 text-xs leading-6 text-slate-400">
          {item.description}
        </p>
      </div>
    </div>
  );
}

const quickLinks = [
  {
    path: "/admin/users",
    title: "مدیریت کاربران",
    description: "حساب‌ها و نقش‌های سامانه",
    icon: FiUsers,
    color: "bg-blue-50 text-blue-700",
  },
  {
    path: "/admin/courses",
    title: "مدیریت دروس",
    description: "درس‌ها و اطلاعات آموزشی",
    icon: FiBookOpen,
    color: "bg-violet-50 text-violet-700",
  },
  {
    path: "/admin/semesters",
    title: "نیمسال تحصیلی",
    description: "سال تحصیلی و نیمسال‌ها",
    icon: FiCalendar,
    color: "bg-cyan-50 text-cyan-700",
  },
  {
    path: "/admin/reports",
    title: "گزارش‌ها",
    description: "مشاهده گزارش‌های سامانه",
    icon: FiTrendingUp,
    color: "bg-emerald-50 text-emerald-700",
  },
];

export default function AdminDashboard() {
  const user = getStoredUser();

  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ");

  const displayName = fullName || user?.username || "مدیر سامانه";

  return (
    <div className="space-y-8">
      {/* کارت خوشامدگویی */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-slate-950 via-blue-950 to-blue-800 p-6 text-white shadow-lg shadow-blue-950/10 sm:p-8 xl:p-9">
        <div className="pointer-events-none absolute -left-12 -top-24 h-64 w-64 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -left-1 top-12 h-40 w-40 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-blue-100">
              <FiActivity size={15} />
              نمای کلی سامانه
            </div>

            <h1 className="text-2xl font-extrabold leading-relaxed sm:text-3xl">
              خوش آمدید، {displayName}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-7 text-blue-100/80 sm:text-base">
              از این بخش می‌توانید ساختار آموزشی، کاربران و فعالیت‌های سامانه را
              مدیریت کنید.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <FiShield size={23} />
            </div>

            <div>
              <p className="text-sm font-bold">پنل مدیریت</p>
              <p className="mt-1 text-xs text-blue-100/80">
                دسترسی مدیریتی سامانه
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* آمار سامانه */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">
              وضعیت سامانه
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              آمار پس از اتصال به سرویس‌های بک‌اند نمایش داده می‌شود.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            اتصال آمار در مرحله بعد
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </div>
      </section>

      {/* دسترسی سریع */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-slate-800">دسترسی سریع</h2>
          <p className="mt-1 text-sm text-slate-500">
            برای ورود به بخش موردنظر، یکی از گزینه‌ها را انتخاب کنید.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-right shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={23} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>

                <FiArrowUpLeft
                  className="shrink-0 text-slate-300 transition group-hover:text-blue-700"
                  size={19}
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* فعالیت‌ها و وضعیت پیاده‌سازی */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <FiActivity size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">نمای کلی فعالیت‌ها</h2>
              <p className="mt-1 text-xs text-slate-500">
                آماده اتصال به گزارش فعالیت‌های مدیریتی
              </p>
            </div>
          </div>

          <div className="mt-6 flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
            <FiClipboard size={27} className="text-slate-400" />

            <p className="mt-3 text-sm font-semibold text-slate-600">
              هنوز داده‌ای بارگذاری نشده است
            </p>

            <p className="mt-2 max-w-md text-xs leading-6 text-slate-400">
              پس از تعریف API گزارش‌ها، رویدادها و فعالیت‌های ثبت‌شده در این
              قسمت نمایش داده خواهند شد.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <FiGrid size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">وضعیت سامانه</h2>
              <p className="mt-1 text-xs text-slate-500">
                آمادگی برای تکمیل اتصال‌ها
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {[
              "پوسته و چیدمان پنل",
              "منوی مدیریتی واکنش‌گرا",
              "اتصال آمار به API",
              "مدیریت داده‌های آموزشی",
            ].map((label, index) => (
              <div key={label} className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    index < 2
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {index < 2 ? "✓" : index + 1}
                </span>

                <span className="text-sm text-slate-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
