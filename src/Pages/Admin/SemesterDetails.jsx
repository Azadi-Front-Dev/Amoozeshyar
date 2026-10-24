
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiBookOpen,
  FiUsers,
  FiBarChart2,
  FiSave,
  FiCheck,
  FiInfo,
} from "react-icons/fi";

const DEMO = {
  1: {
    title: "نیمسال اول ۱۴۰۵–۱۴۰۶",
    code: "14051",
    year: "۱۴۰۵–۱۴۰۶",
    status: "در حال برگزاری",
    startDate: "2026-09-23",
    endDate: "2027-01-20",
    registrationStart: "2026-09-10",
    registrationEnd: "2026-09-20",
    addDropStart: "2026-09-24",
    addDropEnd: "2026-10-01",
    examStart: "2027-01-05",
    examEnd: "2027-01-20",
    gradesDeadline: "2027-01-28",
    appealDeadline: "2027-02-05",
    minUnits: 12,
    maxUnits: 20,
    probationUnits: 14,
    passingGrade: 10,
    prerequisite: true,
    courses: 128,
    classes: 214,
    students: 3240,
    description: "نیمسال اول سال تحصیلی ۱۴۰۵–۱۴۰۶",
  },
  2: {
    title: "نیمسال دوم ۱۴۰۵–۱۴۰۶",
    code: "14052",
    year: "۱۴۰۵–۱۴۰۶",
    status: "برنامه‌ریزی‌شده",
    startDate: "2027-02-20",
    endDate: "2027-06-15",
    registrationStart: "2027-02-05",
    registrationEnd: "2027-02-15",
    addDropStart: "2027-02-21",
    addDropEnd: "2027-02-28",
    examStart: "2027-06-01",
    examEnd: "2027-06-15",
    gradesDeadline: "2027-06-25",
    appealDeadline: "2027-07-02",
    minUnits: 12,
    maxUnits: 20,
    probationUnits: 14,
    passingGrade: 10,
    prerequisite: true,
    courses: 0,
    classes: 0,
    students: 0,
    description: "",
  },
};

const TABS = [
  { id: "general", label: "اطلاعات اصلی", icon: FiInfo },
  { id: "calendar", label: "تقویم آموزشی", icon: FiCalendar },
  { id: "rules", label: "قوانین آموزشی", icon: FiBookOpen },
  { id: "classes", label: "دروس و کلاس‌ها", icon: FiUsers },
  { id: "reports", label: "گزارش‌ها", icon: FiBarChart2 },
];

const INPUT =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50";

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
      />
    </Field>
  );
}

function NumberField({ label, value, onChange, max = 250 }) {
  return (
    <Field label={label}>
      <input
        type="number"
        min="0"
        max={max}
        value={value}
        onChange={(e) =>
          onChange(e.target.value === "" ? "" : Number(e.target.value))
        }
        className={INPUT}
      />
    </Field>
  );
}

function SwitchField({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
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
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
            checked ? "right-5" : "right-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function Panel({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="font-extrabold text-slate-900">{title}</h2>
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

export default function SemesterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [semester, setSemester] = useState(
    DEMO[id] || { ...DEMO[1], title: "نیمسال نمونه" }
  );
  const [activeTab, setActiveTab] = useState("general");
  const [notice, setNotice] = useState("");

  const update = (key, value) => {
    setSemester((previous) => ({ ...previous, [key]: value }));
    setNotice("");
  };

  const save = () => {
    if (
      semester.startDate > semester.endDate ||
      semester.registrationStart > semester.registrationEnd ||
      semester.addDropStart > semester.addDropEnd ||
      semester.examStart > semester.examEnd
    ) {
      setNotice("خطا: تاریخ شروع باید قبل از تاریخ پایان باشد.");
      return;
    }

    if (
      Number(semester.minUnits) > Number(semester.maxUnits) ||
      Number(semester.probationUnits) > Number(semester.maxUnits) ||
      Number(semester.passingGrade) > 20 ||
      Number(semester.passingGrade) < 0
    ) {
      setNotice("خطا: مقادیر قوانین آموزشی را بررسی کن.");
      return;
    }

    setNotice(
      "تغییرات در وضعیت محلی صفحه ثبت شد؛ هنوز در سرور ذخیره نشده‌اند."
    );
  };

  const renderTab = () => {
    if (activeTab === "general") {
      return (
        <Panel
          title="اطلاعات پایه نیمسال"
          description="مشخصات شناسایی و بازه رسمی نیمسال تحصیلی."
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="عنوان نیمسال">
              <input
                className={INPUT}
                value={semester.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </Field>
            <Field label="کد نیمسال">
              <input
                className={INPUT}
                value={semester.code}
                onChange={(e) => update("code", e.target.value)}
              />
            </Field>
            <Field label="سال تحصیلی">
              <input
                className={INPUT}
                value={semester.year}
                onChange={(e) => update("year", e.target.value)}
              />
            </Field>
            <Field label="وضعیت">
              <select
                className={INPUT}
                value={semester.status}
                onChange={(e) => update("status", e.target.value)}
              >
                <option>پیش‌نویس</option>
                <option>برنامه‌ریزی‌شده</option>
                <option>در حال برگزاری</option>
                <option>پایان‌یافته</option>
              </select>
            </Field>
            <DateField
              label="شروع نیمسال"
              value={semester.startDate}
              onChange={(v) => update("startDate", v)}
            />
            <DateField
              label="پایان نیمسال"
              value={semester.endDate}
              onChange={(v) => update("endDate", v)}
            />
            <div className="sm:col-span-2">
              <Field label="توضیحات">
                <textarea
                  rows={4}
                  className={INPUT}
                  value={semester.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="توضیحات مربوط به نیمسال..."
                />
              </Field>
            </div>
          </div>
        </Panel>
      );
    }

    if (activeTab === "calendar") {
      return (
        <Panel
          title="تقویم آموزشی"
          description="بازه‌های زمانی مهم این نیمسال را تعیین کن."
        >
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 font-bold text-slate-800">انتخاب واحد</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <DateField
                  label="شروع انتخاب واحد"
                  value={semester.registrationStart}
                  onChange={(v) => update("registrationStart", v)}
                />
                <DateField
                  label="پایان انتخاب واحد"
                  value={semester.registrationEnd}
                  onChange={(v) => update("registrationEnd", v)}
                />
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-bold text-slate-800">حذف و اضافه</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <DateField
                  label="شروع حذف و اضافه"
                  value={semester.addDropStart}
                  onChange={(v) => update("addDropStart", v)}
                />
                <DateField
                  label="پایان حذف و اضافه"
                  value={semester.addDropEnd}
                  onChange={(v) => update("addDropEnd", v)}
                />
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-bold text-slate-800">امتحانات</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <DateField
                  label="شروع امتحانات"
                  value={semester.examStart}
                  onChange={(v) => update("examStart", v)}
                />
                <DateField
                  label="پایان امتحانات"
                  value={semester.examEnd}
                  onChange={(v) => update("examEnd", v)}
                />
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-bold text-slate-800">ثبت نمرات و اعتراض</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <DateField
                  label="مهلت نهایی ثبت نمرات"
                  value={semester.gradesDeadline}
                  onChange={(v) => update("gradesDeadline", v)}
                />
                <DateField
                  label="پایان مهلت اعتراض"
                  value={semester.appealDeadline}
                  onChange={(v) => update("appealDeadline", v)}
                />
              </div>
            </div>
          </div>
        </Panel>
      );
    }

    if (activeTab === "rules") {
      return (
        <Panel
          title="قوانین آموزشی"
          description="مقادیر نمونه هستند؛ قبل از استفاده واقعی، آیین‌نامه مصوب دانشگاه را بررسی کن."
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <NumberField
                label="حداقل واحد مجاز"
                value={semester.minUnits}
                onChange={(v) => update("minUnits", v)}
                max={30}
              />
              <NumberField
                label="حداکثر واحد عادی"
                value={semester.maxUnits}
                onChange={(v) => update("maxUnits", v)}
                max={30}
              />
              <NumberField
                label="سقف واحد دانشجوی مشروط"
                value={semester.probationUnits}
                onChange={(v) => update("probationUnits", v)}
                max={30}
              />
              <NumberField
                label="حداقل نمره قبولی از ۲۰"
                value={semester.passingGrade}
                onChange={(v) => update("passingGrade", v)}
                max={20}
              />
            </div>
            <SwitchField
              label="کنترل پیش‌نیاز دروس"
              description="بررسی گذراندن پیش‌نیاز پیش از ثبت درس."
              checked={semester.prerequisite}
              onChange={(v) => update("prerequisite", v)}
            />
          </div>
        </Panel>
      );
    }

    if (activeTab === "classes") {
      return (
        <Panel
          title="دروس و کلاس‌ها"
          description="خلاصه اطلاعات آموزشی مرتبط با نیمسال انتخاب‌شده."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "دروس ارائه‌شده", value: semester.courses, icon: FiBookOpen },
              { label: "کلاس‌های تشکیل‌شده", value: semester.classes, icon: FiCalendar },
              { label: "دانشجویان", value: semester.students, icon: FiUsers },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <Icon size={22} className="text-indigo-600" />
                  <p className="mt-4 text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-extrabold text-slate-900">
                    {Number(item.value || 0).toLocaleString("fa-IR")}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm leading-6 text-indigo-800">
            فهرست کامل ارائه دروس و کلاس‌ها در مرحله اتصال به API به این بخش اضافه خواهد شد.
          </div>
        </Panel>
      );
    }

    return (
      <Panel
        title="گزارش عملکرد نیمسال"
        description="خلاصه شاخص‌های آموزشی این دوره."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">تعداد دانشجویان</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">
              {Number(semester.students || 0).toLocaleString("fa-IR")}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">تعداد کلاس‌ها</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">
              {Number(semester.classes || 0).toLocaleString("fa-IR")}
            </p>
          </div>
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-500">
          گزارش‌های تفصیلی انتخاب واحد، ظرفیت کلاس‌ها، وضعیت نمرات و آمار دانشجویان
          پس از اتصال داده‌های واقعی در دسترس قرار می‌گیرند.
        </p>
      </Panel>
    );
  };

  const selectedTab = TABS.find((tab) => tab.id === activeTab);
  const SelectedIcon = selectedTab.icon;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50/80 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <button
          type="button"
          onClick={() => navigate("/admin/semesters")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600"
        >
          <FiArrowRight size={17} />
          بازگشت به فهرست نیمسال‌ها
        </button>

        <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <FiCalendar size={25} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                {semester.title}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                کد نیمسال: {semester.code} · سال تحصیلی {semester.year}
              </p>
              <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                {semester.status}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={save}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
          >
            <FiSave size={17} />
            ذخیره تغییرات
          </button>
        </header>

        {notice && (
          <div className="flex items-start gap-2 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm leading-6 text-indigo-800">
            <FiInfo className="mt-0.5 shrink-0" size={18} />
            {notice}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <nav className="flex gap-2 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setNotice("");
                  }}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                  }`}
                >
                  <Icon size={17} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <SelectedIcon size={17} className="text-indigo-600" />
          بخش جاری:
          <span className="font-bold text-slate-800">{selectedTab.label}</span>
        </div>

        {renderTab()}

        <div className="flex items-start gap-2 rounded-xl bg-slate-100 p-4 text-xs leading-6 text-slate-500">
          <FiClock className="mt-1 shrink-0" size={15} />
          <p>
            این صفحه از داده‌های استاتیک استفاده می‌کند. برای ذخیره دائمی،
            همگام‌سازی بین فهرست و جزئیات و اعتبارسنجی نهایی باید API پیاده‌سازی شود.
          </p>
        </div>
      </div>
    </div>
  );
}
