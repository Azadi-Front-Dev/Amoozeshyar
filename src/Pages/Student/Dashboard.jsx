
import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const API_URL =
  "http://127.0.0.1:8000/api/accounts/student/dashboard/";

const ENROLLMENTS_API_URL =
  "http://127.0.0.1:8000/api/registration/student/my-enrollments/";

const menuItems = [
  { label: "داشبورد", path: "/student", icon: "layout-dashboard", end: true },
  { label: "انتخاب واحد", path: "/student/enrollment", icon: "book-open" },
  { label: "برنامه هفتگی", path: "/student/schedule", icon: "calendar-days" },
  { label: "نمرات", path: "/student/grades", icon: "graduation-cap" },
  { label: "امور مالی", path: "/student/finance", icon: "wallet" },
  { label: "پروفایل", path: "/student/profile", icon: "user-round" },
];

const iconPaths = {
  "layout-dashboard": (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </>
  ),
  "book-open": (
    <>
      <path d="M12 7v14" />
      <path d="M3 18V5a1 1 0 0 1 1-1h4a4 4 0 0 1 4 4 4 4 0 0 1 4-4h4a1 1 0 0 1 1 1v13" />
      <path d="M3 18a3 3 0 0 1 3-3h2a4 4 0 0 1 4 4 4 4 0 0 1 4-4h2a3 3 0 0 1 3 3" />
    </>
  ),
  "calendar-days": (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
      <path d="M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01" />
    </>
  ),
  "graduation-cap": (
    <>
      <path d="m2 10 10-5 10 5-10 5-10-5Z" />
      <path d="M6 12v5c4 3 8 3 12 0v-5M22 10v6" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M16 15h.01" />
      <path d="M6 5V3h12v2" />
    </>
  ),
  "user-round": (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  logout: (
    <>
      <path d="M10 17l5-5-5-5M15 12H3" />
      <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 7v5h-5M4 17v-5h5" />
      <path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3" />
    </>
  ),
  "chevron-left": <path d="m15 18-6-6 6-6" />,
  "book-mark": (
    <>
      <path d="M6 4h12v17l-6-4-6 4V4Z" />
      <path d="M9 8h6" />
    </>
  ),
};

function Icon({ name, size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {iconPaths[name] || iconPaths["layout-dashboard"]}
    </svg>
  );
}

function formatNumber(value) {
  return new Intl.NumberFormat("fa-IR").format(Number(value) || 0);
}

function mapEnrolledCourse(course) {
  return {
    ...course,
    id: course.class_section_id ?? course.id ?? course.class_section,
    code: course.course_code || course.code || "",
    title: course.course_title || course.title || course.name || "",
    units: Number(course.units ?? course.credit ?? 0),
    professor: course.professor || course.teacher || "",
  };
}

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access");

      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const [dashboardResponse, enrollmentsResponse] =
        await Promise.all([
          fetch(API_URL, { method: "GET", headers }),
          fetch(ENROLLMENTS_API_URL, { method: "GET", headers }),
        ]);

      if (
        dashboardResponse.status === 401 ||
        enrollmentsResponse.status === 401
      ) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        navigate("/Login", { replace: true });
        return;
      }

      if (!dashboardResponse.ok) {
        throw new Error(`خطای سرور (${dashboardResponse.status})`);
      }

      const dashboardData = await dashboardResponse.json();

      // در صورت موفقیت API ثبت‌نام‌ها، فهرست درس‌ها و مجموع واحدها
      // از ثبت‌نام‌های فعال دریافت می‌شوند.
      if (enrollmentsResponse.ok) {
        const enrollmentData = await enrollmentsResponse.json();

        let enrollmentRows = [];

        if (Array.isArray(enrollmentData)) {
          enrollmentRows = enrollmentData;
        } else if (Array.isArray(enrollmentData.results)) {
          enrollmentRows = enrollmentData.results;
        }

        const enrolledCourses = enrollmentRows.map(mapEnrolledCourse);

        const totalUnits = enrolledCourses.reduce(
          (total, course) => total + course.units,
          0
        );

        dashboardData.enrolled_courses = enrolledCourses;

        dashboardData.stats = {
          ...(dashboardData.stats || {}),
          enrolled_courses_count: enrolledCourses.length,
          total_units: totalUnits,
        };
      }

      setDashboard(dashboardData);
    } catch (err) {
      setError(
        err.message || "دریافت اطلاعات داشبورد با مشکل مواجه شد."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const student = dashboard?.student || {};
  const semester = dashboard?.semester || {};
  const stats = dashboard?.stats || {};

  const courses = Array.isArray(dashboard?.enrolled_courses)
    ? dashboard.enrolled_courses
    : [];

  const studentName =
    [student.first_name, student.last_name].filter(Boolean).join(" ") ||
    "دانشجوی گرامی";

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/Login", { replace: true });
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      {/* <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <Icon name="graduation-cap" size={27} />
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
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </header> */}

      <div className="mx-auto max-w-[1600px] px-4 pt-5 sm:px-6 lg:px-8">
        {/* Navigation */}
        {/* <nav
          aria-label="منوی اصلی دانشجو"
          className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
        >
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    "flex shrink-0 items-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition sm:px-5",
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                      : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700",
                  ].join(" ")
                }
              >
                <Icon name={item.icon} size={19} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav> */}

        {/* Welcome */}
        <section className="flex-col-center flex-wrap p-6 max-h-60 relative overflow-hidden rounded-3xl bg-linear-to-l from-indigo-950 via-indigo-800 to-violet-700 text-white shadow-xl shadow-indigo-100 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -left-12 -top-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-violet-300/10" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                پنل دانشجویی
              </span>

              <h2 className="mt-5 text-2xl font-black sm:text-3xl lg:text-4xl">
                سلام، {studentName}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-indigo-100 sm:text-base">
                به پنل دانشجویی خود خوش آمدید. از این قسمت می‌توانید وضعیت
                تحصیلی، انتخاب واحد و اطلاعات آموزشی خود را مشاهده کنید.
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                {student.student_number && (
                  <span className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                    شماره دانشجویی: {student.student_number}
                  </span>
                )}

                {student.field && (
                  <span className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                    رشته: {student.field}
                  </span>
                )}

                {semester.title && (
                  <span className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                    {semester.title}
                  </span>
                )}
              </div>
            </div>

            <div className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 lg:flex">
              <Icon name="graduation-cap" size={64} />
            </div>
          </div>
        </section>

        {/* Main content */}
        <main className="space-y-7 py-7">
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-bold text-red-800">
                    دریافت اطلاعات ناموفق بود
                  </h3>
                  <p className="mt-2 text-sm text-red-700">{error}</p>
                </div>

                <button
                  type="button"
                  onClick={loadDashboard}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  <Icon name="refresh" size={17} />
                  تلاش مجدد
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  خلاصه وضعیت تحصیلی
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  نمای کلی اطلاعات آموزشی شما
                </p>
              </div>

              <button
                type="button"
                onClick={loadDashboard}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-700 disabled:opacity-50"
              >
                <Icon name="refresh" size={17} />
                به‌روزرسانی
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "درس‌های اخذشده",
                  value: stats.enrolled_courses_count ?? courses.length,
                  suffix: "درس",
                  icon: "book-open",
                  color: "bg-blue-50 text-blue-700",
                },
                {
                  title: "مجموع واحدها",
                  value: stats.total_units ?? 0,
                  suffix: "واحد",
                  icon: "book-mark",
                  color: "bg-violet-50 text-violet-700",
                },
                {
                  title: "معدل کل",
                  value:
                    stats.gpa == null || stats.gpa === ""
                      ? "—"
                      : Number(stats.gpa).toLocaleString("fa-IR", {
                          maximumFractionDigits: 2,
                        }),
                  suffix: "معدل",
                  icon: "graduation-cap",
                  color: "bg-emerald-50 text-emerald-700",
                },
                {
                  title: "وضعیت تحصیلی",
                  value: student.status || "ثبت نشده",
                  suffix: "",
                  icon: "user-round",
                  color: "bg-amber-50 text-amber-700",
                },
              ].map((stat) => (
                <article
                  key={stat.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        {stat.title}
                      </p>

                      {loading ? (
                        <div className="mt-4 h-8 w-24 animate-pulse rounded-lg bg-slate-100" />
                      ) : (
                        <div className="mt-3 flex flex-wrap items-baseline gap-2">
                          <span className="text-2xl font-black text-slate-900">
                            {typeof stat.value === "number"
                              ? formatNumber(stat.value)
                              : stat.value}
                          </span>
                          {stat.suffix && (
                            <span className="text-xs text-slate-400">
                              {stat.suffix}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.color}`}
                    >
                      <Icon name={stat.icon} size={23} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Registration status */}
          {semester.registration_open !== undefined && (
            <section
              className={`flex flex-col justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center ${
                semester.registration_open
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <div>
                <h3 className="font-bold text-slate-900">
                  وضعیت انتخاب واحد
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {semester.registration_open
                    ? "فرصت انتخاب واحد فعال است."
                    : "در حال حاضر انتخاب واحد فعال نیست."}
                </p>
              </div>

              <span
                className={`inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
                  semester.registration_open
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {semester.registration_open ? "فعال" : "غیرفعال"}
              </span>
            </section>
          )}

          {/* Enrolled courses */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  درس‌های انتخاب‌شده
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  فهرست درس‌های ثبت‌شده در ترم جاری
                </p>
              </div>

              <NavLink
                to="/student/enrollment"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
              >
                مدیریت انتخاب واحد
                <Icon name="chevron-left" size={17} />
              </NavLink>
            </div>

            {loading ? (
              <div className="space-y-3 p-6">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-12 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Icon name="book-open" size={30} />
                </div>

                <h3 className="mt-4 font-bold text-slate-800">
                  هنوز درسی انتخاب نشده است
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  پس از ثبت درس‌ها، اطلاعات آن‌ها در این قسمت نمایش داده می‌شود.
                </p>

                <NavLink
                  to="/student/enrollment"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  <Icon name="book-open" size={18} />
                  رفتن به انتخاب واحد
                </NavLink>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-right text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-bold">ردیف</th>
                      <th className="px-5 py-4 font-bold">کد درس</th>
                      <th className="px-5 py-4 font-bold">نام درس</th>
                      <th className="px-5 py-4 font-bold">استاد</th>
                      <th className="px-5 py-4 font-bold">تعداد واحد</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {courses.map((course, index) => (
                      <tr
                        key={course.id ?? course.course_id ?? index}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 text-slate-400">
                          {formatNumber(index + 1)}
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-600">
                          {course.code || "—"}
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-800">
                          {course.title || course.name || "بدون عنوان"}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {course.professor || course.teacher || "تعیین نشده"}
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-indigo-50 px-3 py-1.5 font-bold text-indigo-700">
                            {formatNumber(course.units)} واحد
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && courses.length > 0 && (
              <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-500">
                تعداد درس‌ها:{" "}
                <span className="font-bold text-slate-800">
                  {formatNumber(courses.length)}
                </span>
              </div>
            )}
          </section>

          {/* Quick access */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-black text-slate-900">
                دسترسی سریع
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                برای رفتن به بخش موردنظر خود انتخاب کنید.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {menuItems
                .filter((item) => !item.end)
                .map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 transition group-hover:bg-indigo-600 group-hover:text-white">
                        <Icon name={item.icon} size={23} />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-800">
                          {item.label}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          مشاهده و مدیریت اطلاعات
                        </p>
                      </div>
                    </div>

                    <Icon
                      name="chevron-left"
                      size={20}
                      className="shrink-0 text-slate-400 transition group-hover:-translate-x-1 group-hover:text-indigo-600"
                    />
                  </NavLink>
                ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
          سامانه آموزشیار · پنل دانشجویی
        </footer>
      </div>
    </div>
  );
}
