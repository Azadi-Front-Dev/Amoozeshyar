
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL =
  "http://127.0.0.1:8000/api/accounts/professor/dashboard/";

const LOGIN_ROUTE = "/login";

const DAY_NAMES = {
  0: "یکشنبه",
  1: "دوشنبه",
  2: "سه‌شنبه",
  3: "چهارشنبه",
  4: "پنجشنبه",
  5: "جمعه",
  6: "شنبه",
};

const quickActions = [
  {
    id: "students",
    icon: "♙",
    title: "فهرست دانشجویان",
    description: "مشاهده دانشجویان هر گروه درسی",
    color: "blue",
  },
  {
    id: "grades",
    icon: "✓",
    title: "ثبت و مدیریت نمرات",
    description: "مدیریت نمرات میان‌ترم و پایان‌ترم",
    color: "emerald",
  },
  {
    id: "attendance",
    icon: "▦",
    title: "حضور و غیاب",
    description: "ثبت وضعیت حضور دانشجویان",
    color: "violet",
  },
  {
    id: "schedule",
    icon: "◷",
    title: "برنامه کلاسی",
    description: "مشاهده زمان و محل تشکیل کلاس‌ها",
    color: "amber",
  },
];

const colorStyles = {
  blue: "bg-blue-50 text-blue-700",
  emerald: "bg-emerald-50 text-emerald-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
};

function SectionTitle({ title, description, action }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function StatCard({ title, value, caption, icon, color }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {caption}
          </p>
        </div>
        <span
          aria-hidden="true"
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${color}`}
        >
          {icon}
        </span>
      </div>
    </article>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <span className="shrink-0 text-sm text-slate-500">{label}</span>
      <span className="break-words text-left text-sm font-medium text-slate-800">
        {value ?? "ثبت نشده"}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  const isFull = status === "ظرفیت تکمیل";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
        isFull
          ? "bg-amber-50 text-amber-700"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {status || "ثبت نشده"}
    </span>
  );
}

function PanelCard({ children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function formatTime(value) {
  if (!value) return "—";
  return String(value).slice(0, 5);
}

function getDayName(value) {
  if (value === null || value === undefined || value === "") {
    return "تعیین نشده";
  }

  return DAY_NAMES[value] ?? String(value);
}

function getCourseStatus(course) {
  const students = Number(course.students) || 0;
  const capacity = Number(course.capacity) || 0;

  if (capacity > 0 && students >= capacity) {
    return "ظرفیت تکمیل";
  }

  return course.status === "CLOSED"
    ? "بسته"
    : "در حال برگزاری";
}

function getErrorMessage(error) {
  if (!error.response) {
    return "ارتباط با سرور برقرار نشد. اتصال بک‌اند را بررسی کنید.";
  }

  if (error.response.status === 401 || error.response.status === 403) {
    return "نشست شما معتبر نیست یا دسترسی استاد برای این حساب فعال نشده است.";
  }

  if (error.response.status === 404) {
    return "مسیر API داشبورد استاد پیدا نشد. آدرس و مسیرهای بک‌اند را بررسی کنید.";
  }

  return (
    error.response.data?.detail ||
    error.response.data?.message ||
    "دریافت اطلاعات داشبورد با خطا مواجه شد."
  );
}

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      const accessToken = localStorage.getItem("access");

      if (!accessToken) {
        navigate(LOGIN_ROUTE, { replace: true });
        return;
      }

      setIsLoading(true);
      setLoadError("");

      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!cancelled) {
          setDashboard(response.data);
        }
      } catch (error) {
        if (cancelled) return;

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");

          navigate(LOGIN_ROUTE, { replace: true });
          return;
        }

        setLoadError(getErrorMessage(error));
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const profile = dashboard?.profile ?? {};
  const semester = dashboard?.semester ?? null;
  const rawCourses = dashboard?.courses ?? [];
  const rawSchedule = dashboard?.schedule ?? [];

  const courses = useMemo(() => {
    return rawCourses.map((course) => ({
      id: course.class_section_id ?? course.id,
      classSectionId: course.class_section_id ?? course.id,
      code: course.course_code ?? course.code ?? "—",
      title: course.course_title ?? course.title ?? "بدون عنوان",
      section: course.section_code ?? course.section ?? "—",
      units: Number(course.units) || 0,
      students: Number(course.student_count ?? course.students) || 0,
      capacity: Number(course.capacity) || 0,
      status: course.status,
    }));
  }, [rawCourses]);

  const weeklySchedule = useMemo(() => {
    return rawSchedule.map((item, index) => ({
      id: item.schedule_id ?? item.id ?? index,
      classSectionId: item.class_section_id,
      day: getDayName(item.day_of_week),
      start: formatTime(item.start_time ?? item.start),
      end: formatTime(item.end_time ?? item.end),
      course: item.course_title ?? item.course ?? "بدون عنوان",
      building: item.building ?? "ثبت نشده",
      room: item.room_number
        ? `کلاس ${item.room_number}`
        : item.room ?? "ثبت نشده",
    }));
  }, [rawSchedule]);

  const coursesWithSchedule = useMemo(() => {
    return courses.map((course) => {
      const firstSession = weeklySchedule.find(
        (item) => item.classSectionId === course.classSectionId,
      );

      return {
        ...course,
        day: firstSession?.day ?? "تعیین نشده",
        start: firstSession?.start ?? "—",
        end: firstSession?.end ?? "—",
        building: firstSession?.building ?? "ثبت نشده",
        room: firstSession?.room ?? "ثبت نشده",
        status: getCourseStatus(course),
      };
    });
  }, [courses, weeklySchedule]);

  const totalStudents = useMemo(() => {
    if (dashboard?.summary?.student_count !== undefined) {
      return Number(dashboard.summary.student_count) || 0;
    }

    return courses.reduce((sum, course) => sum + course.students, 0);
  }, [dashboard, courses]);

  const totalUnits = useMemo(
    () => courses.reduce((sum, course) => sum + course.units, 0),
    [courses],
  );

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fa");

    if (!query) return coursesWithSchedule;

    return coursesWithSchedule.filter((course) =>
      [course.title, String(course.code), String(course.section)].some(
        (value) => value.toLocaleLowerCase("fa").includes(query),
      ),
    );
  }, [coursesWithSchedule, search]);

  function handleQuickAction(action) {
    if (action.id === "schedule") {
      document.getElementById("teacher-schedule")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setNotice("");
      return;
    }

    const messages = {
      students:
        "برای مشاهده فهرست دانشجویان، API مربوط به دانشجویان هر گروه درسی باید پیاده‌سازی شود.",
      grades:
        "برای ثبت و مدیریت نمرات، ابتدا API و سطح دسترسی مربوط به نمرات باید پیاده‌سازی شود.",
      attendance:
        "برای ثبت حضور و غیاب، API مربوط به جلسات و وضعیت حضور دانشجویان باید پیاده‌سازی شود.",
    };

    setNotice(messages[action.id] || "");
  }

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    navigate(LOGIN_ROUTE, { replace: true });
  }

  if (isLoading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-800"
      >
        <div
          role="status"
          className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
        >
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
          <p className="mt-4 text-sm text-slate-600">
            در حال دریافت اطلاعات داشبورد استاد...
          </p>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-800"
      >
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-bold text-slate-900">
            دریافت اطلاعات ناموفق بود
          </h1>
          <p role="alert" className="mt-3 text-sm leading-7 text-slate-600">
            {loadError}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
            >
              تلاش مجدد
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              خروج از حساب
            </button>
          </div>
        </div>
      </main>
    );
  }

  const firstName = profile.first_name ?? "";
  const lastName = profile.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || "استاد گرامی";
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}` || "ا";

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* سربرگ پنل استاد */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-indigo-950 via-blue-900 to-blue-700 p-6 text-white shadow-sm sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 -top-16 h-56 w-56 rounded-full border-[32px] border-white/5"
          />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <span className="text-lg" aria-hidden="true">
                  ◈
                </span>
                سامانه آموزشیار
                <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs">
                  پنل استاد
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
                خوش آمدید، {fullName}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-blue-100">
                مدیریت فعالیت‌های آموزشی، درس‌های ارائه‌شده و برنامه کلاسی شما
                در یک نگاه.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-blue-100">
                <span className="rounded-lg bg-white/10 px-3 py-2">
                  کد استاد: {profile.personnel_code ?? "ثبت نشده"}
                </span>
                <span className="rounded-lg bg-white/10 px-3 py-2">
                  {semester?.title ?? "ترم فعال تعریف نشده"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="relative self-start rounded-xl border border-white/30 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 sm:self-center"
            >
              خروج از حساب
            </button>
          </div>
        </header>

        {notice && (
          <div
            role="status"
            className="flex items-start justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-blue-800"
          >
            <p>{notice}</p>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="بستن پیام"
              className="shrink-0 rounded-lg px-2 py-1 text-lg hover:bg-blue-100"
            >
              ×
            </button>
          </div>
        )}

        {/* کارت‌های آماری */}
        <section
          aria-label="خلاصه فعالیت‌های آموزشی"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            title="درس‌های ارائه‌شده"
            value={courses.length}
            caption="درس در نیمسال جاری"
            icon="▤"
            color="bg-blue-50 text-blue-700"
          />
          <StatCard
            title="دانشجویان"
            value={totalStudents}
            caption="مجموع ثبت‌نام‌ها در گروه‌ها"
            icon="♙"
            color="bg-violet-50 text-violet-700"
          />
          <StatCard
            title="مجموع واحدهای تدریس"
            value={totalUnits}
            caption="واحد درسی ارائه‌شده"
            icon="▦"
            color="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            title="جلسات برنامه‌ریزی‌شده"
            value={weeklySchedule.length}
            caption="جلسه در برنامه هفتگی"
            icon="◷"
            color="bg-amber-50 text-amber-700"
          />
        </section>

        {/* دسترسی سریع */}
        <PanelCard>
          <SectionTitle
            title="دسترسی سریع"
            description="ابزارهای پرکاربرد برای مدیریت فعالیت‌های آموزشی"
          />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleQuickAction(action)}
                className="group flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 p-4 text-right transition hover:border-blue-200 hover:bg-blue-50/40"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${colorStyles[action.color]}`}
                >
                  {action.icon}
                </span>

                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-800 transition group-hover:text-blue-700">
                    {action.title}
                  </span>
                  <span className="mt-1 block text-xs leading-6 text-slate-500">
                    {action.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </PanelCard>

        {/* جدول درس‌ها */}
        <PanelCard className="overflow-hidden p-0">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">درس‌های من</h2>
              <p className="mt-1 text-sm text-slate-500">
                درس‌ها، زمان و مکان برگزاری گروه‌های درسی
              </p>
            </div>

            <label className="relative block w-full sm:max-w-xs">
              <span className="sr-only">جست‌وجوی درس</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                ⌕
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="جست‌وجوی نام یا کد درس..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-9 pl-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-right text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-4 font-semibold">نام درس</th>
                  <th scope="col" className="px-5 py-4 font-semibold">کد درس</th>
                  <th scope="col" className="px-5 py-4 font-semibold">گروه</th>
                  <th scope="col" className="px-5 py-4 font-semibold">روز برگزاری</th>
                  <th scope="col" className="px-5 py-4 font-semibold">ساعت شروع</th>
                  <th scope="col" className="px-5 py-4 font-semibold">ساعت پایان</th>
                  <th scope="col" className="px-5 py-4 font-semibold">ساختمان</th>
                  <th scope="col" className="px-5 py-4 font-semibold">کلاس / سالن</th>
                  <th scope="col" className="px-5 py-4 font-semibold">واحد</th>
                  <th scope="col" className="px-5 py-4 font-semibold">دانشجویان</th>
                  <th scope="col" className="px-5 py-4 font-semibold">ظرفیت</th>
                  <th scope="col" className="px-5 py-4 font-semibold">وضعیت</th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                      {course.title}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {course.code}
                    </td>
                    <td className="px-5 py-4">{course.section}</td>
                    <td className="whitespace-nowrap px-5 py-4">{course.day}</td>
                    <td className="whitespace-nowrap px-5 py-4" dir="ltr">
                      {course.start}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4" dir="ltr">
                      {course.end}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {course.building}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {course.room}
                    </td>
                    <td className="px-5 py-4">{course.units}</td>
                    <td className="px-5 py-4">{course.students}</td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span>
                          {course.students}/{course.capacity}
                        </span>
                        <div
                          className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-100"
                          role="progressbar"
                          aria-label={`ظرفیت درس ${course.title}`}
                          aria-valuemin={0}
                          aria-valuemax={course.capacity}
                          aria-valuenow={Math.min(
                            course.students,
                            course.capacity,
                          )}
                        >
                          <div
                            className={`h-full rounded-full ${
                              course.capacity > 0 &&
                              course.students >= course.capacity
                                ? "bg-amber-500"
                                : "bg-blue-500"
                            }`}
                            style={{
                              width: `${
                                course.capacity > 0
                                  ? Math.min(
                                      (course.students / course.capacity) * 100,
                                      100,
                                    )
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={course.status} />
                    </td>
                  </tr>
                ))}

                {filteredCourses.length === 0 && (
                  <tr>
                    <td
                      colSpan={12}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      درسی مطابق عبارت جست‌وجو پیدا نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500 sm:px-6">
            تعداد گروه‌های نمایش‌داده‌شده: {filteredCourses.length}
          </div>
        </PanelCard>

        {/* اطلاعات استاد و برنامه هفتگی */}
        <div className="grid scroll-mt-6 gap-6 lg:grid-cols-2">
          <PanelCard>
            <SectionTitle
              title="اطلاعات استاد"
              description="مشخصات حساب و اطلاعات سازمانی"
            />

            <div className="mb-5 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-bold text-blue-800">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900">{fullName}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {profile.academic_rank ?? "مرتبه علمی ثبت نشده"} · کد{" "}
                  {profile.personnel_code ?? "ثبت نشده"}
                </p>
              </div>
            </div>

            <InfoRow label="کد ملی" value={profile.national_id} />
            <InfoRow label="دانشکده" value={profile.faculty} />
            <InfoRow label="گروه آموزشی" value={profile.department} />
            <InfoRow label="مرتبه علمی" value={profile.academic_rank} />
            <InfoRow label="نوع استخدام" value={profile.employment_type} />
            <InfoRow label="ایمیل سازمانی" value={profile.email} />
            <InfoRow label="شماره تماس" value={profile.phone_number} />
            <InfoRow label="محل کار" value={profile.office} />
            <InfoRow
              label="سال تحصیلی"
              value={semester?.academic_year}
            />
          </PanelCard>

          <PanelCard>
            <div id="teacher-schedule" className="scroll-mt-6">
              <SectionTitle
                title="برنامه هفتگی کلاس‌ها"
                description="روز، ساعت، ساختمان و محل برگزاری هر جلسه"
              />
            </div>

            {weeklySchedule.length > 0 ? (
              <div className="space-y-3">
                {weeklySchedule.map((item) => (
                  <article
                    key={item.id}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-blue-100 hover:bg-slate-50"
                  >
                    <div className="flex w-[76px] shrink-0 flex-col items-center rounded-lg bg-blue-50 px-2 py-3 text-blue-800">
                      <span className="text-xs font-semibold">
                        {item.day}
                      </span>
                      <span className="mt-2 text-xs" dir="ltr">
                        {item.start}
                      </span>
                      <span className="mt-1 text-[10px] text-blue-600">
                        تا
                      </span>
                      <span className="mt-1 text-xs" dir="ltr">
                        {item.end}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 py-1">
                      <h3 className="font-semibold leading-6 text-slate-800">
                        {item.course}
                      </h3>
                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        <span aria-hidden="true">⌖ </span>
                        {item.building}، {item.room}
                      </p>
                    </div>

                    <span
                      aria-hidden="true"
                      className="mt-1 text-slate-300"
                    >
                      ◷
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-500">
                برای نیمسال فعال، برنامه کلاسی ثبت نشده است.
              </p>
            )}
          </PanelCard>
        </div>

        <footer className="pb-2 text-center text-xs leading-6 text-slate-400">
          سامانه آموزشیار · پنل استاد
        </footer>
      </div>
    </main>
  );
}
