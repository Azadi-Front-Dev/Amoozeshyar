import { useMemo, useState } from "react";
import {
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFilter,
  FiSearch,
  FiTrash2,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";

const initialEnrollments = [
  {
    id: 1,
    studentId: "40112015",
    studentName: "آرمان رضایی",
    nationalId: "0062145789",
    faculty: "فنی و مهندسی",
    department: "مهندسی کامپیوتر",
    courseCode: "CS301",
    courseName: "ساختمان داده‌ها",
    professor: "دکتر مریم احمدی",
    group: "۱",
    semester: "1405-1",
    units: 3,
    registeredAt: "1405/07/12",
    status: "تأیید شده",
  },
  {
    id: 2,
    studentId: "40112015",
    studentName: "آرمان رضایی",
    nationalId: "0062145789",
    faculty: "فنی و مهندسی",
    department: "مهندسی کامپیوتر",
    courseCode: "MTH202",
    courseName: "ریاضیات مهندسی",
    professor: "دکتر رضا کریمی",
    group: "۲",
    semester: "1405-1",
    units: 3,
    registeredAt: "1405/07/12",
    status: "در انتظار بررسی",
  },
  {
    id: 3,
    studentId: "40211008",
    studentName: "نگار محمدی",
    nationalId: "0087456123",
    faculty: "علوم پایه",
    department: "ریاضی",
    courseCode: "MTH202",
    courseName: "ریاضیات مهندسی",
    professor: "دکتر رضا کریمی",
    group: "۱",
    semester: "1405-1",
    units: 3,
    registeredAt: "1405/07/13",
    status: "تأیید شده",
  },
  {
    id: 4,
    studentId: "40013022",
    studentName: "پارسا حسینی",
    nationalId: "0078123456",
    faculty: "فنی و مهندسی",
    department: "مهندسی برق",
    courseCode: "PHY110",
    courseName: "فیزیک عمومی",
    professor: "دکتر سارا نادری",
    group: "۱",
    semester: "1405-1",
    units: 3,
    registeredAt: "1405/07/14",
    status: "حذف شده",
  },
  {
    id: 5,
    studentId: "40312004",
    studentName: "هستی جعفری",
    nationalId: "0096312457",
    faculty: "فنی و مهندسی",
    department: "مهندسی کامپیوتر",
    courseCode: "CS205",
    courseName: "پایگاه داده",
    professor: "مهندس امیر صالحی",
    group: "۱",
    semester: "1405-1",
    units: 3,
    registeredAt: "1405/07/15",
    status: "تأیید شده",
  },
  {
    id: 6,
    studentId: "40112033",
    studentName: "سینا موسوی",
    nationalId: "0056123498",
    faculty: "علوم پایه",
    department: "فیزیک",
    courseCode: "PHY110",
    courseName: "فیزیک عمومی",
    professor: "دکتر سارا نادری",
    group: "۲",
    semester: "1405-1",
    units: 3,
    registeredAt: "1405/07/15",
    status: "در انتظار بررسی",
  },
  {
    id: 7,
    studentId: "40212017",
    studentName: "ترانه اکبری",
    nationalId: "0045781236",
    faculty: "فنی و مهندسی",
    department: "مهندسی کامپیوتر",
    courseCode: "CS410",
    courseName: "هوش مصنوعی",
    professor: "دکتر مریم احمدی",
    group: "۱",
    semester: "1405-1",
    units: 3,
    registeredAt: "1405/07/16",
    status: "تأیید شده",
  },
  {
    id: 8,
    studentId: "40011019",
    studentName: "محمدطاها کریمی",
    nationalId: "0069871234",
    faculty: "علوم پایه",
    department: "ریاضی",
    courseCode: "MTH101",
    courseName: "ریاضی عمومی ۱",
    professor: "دکتر رضا کریمی",
    group: "۳",
    semester: "1405-1",
    units: 3,
    registeredAt: "1405/07/17",
    status: "در انتظار بررسی",
  },
  {
    id: 9,
    studentId: "40113011",
    studentName: "یاسمن قاسمی",
    nationalId: "0081234567",
    faculty: "فنی و مهندسی",
    department: "مهندسی برق",
    courseCode: "ELC220",
    courseName: "مدارهای الکتریکی",
    professor: "دکتر سارا نادری",
    group: "۱",
    semester: "1405-1",
    units: 3,
    registeredAt: "1405/07/18",
    status: "تأیید شده",
  },
  {
    id: 10,
    studentId: "40311007",
    studentName: "امیرحسین شریفی",
    nationalId: "0076543219",
    faculty: "فنی و مهندسی",
    department: "مهندسی کامپیوتر",
    courseCode: "CS205",
    courseName: "پایگاه داده",
    professor: "مهندس امیر صالحی",
    group: "۱",
    semester: "1405-1",
    units: 3,
    registeredAt: "1405/07/19",
    status: "تأیید شده",
  },
  {
    id: 11,
    studentId: "40211008",
    studentName: "نگار محمدی",
    nationalId: "0087456123",
    faculty: "علوم پایه",
    department: "ریاضی",
    courseCode: "CS301",
    courseName: "ساختمان داده‌ها",
    professor: "دکتر مریم احمدی",
    group: "۱",
    semester: "1405-1",
    units: 3,
    registeredAt: "1405/07/19",
    status: "رد شده",
  },
  {
    id: 12,
    studentId: "40112033",
    studentName: "سینا موسوی",
    nationalId: "0056123498",
    faculty: "علوم پایه",
    department: "فیزیک",
    courseCode: "MTH101",
    courseName: "ریاضی عمومی ۱",
    professor: "دکتر رضا کریمی",
    group: "۳",
    semester: "1405-1",
    units: 3,
    registeredAt: "1405/07/20",
    status: "در انتظار بررسی",
  },
];

const statusOptions = [
  "همه وضعیت‌ها",
  "تأیید شده",
  "در انتظار بررسی",
  "حذف شده",
  "رد شده",
];
const facultyOptions = ["همه دانشکده‌ها", "فنی و مهندسی", "علوم پایه"];
const semesterOptions = [
  { value: "1405-1", label: "نیمسال اول ۱۴۰۵–۱۴۰۶" },
  { value: "1404-2", label: "نیمسال دوم ۱۴۰۴–۱۴۰۵" },
];

function StatusBadge({ status }) {
  const styles = {
    "تأیید شده": "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "در انتظار بررسی": "bg-amber-50 text-amber-700 ring-amber-200",
    "حذف شده": "bg-slate-100 text-slate-600 ring-slate-200",
    "رد شده": "bg-rose-50 text-rose-700 ring-rose-200",
  };
  return (
    <span
      className={`inline-flex whitespace-nowrap items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status] || styles["در انتظار بررسی"]}`}
    >
      {status}
    </span>
  );
}

function StatCard({ title, value, detail, icon: Icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </span>
      </div>
    </div>
  );
}

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState(initialEnrollments);
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("1405-1");
  const [faculty, setFaculty] = useState("همه دانشکده‌ها");
  const [status, setStatus] = useState("همه وضعیت‌ها");
  const [department, setDepartment] = useState("همه گروه‌ها");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const pageSize = 7;

  const departments = useMemo(() => {
    const values = enrollments
      .filter(
        (item) => faculty === "همه دانشکده‌ها" || item.faculty === faculty,
      )
      .map((item) => item.department);
    return ["همه گروه‌ها", ...new Set(values)];
  }, [enrollments, faculty]);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("fa");
    return enrollments.filter((item) => {
      const matchesSearch =
        !term ||
        [
          item.studentName,
          item.studentId,
          item.nationalId,
          item.courseName,
          item.courseCode,
          item.professor,
        ].some((value) => String(value).toLocaleLowerCase("fa").includes(term));
      return (
        item.semester === semester &&
        matchesSearch &&
        (faculty === "همه دانشکده‌ها" || item.faculty === faculty) &&
        (department === "همه گروه‌ها" || item.department === department) &&
        (status === "همه وضعیت‌ها" || item.status === status)
      );
    });
  }, [enrollments, search, semester, faculty, department, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleRows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const stats = useMemo(() => {
    const current = enrollments.filter((item) => item.semester === semester);
    return {
      total: current.length,
      approved: current.filter((item) => item.status === "تأیید شده").length,
      pending: current.filter((item) => item.status === "در انتظار بررسی")
        .length,
      dropped: current.filter((item) => item.status === "حذف شده").length,
    };
  }, [enrollments, semester]);

  const resetFilters = () => {
    setSearch("");
    setFaculty("همه دانشکده‌ها");
    setDepartment("همه گروه‌ها");
    setStatus("همه وضعیت‌ها");
    setPage(1);
  };

  const changeStatus = (id, nextStatus) => {
    setEnrollments((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item,
      ),
    );
    setSelected(null);
  };

  const removeEnrollment = () => {
    setEnrollments((current) =>
      current.filter((item) => item.id !== confirmDelete),
    );
    setConfirmDelete(null);
  };

  return (
    <div dir="rtl" className="min-h-full space-y-6 pb-8 text-slate-800">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>مدیریت آموزش</span>
            <FiChevronLeft size={14} />
            <span className="text-slate-700">انتخاب واحد و ثبت‌نام</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            انتخاب واحد دانشجویان
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            مشاهده درخواست‌های ثبت‌نام دروس، بررسی وضعیت و مدیریت حذف‌واضافه
            دانشجویان.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm sm:self-auto">
          <FiCalendar className="text-indigo-600" size={17} />
          <select
            aria-label="نیمسال تحصیلی"
            value={semester}
            onChange={(event) => {
              setSemester(event.target.value);
              setPage(1);
            }}
            className="max-w-[220px] bg-transparent font-medium text-slate-700 outline-none"
          >
            {semesterOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="کل درخواست‌های انتخاب واحد"
          value={stats.total}
          detail="در نیمسال انتخاب‌شده"
          icon={FiBookOpen}
          iconClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="ثبت‌نام تأییدشده"
          value={stats.approved}
          detail="ثبت‌نام‌های نهایی‌شده"
          icon={FiCheckCircle}
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="در انتظار بررسی"
          value={stats.pending}
          detail="نیازمند پیگیری آموزش"
          icon={FiClock}
          iconClass="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="حذف درس"
          value={stats.dropped}
          detail="درخواست‌های حذف‌شده"
          icon={FiUsers}
          iconClass="bg-slate-100 text-slate-600"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FiFilter size={18} />
            </span>
            <div>
              <h2 className="font-bold text-slate-900">فیلتر و جست‌وجو</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                جست‌وجو بر اساس دانشجو، شماره دانشجویی، درس یا استاد
              </p>
            </div>
          </div>
          <button
            onClick={resetFilters}
            className="self-start rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 lg:self-auto"
          >
            پاک‌کردن فیلترها
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="relative block sm:col-span-2 xl:col-span-1">
            <FiSearch
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="نام، شماره دانشجویی، نام درس..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </label>
          <select
            value={faculty}
            onChange={(event) => {
              setFaculty(event.target.value);
              setDepartment("همه گروه‌ها");
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
          >
            {facultyOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
          >
            {departments.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
          >
            {statusOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
          <div>
            <h2 className="font-bold text-slate-900">فهرست انتخاب واحدها</h2>
            <p className="mt-1 text-xs text-slate-500">
              {filtered.length} نتیجه مطابق فیلترهای انتخاب‌شده
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            <FiUsers size={14} /> اطلاعات نمونه
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-right text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-5 py-3.5">دانشجو</th>
                <th className="px-4 py-3.5">درس</th>
                <th className="px-4 py-3.5">گروه آموزشی</th>
                <th className="px-4 py-3.5">استاد</th>
                <th className="px-4 py-3.5 text-center">واحد</th>
                <th className="px-4 py-3.5">تاریخ ثبت</th>
                <th className="px-4 py-3.5">وضعیت</th>
                <th className="px-5 py-3.5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleRows.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
                        {item.studentName
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.studentName}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          شماره دانشجویی: {item.studentId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-800">
                      {item.courseName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500" dir="ltr">
                      {item.courseCode} · گروه {item.group}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-slate-700">{item.department}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      دانشکده {item.faculty}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{item.professor}</td>
                  <td className="px-4 py-4 text-center font-semibold tabular-nums">
                    {item.units}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {item.registeredAt}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelected(item)}
                        title="بررسی درخواست"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        بررسی
                      </button>
                      <button
                        onClick={() => setConfirmDelete(item.id)}
                        title="حذف رکورد"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <FiSearch size={22} />
                    </div>
                    <p className="mt-3 font-semibold text-slate-700">
                      موردی پیدا نشد
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      عبارت جست‌وجو یا فیلترها را تغییر دهید.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs text-slate-500">
            نمایش {filtered.length ? (currentPage - 1) * pageSize + 1 : 0} تا{" "}
            {Math.min(currentPage * pageSize, filtered.length)} از{" "}
            {filtered.length} درخواست
          </p>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              disabled={currentPage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronRight size={16} /> قبلی
            </button>
            <span className="min-w-20 text-center text-sm text-slate-600">
              صفحه {currentPage} از {pageCount}
            </span>
            <button
              disabled={currentPage >= pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              بعدی <FiChevronLeft size={16} />
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="my-8 w-full max-w-xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  بررسی درخواست انتخاب واحد
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  جزئیات دانشجو و درس انتخاب‌شده
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <FiX size={19} />
              </button>
            </div>
            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <FiUser size={22} />
                </span>
                <div>
                  <p className="font-bold text-slate-900">
                    {selected.studentName}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    شماره دانشجویی: {selected.studentId} · کد ملی:{" "}
                    {selected.nationalId}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-xs text-slate-500">نام درس</p>
                  <p className="mt-1 font-semibold">{selected.courseName}</p>
                  <p className="mt-1 text-xs text-slate-500" dir="ltr">
                    {selected.courseCode}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-xs text-slate-500">استاد درس</p>
                  <p className="mt-1 font-semibold">{selected.professor}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    گروه {selected.group} · {selected.units} واحد
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-xs text-slate-500">رشته / دانشکده</p>
                  <p className="mt-1 font-semibold">{selected.department}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selected.faculty}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-xs text-slate-500">وضعیت فعلی</p>
                  <div className="mt-2">
                    <StatusBadge status={selected.status} />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  onClick={() => changeStatus(selected.id, "رد شده")}
                  className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                >
                  رد درخواست
                </button>
                <button
                  onClick={() => changeStatus(selected.id, "حذف شده")}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  ثبت حذف درس
                </button>
                <button
                  onClick={() => changeStatus(selected.id, "تأیید شده")}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  تأیید انتخاب واحد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <FiTrash2 size={22} />
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              حذف درخواست انتخاب واحد؟
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              این رکورد از فهرست نمونه حذف می‌شود. در نسخه واقعی، حذف باید با
              کنترل دسترسی و ثبت سابقه انجام شود.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                انصراف
              </button>
              <button
                onClick={removeEnrollment}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                حذف رکورد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
