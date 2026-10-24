import { useCallback, useEffect, useMemo, useState } from "react";

/* =====================================================
   تنظیمات API و احراز هویت
===================================================== */

const API_BASE_URL = "http://127.0.0.1:8000/api";

function readToken(storage) {
  const directKeys = ["access", "accessToken", "access_token", "token"];

  for (const key of directKeys) {
    const value = storage.getItem(key);

    if (value && value !== "undefined" && value !== "null") {
      return value;
    }
  }

  for (const key of ["authTokens", "tokens", "auth", "user"]) {
    const raw = storage.getItem(key);
    if (!raw) continue;

    try {
      const data = JSON.parse(raw);
      const token = data?.access ?? data?.accessToken ?? data?.access_token;

      if (typeof token === "string" && token) return token;
    } catch {
      // مقدار ذخیره‌شده JSON معتبر نیست.
    }
  }

  return null;
}

function getAccessToken() {
  try {
    return readToken(window.localStorage) ?? readToken(window.sessionStorage);
  } catch {
    return null;
  }
}

async function apiRequest(path, options = {}) {
  const token = getAccessToken();

  if (!token) {
    throw new Error("توکن ورود پیدا نشد. لطفاً دوباره وارد سامانه شوید.");
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  } catch {
    throw new Error("اتصال به سرور برقرار نشد. وضعیت بک‌اند را بررسی کنید.");
  }

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    throw new Error("توکن ورود نامعتبر یا منقضی شده است. دوباره وارد شوید.");
  }

  if (!response.ok) {
    const detail =
      data?.message ??
      data?.detail ??
      Object.values(data ?? {})
        .flat()
        .find((value) => typeof value === "string");

    throw new Error(detail || `خطای سرور: ${response.status}`);
  }

  return { data, status: response.status };
}

async function fetchAvailableCourses() {
  const result = await apiRequest("/registration/student/available-courses/");
  return result.data;
}

async function fetchMyEnrollments() {
  const result = await apiRequest("/registration/student/my-enrollments/");
  return result.data;
}

async function enrollInCourse(classSectionId) {
  return apiRequest("/registration/student/enroll/", {
    method: "POST",
    body: JSON.stringify({
      class_section_id: Number(classSectionId),
    }),
  });
}

async function dropEnrollment(classSectionId) {
  return apiRequest(
    `/registration/student/enroll/${Number(classSectionId)}/drop/`,
    { method: "POST" },
  );
}

/* =====================================================
   تبدیل داده‌ها
===================================================== */

const DAY_NAMES = {
  0: "شنبه",
  1: "یکشنبه",
  2: "دوشنبه",
  3: "سه‌شنبه",
  4: "چهارشنبه",
  5: "پنجشنبه",
  6: "جمعه",
};

function normalizeText(value = "") {
  return String(value)
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .trim()
    .toLowerCase();
}

function formatDay(value) {
  if (typeof value === "number" || /^\d+$/.test(String(value))) {
    return DAY_NAMES[Number(value)] ?? `روز ${value}`;
  }

  const days = {
    saturday: "شنبه",
    sunday: "یکشنبه",
    monday: "دوشنبه",
    tuesday: "سه‌شنبه",
    wednesday: "چهارشنبه",
    thursday: "پنجشنبه",
    friday: "جمعه",
  };

  return days[normalizeText(value)] ?? String(value ?? "نامشخص");
}

function mapApiCourse(item) {
  const schedules = (item.schedules ?? []).map((schedule) => ({
    day: formatDay(schedule.day_of_week ?? schedule.day),
    start: String(schedule.start_time ?? schedule.start ?? "").slice(0, 5),
    end: String(schedule.end_time ?? schedule.end ?? "").slice(0, 5),
    classroom: schedule.classroom ?? null,
  }));

  const classSectionId = Number(
    item.class_section_id ??
      item.classSectionId ??
      item.class_section ??
      item.id,
  );

  return {
    id: classSectionId,
    classSectionId,
    name: item.course_title ?? item.name ?? "بدون عنوان",
    code: String(item.course_code ?? item.code ?? ""),
    professor: item.professor_name ?? "نامشخص",
    department: item.department_name ?? "نامشخص",
    units: Number(item.units ?? 0),
    semester: item.semester_title ?? item.semester ?? "",
    schedules,
    schedule: schedules.length
      ? schedules
          .map(
            (schedule) =>
              `${schedule.day}، ${schedule.start} تا ${schedule.end}${
                schedule.classroom ? `، کلاس ${schedule.classroom}` : ""
              }`,
          )
          .join(" | ")
      : "زمان‌بندی ثبت نشده",
    capacity: Number(item.capacity ?? 0),
    enrolled: Number(item.enrolled_count ?? item.enrolled ?? 0),
    remainingCapacity: Number(
      item.remaining_capacity ??
        item.remainingCapacity ??
        Math.max(
          0,
          Number(item.capacity ?? 0) -
            Number(item.enrolled_count ?? item.enrolled ?? 0),
        ),
    ),
    status: item.status ?? "ENROLLED",
    registered: true,
  };
}

function toMinutes(time) {
  if (!time) return null;

  const [hours, minutes] = String(time).split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
}

function getSchedules(course) {
  return course.schedules ?? [];
}

function hasScheduleConflict(course, selectedCourses) {
  return selectedCourses.some((selected) =>
    getSchedules(course).some((current) =>
      getSchedules(selected).some((previous) => {
        if (current.day !== previous.day) return false;

        const startA = toMinutes(current.start);
        const endA = toMinutes(current.end);
        const startB = toMinutes(previous.start);
        const endB = toMinutes(previous.end);

        if ([startA, endA, startB, endB].some((x) => x === null)) {
          return false;
        }

        return startA < endB && endA > startB;
      }),
    ),
  );
}

/* =====================================================
   کامپوننت انتخاب واحد
===================================================== */

export default function Enrollment() {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);
  const [semesterTitle, setSemesterTitle] = useState("");
  const [notice, setNotice] = useState(null);

  const totalUnits = useMemo(
    () => selectedCourses.reduce((sum, course) => sum + course.units, 0),
    [selectedCourses],
  );

  const filteredCourses = useMemo(() => {
    const query = normalizeText(search);

    return availableCourses.filter((course) => {
      const alreadySelected = selectedCourses.some(
        (item) => item.id === course.id,
      );

      const matches =
        !query ||
        normalizeText(course.name).includes(query) ||
        normalizeText(course.code).includes(query) ||
        normalizeText(course.professor).includes(query);

      return matches && !alreadySelected;
    });
  }, [availableCourses, selectedCourses, search]);

  /* -------------------- دریافت اطلاعات از سرور -------------------- */

  const loadData = useCallback(async ({ showNotice = false } = {}) => {
    setIsLoading(true);

    try {
      const [availableResult, enrollmentResult] = await Promise.allSettled([
        fetchAvailableCourses(),
        fetchMyEnrollments(),
      ]);

      if (availableResult.status === "rejected") {
        throw availableResult.reason;
      }

      const availableData = availableResult.value;

      setEnrollmentOpen(Boolean(availableData.enrollment_open));
      setSemesterTitle(availableData.semester ?? "");
      setAvailableCourses((availableData.results ?? []).map(mapApiCourse));

      if (enrollmentResult.status === "fulfilled") {
        const enrollmentData = enrollmentResult.value;
        const rows = enrollmentData.results ?? enrollmentData.enrollments ?? [];

        setSelectedCourses(rows.map(mapApiCourse));
      } else {
        // فهرست قبلی را به علت خطای موقت API پاک نکن.
        if (showNotice) {
          setNotice({
            type: "error",
            text: "دروس قابل انتخاب به‌روز شدند، اما دریافت فهرست ثبت‌شده‌ها ناموفق بود. مسیر my-enrollments را بررسی کنید.",
          });
        }
      }

      if (!availableData.enrollment_open) {
        setNotice({
          type: "warning",
          text:
            availableData.message ??
            "در حال حاضر انتخاب واحد فعالی وجود ندارد.",
        });
      } else if (showNotice && enrollmentResult.status === "fulfilled") {
        setNotice({
          type: "success",
          text: "فهرست دروس با موفقیت به‌روز شد.",
        });
      } else if (!showNotice) {
        setNotice(null);
      }
    } catch (error) {
      setNotice({
        type: "error",
        text: error.message || "دریافت اطلاعات ناموفق بود.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* -------------------- ثبت درس -------------------- */

  async function addCourse(course) {
    setNotice(null);

    if (!enrollmentOpen) {
      setNotice({
        type: "warning",
        text: "انتخاب واحد در حال حاضر فعال نیست.",
      });
      return;
    }

    if (submittingId !== null) return;

    if (selectedCourses.some((item) => item.id === course.id)) {
      setNotice({
        type: "warning",
        text: "این گروه قبلاً انتخاب شده است.",
      });
      return;
    }

    if (
      selectedCourses.some((item) => item.code && item.code === course.code)
    ) {
      setNotice({
        type: "warning",
        text: "این درس را قبلاً از گروه دیگری انتخاب کرده‌اید.",
      });
      return;
    }

    if (course.remainingCapacity <= 0) {
      setNotice({
        type: "error",
        text: "ظرفیت این گروه تکمیل شده است.",
      });
      return;
    }

    if (totalUnits + course.units > 20) {
      setNotice({
        type: "warning",
        text: "مجموع واحدها نمی‌تواند بیشتر از ۲۰ باشد.",
      });
      return;
    }

    if (hasScheduleConflict(course, selectedCourses)) {
      setNotice({
        type: "error",
        text: "زمان این درس با درس‌های انتخاب‌شده تداخل دارد.",
      });
      return;
    }

    setSubmittingId(course.id);

    try {
      const result = await enrollInCourse(course.classSectionId);

      // پاسخ موفق در ثبت اولیه 201 و در فعال‌سازی مجدد ممکن است 200 باشد.
      if (
        ![200, 201].includes(result.status) ||
        result.data?.success !== true
      ) {
        throw new Error(result.data?.message ?? "سرور ثبت درس را تأیید نکرد.");
      }

      setIsSearchOpen(false);

      // فهرست هر دو بخش را از دیتابیس تازه‌سازی کن.
      await loadData();

      setNotice({
        type: "success",
        text: `درس ${course.name} با موفقیت ثبت شد .`,
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: `  برای انتخاب درس  ${course.name}    
            گذراندن  درس ${error.message} الزامی است!
        `,
      });
    } finally {
      setSubmittingId(null);
    }
  }

  /* -------------------- لغو انتخاب واحد -------------------- */

  async function removeCourse(course) {
    const sectionId = course.classSectionId ?? course.id;

    if (!sectionId || submittingId !== null) {
      if (!sectionId) {
        setNotice({
          type: "error",
          text: "شناسه گروه درسی پیدا نشد.",
        });
      }
      return;
    }

    const confirmed = window.confirm(
      `آیا از لغو درس «${course.name}» مطمئن هستید؟`,
    );

    if (!confirmed) return;

    setNotice(null);
    setSubmittingId(Number(sectionId));

    try {
      const response = await dropEnrollment(sectionId);

      if (response.data?.success !== true) {
        throw new Error(response.data?.message ?? "لغو انتخاب واحد انجام نشد.");
      }

      // به جای حذف صرفاً محلی، فهرست را از سرور دوباره بخوان.
      await loadData();

      setNotice({
        type: "success",
        text: response.data.message || `درس «${course.name}» لغو شد.`,
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: `لغو درس ناموفق بود: ${error.message}`,
      });
    } finally {
      setSubmittingId(null);
    }
  }

  /* -------------------- رابط کاربری -------------------- */

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-indigo-600">سامانه آموزشیار</p>
              <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
                انتخاب واحد
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {semesterTitle
                  ? `نیمسال فعال: ${semesterTitle}`
                  : "مدیریت دروس انتخابی"}
              </p>
            </div>

            <button
              type="button"
              disabled={isLoading || !enrollmentOpen}
              onClick={() => setIsSearchOpen(true)}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              جست و جوی دروس
            </button>
          </div>
        </header>

        {notice && (
          <div
            role="status"
            className={`rounded-xl border p-4 text-sm leading-7 ${
              notice.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : notice.type === "warning"
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <span>{notice.text}</span>
              <button
                type="button"
                onClick={() => setNotice(null)}
                aria-label="بستن پیام"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p>تعداد واحد اخذ شده</p>
            <h2>
              {selectedCourses.reduce(
                (total, course) => total + (Number(course.units) || 0),
                0,
              )}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">دروس برداشته‌ شده</p>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {selectedCourses.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">مجموع  واحد ها</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">
              {totalUnits} از ۲۰
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex-center gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
            <div className="flex-col-center">
              <h2 className="font-bold text-slate-800">
                دروس انتخاب شده در ترم جاری
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                فقط درس‌ هایی که با موفقیت ثبت شده نمایش داده می شود.
              </p>
            </div>

            {/* <button
              type="button"
              onClick={() => loadData({ showNotice: true })}
              disabled={isLoading || submittingId !== null}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              {isLoading ? "در حال به‌روزرسانی..." : "به‌روزرسانی"}
            </button> */}
          </div>

          <div className=" w-full flex-col-center space-y-3 p-4 sm:p-5">
            {isLoading ? (
              <p className="py-8 text-center text-slate-500">
                در حال دریافت اطلاعات از سرور...
              </p>
            ) : selectedCourses.length === 0 ? (
              <div className="py-10 text-center">
                <p className="font-semibold text-slate-700">
                  تاکنون هیچ درسی انتخاب نکردید !
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  برای افزودن درس، جست‌ و جوی دروس را باز کنید.
                </p>
              </div>
            ) : (
              selectedCourses.map((course) => (
                <article
                  key={course.id}
                  className="w-full rounded-xl border border-slate-200 p-4"
                >
                  <div className="w-full flex items-center justify-between  gap-5 sm:flex-row sm:items-start">
                    <div className="flex w-[60%] items-center justify-evenly">
                      <h3 className="font-bold text-slate-800">
                        {course.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        کد: {course.code} · {course.units} واحد
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {course.schedule}
                      </p>
                      <span className="mt-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        انتخاب شده
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={submittingId !== null}
                      onClick={() => removeCourse(course)}
                      className="rounded-lg border text-red-500 border-red-500 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
                    >
                      حذف درس
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-6">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-search-title"
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <header className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
              <h2 id="course-search-title" className="font-bold text-slate-800">
                جست‌وجو و افزودن درس
              </h2>

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="rounded-lg px-3 py-1 text-xl hover:bg-slate-100"
                aria-label="بستن"
              >
                ×
              </button>
            </header>

            <div className="border-b border-slate-200 p-4">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="نام درس یا کد درس..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-3 overflow-y-auto p-4">
              {isLoading ? (
                <p className="py-6 text-center text-slate-500">
                  در حال دریافت دروس...
                </p>
              ) : filteredCourses.length === 0 ? (
                <p className="py-6 text-center text-slate-500">
                  درسی برای نمایش وجود ندارد.
                </p>
              ) : (
                filteredCourses.map((course) => (
                  <article
                    key={course.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <h3 className="font-bold text-slate-800">
                          {course.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          کد {course.code} · {course.units} واحد
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {course.schedule}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          ظرفیت باقی‌مانده: {course.remainingCapacity}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={
                          submittingId !== null ||
                          !enrollmentOpen ||
                          course.remainingCapacity <= 0
                        }
                        onClick={() => addCourse(course)}
                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {submittingId === course.id
                          ? "در حال ثبت..."
                          : "ثبت و افزودن"}
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            <footer className="border-t border-slate-200 p-4 text-left">
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                پایان جست‌وجو
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}
