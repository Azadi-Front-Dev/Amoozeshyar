import { useMemo, useState } from "react";
import {
  FiActivity,
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDownload,
  FiEye,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUser,
  FiX,
} from "react-icons/fi";

const INITIAL_ACTIVITIES = [
  {
    id: 1,
    user: "علی رضایی",
    username: "admin",
    role: "مدیر سیستم",
    action: "ویرایش",
    module: "مدیریت کاربران",
    description: "وضعیت حساب کاربری سارا احمدی تغییر کرد.",
    entity: "کاربر",
    entityId: "USR-1008",
    result: "موفق",
    date: "۱۴۰۵/۰۷/۲۹",
    time: "۱۰:۴۲:۱۸",
    ip: "192.168.1.12",
    details: "وضعیت حساب از «فعال» به «غیرفعال» تغییر داده شد.",
  },
  {
    id: 2,
    user: "مریم کریمی",
    username: "edu.support",
    role: "پشتیبان آموزش",
    action: "تأیید",
    module: "انتخاب واحد",
    description: "درخواست انتخاب واحد آرمان محمدی تأیید شد.",
    entity: "ثبت‌نام",
    entityId: "ENR-2041",
    result: "موفق",
    date: "۱۴۰۵/۰۷/۲۹",
    time: "۱۰:31:05",
    ip: "192.168.1.25",
    details: "درخواست ثبت‌نام درس ساختمان داده‌ها برای نیمسال اول ۱۴۰۵–۱۴۰۶ تأیید شد.",
  },
  {
    id: 3,
    user: "محمد احمدی",
    username: "prof.mahmadi",
    role: "استاد",
    action: "ثبت",
    module: "نمرات",
    description: "نمرات درس پایگاه داده ثبت شد.",
    entity: "نمره",
    entityId: "GRD-0872",
    result: "موفق",
    date: "۱۴۰۵/۰۷/۲۹",
    time: "۰۹:۵۸:44",
    ip: "192.168.1.37",
    details: "نمرات ۲۸ دانشجو برای گروه ۲ درس پایگاه داده ثبت شد.",
  },
  {
    id: 4,
    user: "کاربر ناشناس",
    username: "unknown",
    role: "ناشناس",
    action: "ورود",
    module: "احراز هویت",
    description: "تلاش برای ورود ناموفق بود.",
    entity: "حساب کاربری",
    entityId: "—",
    result: "ناموفق",
    date: "۱۴۰۵/۰۷/۲۹",
    time: "۰۹:۴۱:12",
    ip: "10.0.0.45",
    details: "اطلاعات ورود معتبر نبود. این رویداد صرفاً نمونه نمایشی است.",
  },
  {
    id: 5,
    user: "علی رضایی",
    username: "admin",
    role: "مدیر سیستم",
    action: "ایجاد",
    module: "مدیریت دروس",
    description: "درس مهندسی نرم‌افزار ایجاد شد.",
    entity: "درس",
    entityId: "CS410",
    result: "موفق",
    date: "۱۴۰۵/۰۷/۲۸",
    time: "۱۶:۱۲:03",
    ip: "192.168.1.12",
    details: "درس جدید با کد CS410 و تعداد ۳ واحد به فهرست دروس اضافه شد.",
  },
  {
    id: 6,
    user: "مریم کریمی",
    username: "edu.support",
    role: "پشتیبان آموزش",
    action: "ویرایش",
    module: "کلاس‌ها و برنامه هفتگی",
    description: "ظرفیت گروه درس مدارهای الکتریکی تغییر کرد.",
    entity: "گروه درسی",
    entityId: "SEC-301",
    result: "موفق",
    date: "۱۴۰۵/۰۷/۲۸",
    time: "۱۴:۳۷:51",
    ip: "192.168.1.25",
    details: "ظرفیت گروه از ۳۰ نفر به ۳۵ نفر افزایش یافت.",
  },
  {
    id: 7,
    user: "نیما حسینی",
    username: "staff.nima",
    role: "کارمند",
    action: "مشاهده",
    module: "گزارش‌ها",
    description: "گزارش انتخاب واحد مشاهده شد.",
    entity: "گزارش",
    entityId: "RPT-012",
    result: "موفق",
    date: "۱۴۰۵/۰۷/۲۸",
    time: "۱۳:۰۵:22",
    ip: "192.168.1.44",
    details: "گزارش انتخاب واحد نیمسال جاری با فیلتر دانشکده فنی و مهندسی مشاهده شد.",
  },
  {
    id: 8,
    user: "علی رضایی",
    username: "admin",
    role: "مدیر سیستم",
    action: "تغییر نقش",
    module: "سطوح دسترسی",
    description: "نقش کاربری یک حساب تغییر یافت.",
    entity: "نقش کاربر",
    entityId: "ROLE-019",
    result: "موفق",
    date: "۱۴۰۵/۰۷/۲۸",
    time: "۱۱:24:09",
    ip: "192.168.1.12",
    details: "نقش حساب از «کارمند» به «پشتیبان آموزش» تغییر داده شد.",
  },
  {
    id: 9,
    user: "مریم کریمی",
    username: "edu.support",
    role: "پشتیبان آموزش",
    action: "حذف",
    module: "انتخاب واحد",
    description: "ثبت‌نام یک درس حذف شد.",
    entity: "ثبت‌نام",
    entityId: "ENR-1987",
    result: "موفق",
    date: "۱۴۰۵/۰۷/۲۷",
    time: "۱۵:18:34",
    ip: "192.168.1.25",
    details: "ثبت‌نام دانشجو در درس اصول مدیریت حذف شد.",
  },
  {
    id: 10,
    user: "محمد احمدی",
    username: "prof.mahmadi",
    role: "استاد",
    action: "خروج",
    module: "احراز هویت",
    description: "کاربر از سامانه خارج شد.",
    entity: "نشست کاربری",
    entityId: "SES-4491",
    result: "موفق",
    date: "۱۴۰۵/۰۷/۲۷",
    time: "۱۲:48:16",
    ip: "192.168.1.37",
    details: "خروج عادی از حساب کاربری ثبت شد.",
  },
  {
    id: 11,
    user: "کاربر ناشناس",
    username: "unknown",
    role: "ناشناس",
    action: "ورود",
    module: "احراز هویت",
    description: "تلاش ورود به حساب قفل‌شده انجام شد.",
    entity: "حساب کاربری",
    entityId: "USR-1002",
    result: "ناموفق",
    date: "۱۴۰۵/۰۷/۲۷",
    time: "۰۸:11:02",
    ip: "10.0.0.46",
    details: "حساب به دلیل تلاش‌های ناموفق قبلی قفل بوده است.",
  },
  {
    id: 12,
    user: "علی رضایی",
    username: "admin",
    role: "مدیر سیستم",
    action: "ویرایش",
    module: "نیمسال‌ها",
    description: "تاریخ پایان انتخاب واحد به‌روزرسانی شد.",
    entity: "نیمسال",
    entityId: "SEM-1405-1",
    result: "موفق",
    date: "۱۴۰۵/۰۷/۲۶",
    time: "۱۷:02:47",
    ip: "192.168.1.12",
    details: "تاریخ پایان بازه انتخاب واحد مطابق تقویم آموزشی تغییر کرد.",
  },
];

const ACTIONS = ["همه عملیات", "ورود", "خروج", "ایجاد", "ویرایش", "حذف", "تأیید", "ثبت", "مشاهده", "تغییر نقش"];
const RESULTS = ["همه نتایج", "موفق", "ناموفق"];
const MODULES = [
  "همه بخش‌ها",
  "احراز هویت",
  "مدیریت کاربران",
  "انتخاب واحد",
  "مدیریت دروس",
  "کلاس‌ها و برنامه هفتگی",
  "نمرات",
  "گزارش‌ها",
  "سطوح دسترسی",
  "نیمسال‌ها",
];
const ROLES = ["همه نقش‌ها", "مدیر سیستم", "پشتیبان آموزش", "استاد", "کارمند", "دانشجو", "ناشناس"];

const RESULT_STYLE = {
  موفق: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  ناموفق: "bg-rose-50 text-rose-700 ring-rose-200",
};

const ACTION_STYLE = {
  ورود: "bg-sky-50 text-sky-700",
  خروج: "bg-slate-100 text-slate-600",
  ایجاد: "bg-indigo-50 text-indigo-700",
  ویرایش: "bg-amber-50 text-amber-700",
  حذف: "bg-rose-50 text-rose-700",
  تأیید: "bg-emerald-50 text-emerald-700",
  ثبت: "bg-violet-50 text-violet-700",
  مشاهده: "bg-slate-100 text-slate-600",
  "تغییر نقش": "bg-orange-50 text-orange-700",
};

function StatCard({ label, value, hint, icon: Icon, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-extrabold text-slate-900">{value.toLocaleString("fa-IR")}</p>
          <p className="mt-2 text-xs text-slate-500">{hint}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function SelectFilter({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-slate-600">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export default function Activity() {
  const [activities] = useState(INITIAL_ACTIVITIES);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("همه عملیات");
  const [resultFilter, setResultFilter] = useState("همه نتایج");
  const [moduleFilter, setModuleFilter] = useState("همه بخش‌ها");
  const [roleFilter, setRoleFilter] = useState("همه نقش‌ها");
  const [dateFilter, setDateFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const pageSize = 7;

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fa");
    return activities.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.user,
          item.username,
          item.description,
          item.module,
          item.entity,
          item.entityId,
          item.ip,
          item.action,
        ].some((value) => String(value).toLocaleLowerCase("fa").includes(query));

      const matchesAction = actionFilter === "همه عملیات" || item.action === actionFilter;
      const matchesResult = resultFilter === "همه نتایج" || item.result === resultFilter;
      const matchesModule = moduleFilter === "همه بخش‌ها" || item.module === moduleFilter;
      const matchesRole = roleFilter === "همه نقش‌ها" || item.role === roleFilter;
      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" && item.date === "۱۴۰۵/۰۷/۲۹") ||
        (dateFilter === "week" && ["۱۴۰۵/۰۷/۲۹", "۱۴۰۵/۰۷/۲۸", "۱۴۰۵/۰۷/۲۷"].includes(item.date));

      return matchesSearch && matchesAction && matchesResult && matchesModule && matchesRole && matchesDate;
    });
  }, [activities, search, actionFilter, resultFilter, moduleFilter, roleFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleActivities = filteredActivities.slice((safePage - 1) * pageSize, safePage * pageSize);

  const successCount = filteredActivities.filter((item) => item.result === "موفق").length;
  const failedCount = filteredActivities.filter((item) => item.result === "ناموفق").length;
  const uniqueUsers = new Set(filteredActivities.map((item) => item.username).filter((username) => username !== "unknown")).size;

  const resetFilters = () => {
    setSearch("");
    setActionFilter("همه عملیات");
    setResultFilter("همه نتایج");
    setModuleFilter("همه بخش‌ها");
    setRoleFilter("همه نقش‌ها");
    setDateFilter("all");
    setPage(1);
  };

  const exportCsv = () => {
    const headers = ["کاربر", "نام کاربری", "نقش", "عملیات", "بخش", "شرح", "موجودیت", "شناسه موجودیت", "نتیجه", "تاریخ", "ساعت", "IP"];
    const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = filteredActivities.map((item) => [
      item.user,
      item.username,
      item.role,
      item.action,
      item.module,
      item.description,
      item.entity,
      item.entityId,
      item.result,
      item.date,
      item.time,
      item.ip,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "amoozeshyar-activity-log.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div dir="rtl" className="min-h-full space-y-6 pb-8 text-slate-800">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <span>مدیریت آموزشی</span>
            <FiChevronLeft size={14} />
            <span className="text-slate-700">فعالیت‌های سیستم</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">سوابق فعالیت‌های سیستم</h1>
          <p className="mt-2 text-sm text-slate-500">
            رویدادهای کاربران، عملیات آموزشی و تلاش‌های ورود را بررسی و پیگیری کن.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <FiDownload size={17} />
          خروجی CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="کل رویدادها" value={filteredActivities.length} hint="بر اساس فیلترهای فعلی" icon={FiActivity} tone="bg-indigo-50 text-indigo-600" />
        <StatCard label="عملیات موفق" value={successCount} hint="رویدادهای ثبت‌شده با نتیجه موفق" icon={FiCheckCircle} tone="bg-emerald-50 text-emerald-600" />
        <StatCard label="عملیات ناموفق" value={failedCount} hint="نیازمند بررسی در صورت تکرار" icon={FiAlertCircle} tone="bg-rose-50 text-rose-600" />
        <StatCard label="کاربران فعال در نتایج" value={uniqueUsers} hint="تعداد کاربران یکتا در این گزارش" icon={FiUser} tone="bg-sky-50 text-sky-600" />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <FiFilter size={18} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">جست‌وجو و فیلتر فعالیت‌ها</h2>
            <p className="mt-1 text-xs text-slate-500">برای یافتن سریع یک رویداد از چند فیلتر به‌صورت هم‌زمان استفاده کن.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-600">جست‌وجو</span>
            <div className="relative">
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                value={search}
                onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                placeholder="نام کاربر، شرح، شناسه یا IP..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-10 pl-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />
              {search && (
                <button
                  type="button"
                  aria-label="پاک کردن جست‌وجو"
                  onClick={() => { setSearch(""); setPage(1); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          </label>
          <SelectFilter label="نوع عملیات" value={actionFilter} options={ACTIONS} onChange={(event) => { setActionFilter(event.target.value); setPage(1); }} />
          <SelectFilter label="بخش سیستم" value={moduleFilter} options={MODULES} onChange={(event) => { setModuleFilter(event.target.value); setPage(1); }} />
          <SelectFilter label="نقش کاربر" value={roleFilter} options={ROLES} onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }} />
          <SelectFilter label="نتیجه عملیات" value={resultFilter} options={RESULTS} onChange={(event) => { setResultFilter(event.target.value); setPage(1); }} />
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-600">بازه زمانی</span>
            <select
              value={dateFilter}
              onChange={(event) => { setDateFilter(event.target.value); setPage(1); }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            >
              <option value="all">همه زمان‌ها</option>
              <option value="today">امروز</option>
              <option value="week">سه روز اخیر (نمونه)</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500">
            <span className="font-bold text-slate-700">{filteredActivities.length.toLocaleString("fa-IR")}</span> رویداد پیدا شد.
          </p>
          <button type="button" onClick={resetFilters} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100">
            <FiRefreshCw size={14} />
            بازنشانی فیلترها
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-extrabold text-slate-800">فهرست رویدادها</h2>
            <p className="mt-1 text-xs text-slate-500">برای مشاهده شرح کامل، روی دکمه جزئیات هر ردیف کلیک کن.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
            <FiShield size={14} />
            داده‌های نمایشی
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] border-collapse text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="whitespace-nowrap px-5 py-4 font-bold">کاربر</th>
                <th className="whitespace-nowrap px-5 py-4 font-bold">عملیات</th>
                <th className="whitespace-nowrap px-5 py-4 font-bold">بخش سیستم</th>
                <th className="min-w-[270px] px-5 py-4 font-bold">شرح فعالیت</th>
                <th className="whitespace-nowrap px-5 py-4 font-bold">نتیجه</th>
                <th className="whitespace-nowrap px-5 py-4 font-bold">تاریخ و ساعت</th>
                <th className="whitespace-nowrap px-5 py-4 font-bold">IP</th>
                <th className="whitespace-nowrap px-5 py-4 font-bold">جزئیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleActivities.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50/80">
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="font-bold text-slate-800">{item.user}</div>
                    <div className="mt-1 text-xs text-slate-400" dir="ltr">{item.username} · {item.role}</div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className={`inline-flex rounded-lg px-2.5 py-1.5 text-xs font-bold ${ACTION_STYLE[item.action] || "bg-slate-100 text-slate-600"}`}>
                      {item.action}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">{item.module}</td>
                  <td className="px-5 py-4">
                    <p className="leading-6 text-slate-700">{item.description}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.entity}: {item.entityId}</p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${RESULT_STYLE[item.result]}`}>
                      {item.result}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2 text-slate-700"><FiCalendar size={14} className="text-slate-400" />{item.date}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400"><FiClock size={13} />{item.time}</div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-500" dir="ltr">{item.ip}</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedActivity(item)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <FiEye size={15} />
                      جزئیات
                    </button>
                  </td>
                </tr>
              ))}
              {visibleActivities.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><FiSearch size={22} /></div>
                    <p className="mt-3 font-bold text-slate-700">فعالیتی پیدا نشد</p>
                    <p className="mt-1 text-xs text-slate-500">فیلترها یا عبارت جست‌وجو را تغییر بده.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            نمایش {filteredActivities.length ? ((safePage - 1) * pageSize + 1).toLocaleString("fa-IR") : "۰"} تا {Math.min(safePage * pageSize, filteredActivities.length).toLocaleString("fa-IR")} از {filteredActivities.length.toLocaleString("fa-IR")} رویداد
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={safePage <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronRight size={15} />
              قبلی
            </button>
            <span className="min-w-20 text-center text-xs font-semibold text-slate-600">
              صفحه {safePage.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={safePage >= totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              بعدی
              <FiChevronLeft size={15} />
            </button>
          </div>
        </div>
      </section>

      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onClick={() => setSelectedActivity(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="activity-detail-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 p-5">
              <div>
                <h2 id="activity-detail-title" className="text-lg font-extrabold text-slate-900">جزئیات رویداد</h2>
                <p className="mt-1 text-xs text-slate-500">شناسه رویداد: ACT-{String(selectedActivity.id).padStart(4, "0")}</p>
              </div>
              <button type="button" onClick={() => setSelectedActivity(null)} aria-label="بستن پنجره" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                <FiX size={19} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              {[
                ["کاربر", `${selectedActivity.user} (${selectedActivity.username})`],
                ["نقش", selectedActivity.role],
                ["نوع عملیات", selectedActivity.action],
                ["بخش سیستم", selectedActivity.module],
                ["موجودیت مرتبط", `${selectedActivity.entity} · ${selectedActivity.entityId}`],
                ["نتیجه", selectedActivity.result],
                ["تاریخ", selectedActivity.date],
                ["ساعت", selectedActivity.time],
                ["نشانی IP", selectedActivity.ip],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-2 break-words text-sm font-bold text-slate-800">{value}</p>
                </div>
              ))}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:col-span-2">
                <p className="text-xs text-slate-500">شرح کامل</p>
                <p className="mt-2 text-sm leading-7 text-slate-800">{selectedActivity.details}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:col-span-2">
                <p className="text-xs text-slate-500">خلاصه رویداد</p>
                <p className="mt-2 text-sm leading-7 text-slate-800">{selectedActivity.description}</p>
              </div>
            </div>
            <div className="flex justify-end border-t border-slate-100 p-4">
              <button type="button" onClick={() => setSelectedActivity(null)} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700">
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-800">
        <span className="font-extrabold">توجه:</span> تمام رویدادهای این صفحه نمونه و استاتیک هستند. فیلترها، جزئیات و خروجی CSV در فرانت‌اند کار می‌کنند؛ ثبت واقعی رویدادها باید بعداً از طریق بک‌اند و جدول AuditLog پیاده‌سازی شود.
      </div>
    </div>
  );
}
