
import { useMemo, useState } from "react";
import {
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineUser,
  HiOutlineBookOpen,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
  HiOutlineAcademicCap,
} from "react-icons/hi2";

const DAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
];

const TIME_SLOTS = [
  { start: "08:00", end: "10:00" },
  { start: "10:00", end: "12:00" },
  { start: "12:00", end: "14:00" },
  { start: "14:00", end: "16:00" },
  { start: "16:00", end: "18:00" },
];

const COURSES = [
  {
    id: 1,
    name: "برنامه‌نویسی پیشرفته",
    code: "CS204",
    day: "شنبه",
    slot: 0,
    professor: "دکتر محمدی",
    location: "ساختمان فنی، کلاس ۲۰۴",
    type: "حضوری",
    color: "blue",
  },
  {
    id: 2,
    name: "پایگاه داده",
    code: "CS310",
    day: "شنبه",
    slot: 2,
    professor: "دکتر احمدی",
    location: "ساختمان فنی، کلاس ۱۰۲",
    type: "حضوری",
    color: "violet",
  },
  {
    id: 3,
    name: "ساختمان داده",
    code: "CS202",
    day: "یکشنبه",
    slot: 1,
    professor: "مهندس رضایی",
    location: "ساختمان آموزشی، کلاس ۳۰۱",
    type: "حضوری",
    color: "emerald",
  },
  {
    id: 4,
    name: "ریاضیات گسسته",
    code: "MA210",
    day: "یکشنبه",
    slot: 3,
    professor: "دکتر کریمی",
    location: "ساختمان علوم، کلاس ۱۰۵",
    type: "حضوری",
    color: "amber",
  },
  {
    id: 5,
    name: "مهندسی نرم‌افزار",
    code: "CS320",
    day: "دوشنبه",
    slot: 0,
    professor: "دکتر محمدی",
    location: "ساختمان فنی، کلاس ۲۰۶",
    type: "حضوری",
    color: "rose",
  },

  {
    id: 7,
    name: "زبان تخصصی",
    code: "EN205",
    day: "چهارشنبه",
    slot: 1,
    professor: "استاد حسینی",
    location: "ساختمان عمومی، کلاس ۴۰۲",
    type: "حضوری",
    color: "cyan",
  },
  {
    id: 8,
    name: "برنامه‌نویسی پیشرفته",
    code: "CS204",
    day: "چهارشنبه",
    slot: 3,
    professor: "دکتر محمدی",
    location: "آزمایشگاه کامپیوتر ۲",
    type: "آزمایشگاه",
    color: "blue",
  },
];

const COLOR_STYLES = {
  blue: {
    card: "border-blue-200 bg-blue-50/80",
    title: "text-blue-900",
    detail: "text-blue-700",
    dot: "bg-blue-500",
  },
  violet: {
    card: "border-violet-200 bg-violet-50/80",
    title: "text-violet-900",
    detail: "text-violet-700",
    dot: "bg-violet-500",
  },
  emerald: {
    card: "border-emerald-200 bg-emerald-50/80",
    title: "text-emerald-900",
    detail: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  amber: {
    card: "border-amber-200 bg-amber-50/80",
    title: "text-amber-900",
    detail: "text-amber-700",
    dot: "bg-amber-500",
  },
  rose: {
    card: "border-rose-200 bg-rose-50/80",
    title: "text-rose-900",
    detail: "text-rose-700",
    dot: "bg-rose-500",
  },
  cyan: {
    card: "border-cyan-200 bg-cyan-50/80",
    title: "text-cyan-900",
    detail: "text-cyan-700",
    dot: "bg-cyan-500",
  },
};

function CourseCard({ course }) {
  const style = COLOR_STYLES[course.color] || COLOR_STYLES.blue;
  const time = TIME_SLOTS[course.slot];

  return (
    <div
      className={`h-full min-h-[116px] rounded-xl border p-3 transition hover:shadow-sm ${style.card}`}
    >
      <div className="mb-2 flex items-start gap-2">
        <span
          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${style.dot}`}
        />

        <p className={`text-sm font-bold leading-6 ${style.title}`}>
          {course.name}
        </p>
      </div>

      <div className={`space-y-2 text-xs ${style.detail}`}>
        <div className="flex items-center gap-1.5">
          <HiOutlineClock className="h-4 w-4 shrink-0" />
          <span dir="ltr">
            {time.start} – {time.end}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <HiOutlineUser className="h-4 w-4 shrink-0" />
          <span>{course.professor}</span>
        </div>

        <div className="flex items-start gap-1.5">
          <HiOutlineMapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="leading-5">{course.location}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium text-gray-600">
          {course.code}
        </span>

        <span className="rounded-md bg-white/80 px-2 py-1 text-[10px] text-gray-600">
          {course.type}
        </span>
      </div>
    </div>
  );
}

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState("همه روزها");
  const [weekOffset, setWeekOffset] = useState(0);

  const visibleCourses = useMemo(() => {
    return COURSES.filter(
      (course) =>
        selectedDay === "همه روزها" || course.day === selectedDay
    );
  }, [selectedDay]);

  const courseCount = visibleCourses.length;
  const dayCount = new Set(visibleCourses.map((course) => course.day)).size;
  const firstClass = visibleCourses.length
    ? [...visibleCourses].sort(
        (a, b) =>
          DAYS.indexOf(a.day) - DAYS.indexOf(b.day) ||
          a.slot - b.slot
      )[0]
    : null;

  const weekLabel =
    weekOffset === 0
      ? "هفته جاری"
      : weekOffset > 0
        ? `${weekOffset} هفته بعد`
        : `${Math.abs(weekOffset)} هفته قبل`;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <HiOutlineAcademicCap className="h-5 w-5" />
              <span>پنل دانشجویی</span>
              <span>/</span>
              <span>برنامه آموزشی</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">
              برنامه هفتگی
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              زمان‌بندی کلاس‌ها، اساتید و محل برگزاری دروس این نیمسال
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm sm:self-auto">
            <button
              type="button"
              onClick={() => setWeekOffset((value) => value - 1)}
              aria-label="هفته قبل"
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            >
              <HiOutlineChevronRight className="h-5 w-5" />
            </button>

            <div className="min-w-24 px-2 text-center">
              <span className="block text-sm font-bold text-slate-700">
                {weekLabel}
              </span>
              <span className="mt-1 block text-[11px] text-slate-400">
                نیمسال جاری
              </span>
            </div>

            <button
              type="button"
              onClick={() => setWeekOffset((value) => value + 1)}
              aria-label="هفته بعد"
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            >
              <HiOutlineChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <HiOutlineBookOpen className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm text-slate-500">تعداد جلسات کلاس</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-800">
                {courseCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <HiOutlineCalendarDays className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm text-slate-500">روزهای دارای کلاس</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-800">
                {dayCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <HiOutlineClock className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-sm text-slate-500">اولین کلاس هفته</p>
              <p className="mt-1 truncate text-base font-bold text-slate-800">
                {firstClass ? firstClass.name : "کلاسی ثبت نشده"}
              </p>
              {firstClass && (
                <p className="mt-1 text-xs text-slate-500">
                  {firstClass.day}، {TIME_SLOTS[firstClass.slot].start}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-800">
                جدول زمان‌بندی کلاس‌ها
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                برای مشاهده جزئیات هر درس، اطلاعات کارت آن را بررسی کنید.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="schedule-day" className="text-sm text-slate-500">
                نمایش:
              </label>

              <select
                id="schedule-day"
                value={selectedDay}
                onChange={(event) => setSelectedDay(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="همه روزها">همه روزها</option>
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                چاپ برنامه
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1050px] p-4 sm:p-5">
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns:
                    "82px repeat(6, minmax(140px, 1fr))",
                }}
              >
                <div className="flex min-h-14 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
                  ساعت
                </div>

                {DAYS.map((day) => (
                  <div
                    key={day}
                    className={`flex min-h-14 items-center justify-center rounded-xl text-sm font-bold ${
                      selectedDay === day
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {day}
                  </div>
                ))}

                {TIME_SLOTS.map((slot, slotIndex) => (
                  <div key={slot.start} className="contents">
                    <div className="flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-1 text-center">
                      <HiOutlineClock className="h-4 w-4 text-slate-400" />
                      <span
                        dir="ltr"
                        className="text-xs font-semibold text-slate-700"
                      >
                        {slot.start}
                      </span>
                      <span className="text-[10px] text-slate-400">تا</span>
                      <span
                        dir="ltr"
                        className="text-xs text-slate-500"
                      >
                        {slot.end}
                      </span>
                    </div>

                    {DAYS.map((day) => {
                      const course = visibleCourses.find(
                        (item) =>
                          item.day === day && item.slot === slotIndex
                      );

                      return (
                        <div
                          key={`${day}-${slot.start}`}
                          className="min-h-[150px] rounded-xl border border-slate-100 bg-white p-1.5"
                        >
                          {course ? (
                            <CourseCard course={course} />
                          ) : (
                            <div className="flex h-full min-h-[138px] items-center justify-center rounded-lg bg-slate-50/70">
                              <span className="text-xs text-slate-300">
                                —
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center">
            <HiOutlineCalendarDays className="h-5 w-5 shrink-0 text-slate-400" />
            <p className="text-xs leading-6 text-slate-500">
              این برنامه با اطلاعات نمونه نمایش داده می‌شود. زمان و محل واقعی
              کلاس‌ها باید از اطلاعات انتخاب واحد دانشجو دریافت شود.
            </p>
          </div>
        </section>
      </div>


    </div>
  );
}
