import { useMemo, useState } from "react";
import {
  FiActivity,
  FiBookOpen,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiFileText,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiUsers,
  FiX,
} from "react-icons/fi";

const REPORT_DATA = [
  {
    id: 1,
    studentNumber: "14021001",
    studentName: "آرمان محمدی",
    faculty: "فنی و مهندسی",
    department: "مهندسی کامپیوتر",
    courseCode: "CS301",
    courseName: "ساختمان داده‌ها",
    professor: "دکتر مهدی رضایی",
    semester: "1405-1",
    units: 3,
    status: "تأیید شده",
    registeredAt: "1405/07/12",
  },
  {
    id: 2,
    studentNumber: "14021002",
    studentName: "سارا احمدی",
    faculty: "فنی و مهندسی",
    department: "مهندسی کامپیوتر",
    courseCode: "CS205",
    courseName: "پایگاه داده",
    professor: "دکتر نرگس کریمی",
    semester: "1405-1",
    units: 3,
    status: "تأیید شده",
    registeredAt: "1405/07/12",
  },
  {
    id: 3,
    studentNumber: "14021003",
    studentName: "امیرحسین کاظمی",
    faculty: "علوم پایه",
    department: "ریاضی",
    courseCode: "MA201",
    courseName: "معادلات دیفرانسیل",
    professor: "دکتر علی صادقی",
    semester: "1405-1",
    units: 3,
    status: "در انتظار بررسی",
    registeredAt: "1405/07/13",
  },
  {
    id: 4,
    studentNumber: "14021004",
    studentName: "نگار موسوی",
    faculty: "علوم انسانی",
    department: "مدیریت",
    courseCode: "MG110",
    courseName: "اصول مدیریت",
    professor: "دکتر سمیه مرادی",
    semester: "1405-1",
    units: 2,
    status: "تأیید شده",
    registeredAt: "1405/07/13",
  },
  {
    id: 5,
    studentNumber: "14011008",
    studentName: "پارسا جعفری",
    faculty: "فنی و مهندسی",
    department: "مهندسی برق",
    courseCode: "EE210",
    courseName: "مدارهای الکتریکی",
    professor: "دکتر مهدی رضایی",
    semester: "1405-1",
    units: 3,
    status: "حذف شده",
    registeredAt: "1405/07/14",
  },
  {
    id: 6,
    studentNumber: "14021006",
    studentName: "هستی رحیمی",
    faculty: "علوم پایه",
    department: "فیزیک",
    courseCode: "PH102",
    courseName: "فیزیک عمومی",
    professor: "دکتر علی صادقی",
    semester: "1405-1",
    units: 3,
    status: "در انتظار بررسی",
    registeredAt: "1405/07/14",
  },
  {
    id: 7,
    studentNumber: "14021007",
    studentName: "محمدرضا حیدری",
    faculty: "فنی و مهندسی",
    department: "مهندسی کامپیوتر",
    courseCode: "CS410",
    courseName: "مهندسی نرم‌افزار",
    professor: "دکتر نرگس کریمی",
    semester: "1405-1",
    units: 3,
    status: "تأیید شده",
    registeredAt: "1405/07/15",
  },
  {
    id: 8,
    studentNumber: "14011011",
    studentName: "الناز قاسمی",
    faculty: "علوم انسانی",
    department: "مدیریت",
    courseCode: "MG220",
    courseName: "مدیریت منابع انسانی",
    professor: "دکتر سمیه مرادی",
    semester: "1405-1",
    units: 2,
    status: "رد شده",
    registeredAt: "1405/07/15",
  },
  {
    id: 9,
    studentNumber: "14021009",
    studentName: "کیان نادری",
    faculty: "فنی و مهندسی",
    department: "مهندسی برق",
    courseCode: "EE305",
    courseName: "الکترونیک",
    professor: "دکتر مهدی رضایی",
    semester: "1404-2",
    units: 3,
    status: "تأیید شده",
    registeredAt: "1404/12/20",
  },
  {
    id: 10,
    studentNumber: "14021010",
    studentName: "ترانه رستمی",
    faculty: "علوم پایه",
    department: "ریاضی",
    courseCode: "MA115",
    courseName: "ریاضی عمومی",
    professor: "دکتر علی صادقی",
    semester: "1404-2",
    units: 3,
    status: "حذف شده",
    registeredAt: "1404/12/21",
  },
];

const REPORT_TYPES = [
  { id: "enrollments", label: "گزارش انتخاب واحد", icon: FiFileText },
  { id: "students", label: "گزارش دانشجویان", icon: FiUsers },
  { id: "courses", label: "گزارش دروس", icon: FiBookOpen },
];

const STATUS_OPTIONS = [
  "همه وضعیت‌ها",
  "تأیید شده",
  "در انتظار بررسی",
  "رد شده",
  "حذف شده",
];

const SEMESTERS = [
  { value: "all", label: "همه نیمسال‌ها" },
  { value: "1405-1", label: "نیمسال اول ۱۴۰۵–۱۴۰۶" },
  { value: "1404-2", label: "نیمسال دوم ۱۴۰۴–۱۴۰۵" },
];

const FACULTIES = [
  "همه دانشکده‌ها",
  "فنی و مهندسی",
  "علوم پایه",
  "علوم انسانی",
];

const STATUS_STYLES = {
  "تأیید شده": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "در انتظار بررسی": "bg-amber-50 text-amber-700 ring-amber-200",
  "رد شده": "bg-rose-50 text-rose-700 ring-rose-200",
  "حذف شده": "bg-slate-100 text-slate-600 ring-slate-200",
};

function StatCard({ title, value, caption, icon: Icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-3 text-2xl font-extrabold text-slate-800">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{caption}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export default function Reports() {
  const [reportType, setReportType] = useState("enrollments");
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("1405-1");
  const [faculty, setFaculty] = useState("همه دانشکده‌ها");
  const [status, setStatus] = useState("همه وضعیت‌ها");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filteredData = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fa");
    return REPORT_DATA.filter((item) => {
      const matchesSemester = semester === "all" || item.semester === semester;
      const matchesFaculty = faculty === "همه دانشکده‌ها" || item.faculty === faculty;
      const matchesStatus = status === "همه وضعیت‌ها" || item.status === status;
      const matchesSearch =
        !query ||
        [
          item.studentName,
          item.studentNumber,
          item.courseName,
          item.courseCode,
          item.professor,
          item.department,
        ].some((value) => value.toLocaleLowerCase("fa").includes(query));

      if (reportType === "students") {
        return (
          matchesSemester &&
          matchesFaculty &&
          matchesStatus &&
          matchesSearch
        );
      }

      if (reportType === "courses") {
        return (
          matchesSemester &&
          matchesFaculty &&
          matchesStatus &&
          matchesSearch
        );
      }

      return matchesSemester && matchesFaculty && matchesStatus && matchesSearch;
    });
  }, [reportType, search, semester, faculty, status]);

  const uniqueStudents = useMemo(
    () => new Set(filteredData.map((item) => item.studentNumber)).size,
    [filteredData],
  );

  const uniqueCourses = useMemo(
    () => new Set(filteredData.map((item) => item.courseCode)).size,
    [filteredData],
  );

  const approvedCount = filteredData.filter((item) => item.status === "تأیید شده").length;
  const pendingCount = filteredData.filter((item) => item.status === "در انتظار بررسی").length;
  const totalUnits = filteredData
    .filter((item) => item.status === "تأیید شده")
    .reduce((sum, item) => sum + item.units, 0);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filteredData.slice((safePage - 1) * pageSize, safePage * pageSize);

  const resetFilters = () => {
    setSearch("");
    setSemester("1405-1");
    setFaculty("همه دانشکده‌ها");
    setStatus("همه وضعیت‌ها");
    setPage(1);
  };

  const handleExport = () => {
    const headers =
      reportType === "students"
        ? ["شماره دانشجویی", "نام دانشجو", "دانشکده", "گروه آموزشی", "تعداد رکوردها", "واحدهای تأییدشده"]
        : reportType === "courses"
          ? ["کد درس", "نام درس", "استاد", "دانشکده", "گروه آموزشی", "تعداد واحد"]
          : ["شماره دانشجویی", "نام دانشجو", "کد درس", "نام درس", "استاد", "نیمسال", "واحد", "وضعیت", "تاریخ ثبت"];

    let rows;
    if (reportType === "students") {
      const grouped = new Map();
      filteredData.forEach((item) => {
        const current = grouped.get(item.studentNumber) || {
          studentNumber: item.studentNumber,
          studentName: item.studentName,
          faculty: item.faculty,
          department: item.department,
          count: 0,
          units: 0,
        };
        current.count += 1;
        if (item.status === "تأیید شده") current.units += item.units;
        grouped.set(item.studentNumber, current);
      });
      rows = Array.from(grouped.values()).map((item) => [
        item.studentNumber,
        item.studentName,
        item.faculty,
        item.department,
        item.count,
        item.units,
      ]);
    } else if (reportType === "courses") {
      const grouped = new Map();
      filteredData.forEach((item) => {
        if (!grouped.has(item.courseCode)) {
          grouped.set(item.courseCode, [
            item.courseCode,
            item.courseName,
            item.professor,
            item.faculty,
            item.department,
            item.units,
          ]);
        }
      });
      rows = Array.from(grouped.values());
    } else {
      rows = filteredData.map((item) => [
        item.studentNumber,
        item.studentName,
        item.courseCode,
        item.courseName,
        item.professor,
        item.semester,
        item.units,
        item.status,
        item.registeredAt,
      ]);
    }

    const csv = [headers, ...rows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `amoozeshyar-report-${reportType}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const activeReport = REPORT_TYPES.find((item) => item.id === reportType);
  const showStudentColumn = reportType !== "courses";
  const showCourseColumns = reportType !== "students";

  return (
    <div dir="rtl" className="min-h-full space-y-6 pb-8 text-slate-800">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <span>مدیریت آموزشی</span>
            <FiChevronLeft size={14} />
            <span className="text-slate-700">گزارش‌ها</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">گزارش‌ها و آمار آموزشی</h1>
          <p className="mt-2 text-sm text-slate-500">
            گزارش‌های آموزشی را بر اساس نیمسال، دانشکده و وضعیت بررسی کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <FiDownload size={17} />
          دریافت خروجی CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="کل رکوردهای گزارش"
          value={filteredData.length.toLocaleString("fa-IR")}
          caption="مطابق فیلترهای انتخاب‌شده"
          icon={FiFileText}
          iconClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="دانشجویان یکتا"
          value={uniqueStudents.toLocaleString("fa-IR")}
          caption="دانشجویان حاضر در نتایج"
          icon={FiUsers}
          iconClass="bg-sky-50 text-sky-600"
        />
        <StatCard
          title="ثبت‌نام تأییدشده"
          value={approvedCount.toLocaleString("fa-IR")}
          caption={`${totalUnits.toLocaleString("fa-IR")} واحد تأییدشده`}
          icon={FiActivity}
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="در انتظار بررسی"
          value={pendingCount.toLocaleString("fa-IR")}
          caption={`${uniqueCourses.toLocaleString("fa-IR")} کد درس در نتایج`}
          icon={FiCalendar}
          iconClass="bg-amber-50 text-amber-600"
        />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <FiFilter size={18} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">نوع گزارش و فیلترها</h2>
            <p className="mt-1 text-xs text-slate-500">نتایج جدول و فایل خروجی با این فیلترها به‌روزرسانی می‌شوند.</p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {REPORT_TYPES.map((type) => {
            const Icon = type.icon;
            const selected = reportType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  setReportType(type.id);
                  setPage(1);
                }}
                className={`flex items-center gap-3 rounded-xl border p-4 text-right transition ${
                  selected
                    ? "border-indigo-300 bg-indigo-50 ring-2 ring-indigo-100"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                  <Icon size={19} />
                </span>
                <span className="font-bold text-sm">{type.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-600">جست‌وجو</span>
            <div className="relative">
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="نام، شماره دانشجویی یا درس..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-10 pl-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  aria-label="پاک کردن جست‌وجو"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-600">نیمسال تحصیلی</span>
            <select
              value={semester}
              onChange={(event) => {
                setSemester(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            >
              {SEMESTERS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-600">دانشکده</span>
            <select
              value={faculty}
              onChange={(event) => {
                setFaculty(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            >
              {FACULTIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-600">وضعیت ثبت‌نام</span>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            >
              {STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500">
            گزارش فعال: <span className="font-bold text-slate-700">{activeReport?.label}</span>
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
          >
            <FiRefreshCw size={14} />
            بازنشانی فیلترها
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-extrabold text-slate-800">{activeReport?.label}</h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredData.length.toLocaleString("fa-IR")} نتیجه مطابق فیلترهای فعلی
            </p>
          </div>
          <span className="w-fit rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            داده‌های نمونه
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="whitespace-nowrap px-5 py-4 font-bold">ردیف</th>
                {showStudentColumn && (
                  <>
                    <th className="whitespace-nowrap px-5 py-4 font-bold">دانشجو</th>
                    <th className="whitespace-nowrap px-5 py-4 font-bold">شماره دانشجویی</th>
                  </>
                )}
                {showCourseColumns && (
                  <>
                    <th className="whitespace-nowrap px-5 py-4 font-bold">درس</th>
                    <th className="whitespace-nowrap px-5 py-4 font-bold">استاد</th>
                  </>
                )}
                <th className="whitespace-nowrap px-5 py-4 font-bold">دانشکده / گروه</th>
                {reportType !== "students" && <th className="whitespace-nowrap px-5 py-4 font-bold">نیمسال</th>}
                <th className="whitespace-nowrap px-5 py-4 font-bold">واحد</th>
                {reportType !== "courses" && <th className="whitespace-nowrap px-5 py-4 font-bold">وضعیت</th>}
                {reportType === "enrollments" && <th className="whitespace-nowrap px-5 py-4 font-bold">تاریخ ثبت</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageRows.map((item, index) => (
                <tr key={item.id} className="transition hover:bg-slate-50/80">
                  <td className="px-5 py-4 text-slate-400">{((safePage - 1) * pageSize + index + 1).toLocaleString("fa-IR")}</td>
                  {showStudentColumn && (
                    <>
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="font-bold text-slate-800">{item.studentName}</div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-600" dir="ltr">{item.studentNumber}</td>
                    </>
                  )}
                  {showCourseColumns && (
                    <>
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="font-bold text-slate-800">{item.courseName}</div>
                        <div className="mt-1 font-mono text-xs text-slate-400" dir="ltr">{item.courseCode}</div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">{item.professor}</td>
                    </>
                  )}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="text-slate-700">{item.faculty}</div>
                    <div className="mt-1 text-xs text-slate-400">{item.department}</div>
                  </td>
                  {reportType !== "students" && <td className="whitespace-nowrap px-5 py-4 text-slate-600">{item.semester === "1405-1" ? "اول ۱۴۰۵–۱۴۰۶" : "دوم ۱۴۰۴–۱۴۰۵"}</td>}
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">{item.units.toLocaleString("fa-IR")}</td>
                  {reportType !== "courses" && (
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${STATUS_STYLES[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                  )}
                  {reportType === "enrollments" && <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">{item.registeredAt}</td>}
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <FiSearch size={22} />
                    </div>
                    <p className="mt-3 font-bold text-slate-700">نتیجه‌ای پیدا نشد</p>
                    <p className="mt-1 text-xs text-slate-500">فیلترها یا عبارت جست‌وجو را تغییر بده.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            نمایش {filteredData.length ? ((safePage - 1) * pageSize + 1).toLocaleString("fa-IR") : "۰"} تا {Math.min(safePage * pageSize, filteredData.length).toLocaleString("fa-IR")} از {filteredData.length.toLocaleString("fa-IR")} رکورد
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

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-800">
        <span className="font-extrabold">توجه:</span> این صفحه با داده‌های استاتیک کار می‌کند. خروجی CSV نیز فقط نتایج نمونه و فیلترشده همین صفحه را صادر می‌کند؛ برای گزارش واقعی باید اطلاعات از API بک‌اند دریافت شود.
      </div>
    </div>
  );
}
