
import { useState } from "react";
import {
  FiSettings,
  FiCalendar,
  FiClock,
  FiBookOpen,
  FiUsers,
  FiShield,
  FiSave,
  FiRefreshCw,
  FiCheck,
  FiInfo,
  FiAlertCircle,
  FiChevronLeft,
} from "react-icons/fi";

const INITIAL_SETTINGS = {
  semester: {
    title: "نیمسال اول ۱۴۰۵-۱۴۰۶",
    academicYear: "۱۴۰۵-۱۴۰۶",
    term: "first",
    startDate: "2026-09-23",
    endDate: "2027-01-20",
    active: true,
  },
  registration: {
    startDate: "2026-09-10",
    endDate: "2026-09-20",
    addDropStart: "2026-09-24",
    addDropEnd: "2026-10-01",
    examStart: "2027-01-05",
    examEnd: "2027-01-20",
    allowLateRegistration: false,
  },
  education: {
    minUnits: 12,
    maxUnits: 20,
    probationMaxUnits: 14,
    passingGrade: 10,
    probationGpa: 12,
    graduationUnits: 140,
    prerequisiteRequired: true,
    allowRetakingPassedCourses: false,
  },
  classes: {
    defaultCapacity: 30,
    minCapacity: 5,
    maxCapacity: 60,
    preventStudentConflict: true,
    preventProfessorConflict: true,
    waitlistEnabled: true,
    attendanceRequired: true,
  },
  approvals: {
    advisorApproval: true,
    departmentApproval: false,
    financialClearance: true,
    blockUnpaidStudents: true,
    notifyOnChanges: true,
    allowAdminOverride: true,
  },
};

const TABS = [
  { id: "semester", label: "نیمسال تحصیلی", icon: FiCalendar },
  { id: "registration", label: "انتخاب واحد", icon: FiClock },
  { id: "education", label: "قوانین آموزشی", icon: FiBookOpen },
  { id: "classes", label: "کلاس و ظرفیت", icon: FiUsers },
  { id: "approvals", label: "تأییدها و محدودیت‌ها", icon: FiShield },
];

function Field({ label, hint, children }) {
  return (
    <div className="min-w-0 space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs leading-5 text-slate-400">{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, type = "text", placeholder = "" }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
    />
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function NumberInput({ value, onChange, min = 0, max }) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(e) =>
        onChange(e.target.value === "" ? "" : Number(e.target.value))
      }
      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
    />
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-indigo-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
            checked ? "right-5" : "right-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <section className="space-y-5">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        {description && (
          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function SettingsCard({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <FiSettings size={19} />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

function InfoBanner({ children, warning = false }) {
  const Icon = warning ? FiAlertCircle : FiInfo;
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
        warning
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-indigo-100 bg-indigo-50 text-indigo-800"
      }`}
    >
      <Icon className="mt-0.5 shrink-0" size={18} />
      <p>{children}</p>
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [activeTab, setActiveTab] = useState("semester");
  const [savedSettings, setSavedSettings] = useState(INITIAL_SETTINGS);
  const [notice, setNotice] = useState("");

  const current = settings[activeTab];
  const saved = savedSettings[activeTab];

  const update = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [activeTab]: {
        ...previous[activeTab],
        [key]: value,
      },
    }));
    setNotice("");
  };

  const isDirty = JSON.stringify(current) !== JSON.stringify(saved);

  const saveCurrent = () => {
    if (
      activeTab === "education" &&
      (Number(current.minUnits) > Number(current.maxUnits) ||
        Number(current.probationMaxUnits) > Number(current.maxUnits) ||
        Number(current.passingGrade) > 20 ||
        Number(current.passingGrade) < 0)
    ) {
      setNotice("لطفاً مقادیر قوانین آموزشی را بررسی کن.");
      return;
    }

    if (
      activeTab === "registration" &&
      (current.startDate > current.endDate ||
        current.addDropStart > current.addDropEnd ||
        current.examStart > current.examEnd)
    ) {
      setNotice("تاریخ شروع هر بازه باید قبل از تاریخ پایان آن باشد.");
      return;
    }

    setSavedSettings((previous) => ({
      ...previous,
      [activeTab]: { ...settings[activeTab] },
    }));
    setNotice("تنظیمات این بخش با موفقیت ذخیره شد.");
  };

  const resetCurrent = () => {
    setSettings((previous) => ({
      ...previous,
      [activeTab]: { ...INITIAL_SETTINGS[activeTab] },
    }));
    setNotice("مقادیر این بخش به تنظیمات اولیه برگشت.");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "semester":
        return (
          <SettingsCard
            title="تنظیمات نیمسال تحصیلی"
            description="اطلاعات پایه نیمسال و وضعیت فعال بودن آن را مشخص کن."
          >
            <div className="space-y-8">
              <Section
                title="اطلاعات نیمسال"
                description="این اطلاعات در بخش‌های مختلف سامانه نمایش داده می‌شوند."
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="عنوان نیمسال">
                    <TextInput
                      value={current.title}
                      onChange={(v) => update("title", v)}
                    />
                  </Field>
                  <Field label="سال تحصیلی">
                    <TextInput
                      value={current.academicYear}
                      onChange={(v) => update("academicYear", v)}
                    />
                  </Field>
                  <Field label="نوع نیمسال">
                    <SelectInput
                      value={current.term}
                      onChange={(v) => update("term", v)}
                      options={[
                        { value: "first", label: "نیمسال اول" },
                        { value: "second", label: "نیمسال دوم" },
                        { value: "summer", label: "ترم تابستان" },
                      ]}
                    />
                  </Field>
                </div>
              </Section>

              <Section
                title="تقویم نیمسال"
                description="تاریخ‌های زیر با قالب میلادی در ورودی مرورگر ثبت می‌شوند."
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="تاریخ شروع نیمسال">
                    <TextInput
                      type="date"
                      value={current.startDate}
                      onChange={(v) => update("startDate", v)}
                    />
                  </Field>
                  <Field label="تاریخ پایان نیمسال">
                    <TextInput
                      type="date"
                      value={current.endDate}
                      onChange={(v) => update("endDate", v)}
                    />
                  </Field>
                </div>
              </Section>

              <Toggle
                label="نیمسال فعال سامانه باشد"
                description="در نسخه متصل به بک‌اند، فعال‌سازی نیمسال باید به‌صورت مرکزی کنترل شود."
                checked={current.active}
                onChange={(v) => update("active", v)}
              />

              <InfoBanner>
                قبل از فعال کردن نیمسال جدید، تاریخ‌ها و برنامه‌های آموزشی را بررسی کن.
              </InfoBanner>
            </div>
          </SettingsCard>
        );

      case "registration":
        return (
          <SettingsCard
            title="زمان‌بندی انتخاب واحد"
            description="بازه‌های ثبت‌نام، حذف و اضافه و امتحانات را مدیریت کن."
          >
            <div className="space-y-8">
              <Section
                title="بازه انتخاب واحد"
                description="دانشجویان در این بازه مجاز به ثبت درخواست انتخاب واحد هستند."
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="شروع انتخاب واحد">
                    <TextInput
                      type="date"
                      value={current.startDate}
                      onChange={(v) => update("startDate", v)}
                    />
                  </Field>
                  <Field label="پایان انتخاب واحد">
                    <TextInput
                      type="date"
                      value={current.endDate}
                      onChange={(v) => update("endDate", v)}
                    />
                  </Field>
                </div>
              </Section>

              <Section
                title="بازه حذف و اضافه"
                description="تغییر واحدهای ثبت‌شده در این بازه امکان‌پذیر است."
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="شروع حذف و اضافه">
                    <TextInput
                      type="date"
                      value={current.addDropStart}
                      onChange={(v) => update("addDropStart", v)}
                    />
                  </Field>
                  <Field label="پایان حذف و اضافه">
                    <TextInput
                      type="date"
                      value={current.addDropEnd}
                      onChange={(v) => update("addDropEnd", v)}
                    />
                  </Field>
                </div>
              </Section>

              <Section
                title="بازه امتحانات"
                description="زمان آغاز و پایان امتحانات نیمسال را مشخص کن."
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="شروع امتحانات">
                    <TextInput
                      type="date"
                      value={current.examStart}
                      onChange={(v) => update("examStart", v)}
                    />
                  </Field>
                  <Field label="پایان امتحانات">
                    <TextInput
                      type="date"
                      value={current.examEnd}
                      onChange={(v) => update("examEnd", v)}
                    />
                  </Field>
                </div>
              </Section>

              <Toggle
                label="اجازه ثبت‌نام با تأخیر"
                description="در نسخه نهایی می‌توان این دسترسی را به نقش کاربری یا مجوز مدیر محدود کرد."
                checked={current.allowLateRegistration}
                onChange={(v) => update("allowLateRegistration", v)}
              />

              <InfoBanner warning>
                تاریخ‌های این فرم نمونه هستند. پیش از استفاده واقعی، تقویم رسمی دانشگاه را جایگزین کن.
              </InfoBanner>
            </div>
          </SettingsCard>
        );

      case "education":
        return (
          <SettingsCard
            title="قوانین و ضوابط آموزشی"
            description="محدودیت‌های تعداد واحد، مشروطی و نمره قبولی را تنظیم کن."
          >
            <div className="space-y-8">
              <Section
                title="محدودیت تعداد واحد"
                description="مقادیر نمونه‌اند و باید با آیین‌نامه آموزشی دانشگاه مطابقت داده شوند."
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="حداقل واحد در نیمسال">
                    <NumberInput
                      min={0}
                      max={30}
                      value={current.minUnits}
                      onChange={(v) => update("minUnits", v)}
                    />
                  </Field>
                  <Field label="حداکثر واحد عادی">
                    <NumberInput
                      min={1}
                      max={30}
                      value={current.maxUnits}
                      onChange={(v) => update("maxUnits", v)}
                    />
                  </Field>
                  <Field label="سقف واحد دانشجوی مشروط">
                    <NumberInput
                      min={0}
                      max={30}
                      value={current.probationMaxUnits}
                      onChange={(v) => update("probationMaxUnits", v)}
                    />
                  </Field>
                  <Field label="واحد مورد نیاز فارغ‌التحصیلی">
                    <NumberInput
                      min={1}
                      max={250}
                      value={current.graduationUnits}
                      onChange={(v) => update("graduationUnits", v)}
                    />
                  </Field>
                </div>
              </Section>

              <Section
                title="نمره و وضعیت تحصیلی"
                description="مقادیر پیش‌فرض برای بررسی شرایط آموزشی دانشجو."
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="حداقل نمره قبولی از ۲۰">
                    <NumberInput
                      min={0}
                      max={20}
                      value={current.passingGrade}
                      onChange={(v) => update("passingGrade", v)}
                    />
                  </Field>
                  <Field label="حداقل معدل برای جلوگیری از مشروطی">
                    <NumberInput
                      min={0}
                      max={20}
                      value={current.probationGpa}
                      onChange={(v) => update("probationGpa", v)}
                    />
                  </Field>
                </div>
              </Section>

              <Section title="کنترل‌های پیشرفته">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Toggle
                    label="کنترل پیش‌نیاز دروس"
                    description="بررسی گذراندن درس‌های پیش‌نیاز."
                    checked={current.prerequisiteRequired}
                    onChange={(v) => update("prerequisiteRequired", v)}
                  />
                  <Toggle
                    label="اجازه اخذ مجدد درس قبول‌شده"
                    description="برای شرایط خاص آموزشی."
                    checked={current.allowRetakingPassedCourses}
                    onChange={(v) => update("allowRetakingPassedCourses", v)}
                  />
                </div>
              </Section>

              <InfoBanner warning>
                قوانین مشروطی، سقف واحد و فارغ‌التحصیلی باید بر اساس آیین‌نامه مصوب دانشگاه نهایی شوند.
              </InfoBanner>
            </div>
          </SettingsCard>
        );

      case "classes":
        return (
          <SettingsCard
            title="تنظیمات کلاس و ظرفیت"
            description="ظرفیت کلاس‌ها و کنترل تداخل برنامه‌ها را تعیین کن."
          >
            <div className="space-y-8">
              <Section
                title="ظرفیت کلاس‌ها"
                description="ظرفیت پیش‌فرض هنگام ایجاد کلاس جدید استفاده می‌شود."
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <Field label="ظرفیت پیش‌فرض">
                    <NumberInput
                      min={1}
                      max={200}
                      value={current.defaultCapacity}
                      onChange={(v) => update("defaultCapacity", v)}
                    />
                  </Field>
                  <Field label="حداقل ظرفیت مجاز">
                    <NumberInput
                      min={1}
                      max={200}
                      value={current.minCapacity}
                      onChange={(v) => update("minCapacity", v)}
                    />
                  </Field>
                  <Field label="حداکثر ظرفیت مجاز">
                    <NumberInput
                      min={1}
                      max={500}
                      value={current.maxCapacity}
                      onChange={(v) => update("maxCapacity", v)}
                    />
                  </Field>
                </div>
              </Section>

              <Section
                title="کنترل تداخل و ثبت‌نام"
                description="از ثبت برنامه‌های ناسازگار جلوگیری کن."
              >
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Toggle
                    label="جلوگیری از تداخل دانشجو"
                    description="دانشجو نتواند کلاس‌های هم‌زمان بردارد."
                    checked={current.preventStudentConflict}
                    onChange={(v) => update("preventStudentConflict", v)}
                  />
                  <Toggle
                    label="جلوگیری از تداخل استاد"
                    description="استاد در دو کلاس هم‌زمان برنامه‌ریزی نشود."
                    checked={current.preventProfessorConflict}
                    onChange={(v) => update("preventProfessorConflict", v)}
                  />
                  <Toggle
                    label="فعال بودن فهرست انتظار"
                    description="ثبت تقاضای دانشجو در کلاس تکمیل ظرفیت."
                    checked={current.waitlistEnabled}
                    onChange={(v) => update("waitlistEnabled", v)}
                  />
                  <Toggle
                    label="الزام ثبت حضور و غیاب"
                    description="امکان مدیریت حضور و غیاب برای جلسات کلاس."
                    checked={current.attendanceRequired}
                    onChange={(v) => update("attendanceRequired", v)}
                  />
                </div>
              </Section>

              <InfoBanner>
                کنترل واقعی ظرفیت و تداخل باید در API نیز پیاده‌سازی شود؛ کنترل رابط کاربری به‌تنهایی کافی نیست.
              </InfoBanner>
            </div>
          </SettingsCard>
        );

      case "approvals":
        return (
          <SettingsCard
            title="تأییدها و محدودیت‌های دسترسی"
            description="فرایندهای تأیید انتخاب واحد و محدودیت‌های سامانه را مدیریت کن."
          >
            <div className="space-y-8">
              <Section
                title="فرایند تأیید انتخاب واحد"
                description="مشخص کن چه کنترل‌هایی پیش از نهایی شدن انتخاب واحد لازم هستند."
              >
                <div className="space-y-4">
                  <Toggle
                    label="تأیید استاد راهنما"
                    description="انتخاب واحد پس از تأیید استاد راهنما نهایی شود."
                    checked={current.advisorApproval}
                    onChange={(v) => update("advisorApproval", v)}
                  />
                  <Toggle
                    label="تأیید مدیر گروه"
                    description="در صورت نیاز، یک مرحله تأیید گروه آموزشی اضافه شود."
                    checked={current.departmentApproval}
                    onChange={(v) => update("departmentApproval", v)}
                  />
                  <Toggle
                    label="کنترل وضعیت مالی دانشجو"
                    description="بررسی وضعیت مالی پیش از ثبت نهایی درخواست."
                    checked={current.financialClearance}
                    onChange={(v) => update("financialClearance", v)}
                  />
                  <Toggle
                    label="ممانعت از ثبت‌نام در صورت بدهی"
                    description="در صورت فعال بودن، وضعیت مالی نامناسب مانع ثبت‌نام می‌شود."
                    checked={current.blockUnpaidStudents}
                    onChange={(v) => update("blockUnpaidStudents", v)}
                  />
                </div>
              </Section>

              <Section title="مدیریت و اعلان‌ها">
                <div className="space-y-4">
                  <Toggle
                    label="اعلان تغییرات مهم"
                    description="برای تغییرات تنظیمات، اعلان مناسب در سامانه در نظر گرفته شود."
                    checked={current.notifyOnChanges}
                    onChange={(v) => update("notifyOnChanges", v)}
                  />
                  <Toggle
                    label="اجازه عبور مدیر از برخی محدودیت‌ها"
                    description="این قابلیت در نسخه واقعی باید فقط برای نقش‌های مجاز قابل استفاده باشد."
                    checked={current.allowAdminOverride}
                    onChange={(v) => update("allowAdminOverride", v)}
                  />
                </div>
              </Section>

              <InfoBanner warning>
                تنظیمات این صفحه فعلاً نمایشی‌اند. محدودیت‌های مالی، نقش‌ها و تأییدها باید در بک‌اند نیز اعتبارسنجی شوند.
              </InfoBanner>
            </div>
          </SettingsCard>
        );

      default:
        return null;
    }
  };

  const activeTabInfo = TABS.find((tab) => tab.id === activeTab);
  const ActiveIcon = activeTabInfo.icon;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50/80 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <FiSettings size={23} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                تنظیمات سامانه
              </h1>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                مدیریت قوانین آموزشی، نیمسال تحصیلی و فرایندهای دانشگاه
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            حالت نمایشی
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <FiCalendar size={20} />
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                فعال
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500">نیمسال جاری</p>
            <p className="mt-1 font-bold text-slate-900">
              {settings.semester.title}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                <FiBookOpen size={20} />
              </div>
              <span className="text-xs text-slate-400">واحد</span>
            </div>
            <p className="mt-4 text-sm text-slate-500">محدوده انتخاب واحد</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {settings.education.minUnits} تا {settings.education.maxUnits}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
                <FiUsers size={20} />
              </div>
              <span className="text-xs text-slate-400">نفر</span>
            </div>
            <p className="mt-4 text-sm text-slate-500">ظرفیت پیش‌فرض کلاس</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {settings.classes.defaultCapacity} دانشجو
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <FiShield size={20} />
              </div>
              <span className="text-xs text-slate-400">فرایند</span>
            </div>
            <p className="mt-4 text-sm text-slate-500">تأیید استاد راهنما</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {settings.approvals.advisorApproval ? "فعال" : "غیرفعال"}
            </p>
          </div>
        </div>

        {/* Main settings layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="px-3 pb-3 pt-2 text-xs font-bold text-slate-400">
              بخش‌های تنظیمات
            </p>
            <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const selected = activeTab === tab.id;

                return (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setNotice("");
                    }}
                    className={`flex min-w-max items-center gap-3 rounded-xl px-3 py-3 text-right text-sm font-medium transition lg:w-full ${
                      selected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-700"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                    {selected && (
                      <FiChevronLeft className="mr-auto" size={16} />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 hidden rounded-xl bg-slate-50 p-4 lg:block">
              <div className="flex items-center gap-2 text-slate-700">
                <FiInfo size={16} />
                <span className="text-xs font-bold">راهنمای تنظیمات</span>
              </div>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                تغییرات ابتدا در همین صفحه اعمال می‌شوند. برای نگهداری دائمی اطلاعات باید API و پایگاه داده متصل شوند.
              </p>
            </div>
          </aside>

          <main className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>تنظیمات</span>
                <FiChevronLeft size={14} />
                <span className="font-semibold text-slate-800">
                  {activeTabInfo.label}
                </span>
              </div>

              <div
                className={`flex items-center gap-1.5 text-xs ${
                  isDirty ? "text-amber-600" : "text-slate-400"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isDirty ? "bg-amber-500" : "bg-slate-300"
                  }`}
                />
                {isDirty ? "تغییرات ذخیره‌نشده" : "بدون تغییر ذخیره‌نشده"}
              </div>
            </div>

            {renderContent()}

            {notice && (
              <div
                role="status"
                className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                  notice.includes("موفقیت") || notice.includes("برگشت")
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
              >
                <FiInfo className="mt-0.5 shrink-0" size={17} />
                <p>{notice}</p>
              </div>
            )}

            <div className="flex flex-col-reverse justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={resetCurrent}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <FiRefreshCw size={16} />
                بازگردانی این بخش
              </button>

              <button
                type="button"
                onClick={saveCurrent}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700"
              >
                <FiSave size={17} />
                ذخیره تنظیمات
              </button>
            </div>

            <div className="flex items-start gap-2 px-1 text-xs leading-6 text-slate-400">
              <FiCheck className="mt-1 shrink-0" size={14} />
              <p>
                ذخیره و بازگردانی در این نسخه فقط در وضعیت React انجام می‌شود؛
                با بارگذاری مجدد صفحه، اطلاعات به مقادیر اولیه برمی‌گردند.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
