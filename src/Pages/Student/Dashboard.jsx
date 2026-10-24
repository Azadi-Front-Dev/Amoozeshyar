
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  "http://127.0.0.1:8000/api/accounts/student/dashboard/";

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

function StatCard({ label, value, caption, icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{caption}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${color}`}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      const accessToken = localStorage.getItem("access");

      if (!accessToken) {
        navigate("/Login", { replace: true });
        return;
      }

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");
            navigate("/Login", { replace: true });
            return;
          }

          if (response.status === 403) {
            throw new Error("دسترسی به داشبورد دانشجو مجاز نیست.");
          }

          throw new Error(
            result.detail ||
              result.message ||
              `خطا در دریافت اطلاعات (HTTP ${response.status})`
          );
        }

        setData(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "ارتباط با سرور برقرار نشد.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => controller.abort();
  }, [navigate]);

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/Login", { replace: true });
  }

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-slate-50 p-6"
        aria-live="polite"
      >
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-32 rounded-2xl bg-slate-200" />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-50 p-6"
      >
        <section className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="text-4xl" aria-hidden="true">⚠️</div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            دریافت اطلاعات ناموفق بود
          </h1>
          <p role="alert" className="mt-3 text-sm leading-7 text-red-600">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            تلاش مجدد
          </button>
        </section>
      </main>
    );
  }

  if (!data) {
    return (
      <main dir="rtl" className="p-8 text-center text-slate-600">
        اطلاعاتی برای نمایش وجود ندارد.
      </main>
    );
  }

  const person = data.person ?? {};
  const student = data.student ?? null;
  const semester = data.semester ?? null;
  const summary = data.summary ?? {};
  const courses = Array.isArray(data.courses) ? data.courses : [];

  const fullName =
    [person.first_name, person.last_name].filter(Boolean).join(" ") ||
    "دانشجو";

  const courseCount = summary.course_count ?? courses.length;
  const totalUnits = summary.total_units ?? 0;

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-l from-blue-800 to-blue-600 p-6 text-white shadow-sm sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-blue-100">سامانه آموزشیار</p>
            <h1 className="mt-2 text-2xl font-bold">
              خوش آمدی، {fullName}
            </h1>
            <p className="mt-2 text-sm text-blue-100">
              پنل خدمات آموزشی دانشجو
            </p>
          </div>

          <button
            onClick={logout}
            className="self-start rounded-xl border border-white/30 px-4 py-2 text-sm hover:bg-white/10 sm:self-auto"
          >
            خروج از حساب
          </button>
        </header>

        <section
          aria-label="خلاصه وضعیت تحصیلی"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            label="ترم جاری"
            value={semester?.title ?? "نامشخص"}
            caption="نیمسال تحصیلی"
            icon="▦"
            color="bg-amber-50 text-amber-600"
          />
          <StatCard
            label="درس‌های ثبت‌نام‌شده"
            value={courseCount}
            caption="تعداد درس‌های ترم"
            icon="▤"
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="مجموع واحدها"
            value={totalUnits}
            caption="واحدهای ثبت‌شده"
            icon="▧"
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            label="وضعیت دانشجو"
            value={student?.status ?? "نامشخص"}
            caption="وضعیت آموزشی"
            icon="✓"
            color="bg-violet-50 text-violet-600"
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="text-blue-600" aria-hidden="true">▣</span>
              اطلاعات حساب کاربری
            </h2>
            <InfoRow label="نام" value={person.first_name} />
            <InfoRow label="نام خانوادگی" value={person.last_name} />
            <InfoRow label="ایمیل" value={person.email} />
            <InfoRow label="شماره تماس" value={person.phone_number} />
            <InfoRow label="کد ملی" value={person.national_id} />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="text-blue-600" aria-hidden="true">▤</span>
              اطلاعات تحصیلی
            </h2>

            {student ? (
              <>
                <InfoRow
                  label="شماره دانشجویی"
                  value={student.student_number}
                />
                <InfoRow
                  label="رشته تحصیلی"
                  value={student.field_of_study}
                />
                <InfoRow label="سال ورود" value={student.entry_year} />
                <InfoRow label="وضعیت" value={student.status} />
              </>
            ) : (
              <div className="rounded-xl bg-amber-50 p-4 text-sm leading-7 text-amber-800">
                اطلاعات تحصیلی برای این حساب ثبت نشده است. برای رفع مشکل،
                با واحد آموزش تماس بگیر.
              </div>
            )}
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="text-lg font-bold">درس‌های ثبت‌نام‌شده</h2>
              <p className="mt-1 text-sm text-slate-500">
                درس‌های ثبت‌شده در ترم انتخاب‌شده
              </p>
            </div>
            <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              {courseCount} درس
            </span>
          </div>

          {courses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-162 text-right text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">نام درس</th>
                    <th className="px-5 py-4 font-medium">کد درس</th>
                    <th className="px-5 py-4 font-medium">گروه</th>
                    <th className="px-5 py-4 font-medium">واحد</th>
                    <th className="px-5 py-4 font-medium">استاد</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <tr
                      key={course.enrollment_id ?? `${course.course_code}-${index}`}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {course.course_title ?? "بدون عنوان"}
                      </td>
                      <td className="px-5 py-4">
                        {course.course_code ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        {course.section_code ?? "—"}
                      </td>
                      <td className="px-5 py-4">{course.units ?? 0}</td>
                      <td className="px-5 py-4">
                        {course.professor || "تعیین نشده"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl text-slate-400"
                aria-hidden="true"
              >
                ▤
              </div>
              <h3 className="mt-4 font-semibold text-slate-800">
                هنوز درسی برای نمایش وجود ندارد
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                اگر انتخاب واحد انجام داده‌ای، ممکن است وضعیت ثبت‌نام‌ها یا
                ترم فعال در سامانه نیاز به بررسی داشته باشد.
              </p>
            </div>
          )}
        </section>

        <footer className="pb-2 text-center text-xs text-slate-400">
          سامانه آموزشیار · پنل دانشجویی
        </footer>
      </div>
    </main>
  );
}
