
import { useEffect, useState } from "react";

import {
  HiOutlineUserCircle,
  HiOutlineIdentification,
  HiOutlineAcademicCap,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineCalendarDays,
  HiOutlineBuildingLibrary,
  HiOutlineClipboardDocumentList,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

// آدرس API بک‌اند
const PROFILE_API_URL =
  "http://127.0.0.1:8000/api/accounts/student/profile/";

// تبدیل تاریخ میلادی دریافتی از API به تاریخ شمسی
function formatPersianDate(value) {
  if (!value) return null;

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) return value;

  const [, year, month, day] = match;

  // استفاده از ظهر برای جلوگیری از اختلاف تاریخ ناشی از timezone
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    12
  );

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// تبدیل مقادیر رایج انگلیسی به عنوان فارسی
function translateValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const translations = {
    ACTIVE: "فعال",
    INACTIVE: "غیرفعال",
    ENROLLED: "ثبت‌نام‌شده",
    GRADUATED: "فارغ‌التحصیل",
    SUSPENDED: "محروم از تحصیل",
    MALE: "مرد",
    FEMALE: "زن",
    M: "مرد",
    F: "زن",
  };

  const normalized = String(value).trim().toUpperCase();

  return translations[normalized] || value;
}

function InfoItem({ label, value, icon: Icon }) {
  const displayValue = translateValue(value);

  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
      {Icon && (
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
          <Icon className="h-[18px] w-[18px]" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-xs leading-5 text-slate-500">{label}</p>

        <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-800">
          {displayValue || "ثبت نشده"}
        </p>
      </div>
    </div>
  );
}

function Section({ title, description, icon: Icon, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-800 sm:text-base">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
        {children}
      </div>
    </section>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProfile() {
      setLoading(true);
      setError("");

      const accessToken = localStorage.getItem("access");

      if (!accessToken) {
        setError("نشست شما معتبر نیست. لطفاً دوباره وارد حساب کاربری شوید.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(PROFILE_API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (response.status === 401) {
          throw new Error(
            "نشست شما منقضی شده است. لطفاً دوباره وارد حساب کاربری شوید."
          );
        }

        if (response.status === 403) {
          throw new Error("شما اجازه مشاهده پرونده دانشجویی را ندارید.");
        }

        if (response.status === 404) {
          throw new Error("اطلاعات دانشجو در سامانه پیدا نشد.");
        }

        if (!response.ok) {
          throw new Error("دریافت اطلاعات پروفایل با خطا مواجه شد.");
        }

        const data = await response.json();

        if (!data.person || !data.student) {
          throw new Error("ساختار اطلاعات دریافتی از سرور معتبر نیست.");
        }

        setProfile(data);
      } catch (err) {
        if (err.name === "AbortError") return;

        setError(
          err.message ||
            "ارتباط با سرور برقرار نشد. لطفاً اتصال خود را بررسی کنید."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => controller.abort();
  }, []);

  const person = profile?.person ?? {};
  const student = profile?.student ?? {};

  // وضعیت‌هایی که در API فعلی موجود نیستند، عمداً ساختگی نیستند.
  const studentView = {
    firstName: person.first_name,
    lastName: person.last_name,
    fatherName: null,
    nationalCode: person.national_id,
    birthDate: formatPersianDate(person.birth_date),
    gender: person.gender,

    studentNumber: student.student_number,
    field: student.field_of_study,
    degree: student.education_level,
    faculty: student.faculty,
    department: student.department,
    university: student.university,
    fieldCode: student.field_code,
    entryYear: student.entry_year,
    studyStatus: student.status,

    educationType: null,
    currentSemester: null,
    advisor: null,

    mobile: person.phone_number,
    email: person.email,
    province: null,
    city: null,
    postalCode: null,
    address: person.address,
  };

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center bg-slate-50/70 p-6"
      >
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            در حال دریافت اطلاعات پرونده دانشجو...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir="rtl"
        className="min-h-[60vh] bg-slate-50/70 p-4 sm:p-6 lg:p-8"
      >
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <HiOutlineShieldCheck className="h-7 w-7 shrink-0 text-red-500" />

            <div className="flex-1">
              <h1 className="text-lg font-bold text-slate-800">
                دریافت اطلاعات ناموفق بود
              </h1>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* عنوان صفحه */}
        <header>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <HiOutlineAcademicCap className="h-5 w-5" />
            <span>پنل دانشجویی</span>
            <span>/</span>
            <span>پرونده دانشجو</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">
            اطلاعات دانشجو
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            مشاهده اطلاعات فردی، تحصیلی و اطلاعات تماس ثبت‌شده
          </p>
        </header>

        {/* کارت هویت دانشجو */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-l from-blue-700 via-blue-500 to-sky-400" />

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
            <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <HiOutlineUserCircle className="h-14 w-14" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">پرونده دانشجویی</p>

              <h2 className="mt-2 text-xl font-extrabold text-slate-800 sm:text-2xl">
                {studentView.firstName || ""} {studentView.lastName || ""}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  شماره دانشجویی:{" "}
                  {studentView.studentNumber || "ثبت نشده"}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                  <HiOutlineShieldCheck className="h-4 w-4" />
                  {translateValue(studentView.studyStatus) || "وضعیت نامشخص"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 sm:min-w-[190px]">
              <p className="text-xs text-slate-500">رشته تحصیلی</p>

              <p className="mt-2 text-sm font-bold text-slate-800">
                {studentView.field || "ثبت نشده"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {studentView.degree || "مقطع تحصیلی ثبت نشده"}
              </p>
            </div>
          </div>
        </section>

        {/* اطلاعات فردی */}
        <Section
          title="اطلاعات فردی"
          description="مشخصات هویتی دانشجو"
          icon={HiOutlineUserCircle}
        >
          <InfoItem label="نام" value={studentView.firstName} />
          <InfoItem label="نام خانوادگی" value={studentView.lastName} />
          <InfoItem label="نام پدر" value={studentView.fatherName} />

          <InfoItem
            label="کد ملی"
            value={studentView.nationalCode}
            icon={HiOutlineIdentification}
          />

          <InfoItem
            label="تاریخ تولد"
            value={studentView.birthDate}
            icon={HiOutlineCalendarDays}
          />

          <InfoItem label="جنسیت" value={studentView.gender} />
        </Section>

        {/* اطلاعات تحصیلی */}
        <Section
          title="اطلاعات تحصیلی"
          description="مشخصات آموزشی و وضعیت تحصیل"
          icon={HiOutlineAcademicCap}
        >
          <InfoItem
            label="شماره دانشجویی"
            value={studentView.studentNumber}
            icon={HiOutlineIdentification}
          />

          <InfoItem label="رشته تحصیلی" value={studentView.field} />

          <InfoItem label="کد رشته" value={studentView.fieldCode} />

          <InfoItem label="مقطع تحصیلی" value={studentView.degree} />

          <InfoItem
            label="دانشکده"
            value={studentView.faculty}
            icon={HiOutlineBuildingLibrary}
          />

          <InfoItem label="گروه آموزشی" value={studentView.department} />

          <InfoItem label="دانشگاه" value={studentView.university} />

          <InfoItem label="سال ورود" value={studentView.entryYear} />

          <InfoItem
            label="وضعیت تحصیلی"
            value={studentView.studyStatus}
            icon={HiOutlineShieldCheck}
          />

          <InfoItem
            label="نوع دوره"
            value={studentView.educationType}
          />

          <InfoItem
            label="نیمسال جاری"
            value={studentView.currentSemester}
            icon={HiOutlineCalendarDays}
          />

          <InfoItem
            label="استاد راهنما"
            value={studentView.advisor}
            icon={HiOutlineClipboardDocumentList}
          />
        </Section>

        {/* اطلاعات تماس */}
        <Section
          title="اطلاعات تماس"
          description="راه‌های ارتباطی ثبت‌شده در پرونده"
          icon={HiOutlinePhone}
        >
          <InfoItem
            label="شماره همراه"
            value={studentView.mobile}
            icon={HiOutlinePhone}
          />

          <InfoItem
            label="پست الکترونیکی"
            value={studentView.email}
            icon={HiOutlineEnvelope}
          />
        </Section>

        {/* نشانی */}
        <Section
          title="نشانی محل سکونت"
          description="اطلاعات نشانی ثبت‌شده"
          icon={HiOutlineMapPin}
        >
          <InfoItem label="استان" value={studentView.province} />

          <InfoItem label="شهر" value={studentView.city} />

          <InfoItem label="کد پستی" value={studentView.postalCode} />

          <div className="sm:col-span-2 xl:col-span-3">
            <InfoItem
              label="نشانی کامل"
              value={studentView.address}
              icon={HiOutlineMapPin}
            />
          </div>
        </Section>

        {/* توضیح پایین صفحه */}
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <HiOutlineShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

          <div>
            <p className="text-sm font-semibold text-slate-700">
              اطلاعات فقط جهت مشاهده است
            </p>

            <p className="mt-1 text-xs leading-6 text-slate-500">
              اطلاعات این صفحه از سامانه آموزشی دریافت می‌شود و قابل ویرایش
              نیست. برای اصلاح مشخصات ثبت‌شده، از طریق واحد مربوطه دانشگاه
              اقدام کنید.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
