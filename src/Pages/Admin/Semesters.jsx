
import { useMemo, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiCalendar,
  FiBookOpen,
  FiUsers,
  FiMoreVertical,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiFilter,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiPower,
  FiAlertCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const INITIAL_SEMESTERS = [
  {
    id: 1,
    code: "14051",
    title: "نیمسال اول ۱۴۰۵–۱۴۰۶",
    year: "۱۴۰۵–۱۴۰۶",
    term: "first",
    status: "active",
    startDate: "2026-09-23",
    endDate: "2027-01-20",
    registrationStart: "2026-09-10",
    registrationEnd: "2026-09-20",
    courses: 128,
    classes: 214,
    students: 3240,
    description: "نیمسال اول سال تحصیلی ۱۴۰۵–۱۴۰۶",
  },
  {
    id: 2,
    code: "14052",
    title: "نیمسال دوم ۱۴۰۵–۱۴۰۶",
    year: "۱۴۰۵–۱۴۰۶",
    term: "second",
    status: "planned",
    startDate: "2027-02-20",
    endDate: "2027-06-15",
    registrationStart: "2027-02-05",
    registrationEnd: "2027-02-15",
    courses: 0,
    classes: 0,
    students: 0,
    description: "",
  },
  {
    id: 3,
    code: "14042",
    title: "نیمسال دوم ۱۴۰۴–۱۴۰۵",
    year: "۱۴۰۴–۱۴۰۵",
    term: "second",
    status: "closed",
    startDate: "2026-02-20",
    endDate: "2026-06-15",
    registrationStart: "2026-02-05",
    registrationEnd: "2026-02-15",
    courses: 115,
    classes: 198,
    students: 2980,
    description: "نیمسال پایان‌یافته سال تحصیلی قبل",
  },
  {
    id: 4,
    code: "14041",
    title: "نیمسال اول ۱۴۰۴–۱۴۰۵",
    year: "۱۴۰۴–۱۴۰۵",
    term: "first",
    status: "closed",
    startDate: "2025-09-23",
    endDate: "2026-01-20",
    registrationStart: "2025-09-10",
    registrationEnd: "2025-09-20",
    courses: 121,
    classes: 205,
    students: 3100,
    description: "",
  },
];

const EMPTY_FORM = {
  code: "",
  title: "",
  year: "۱۴۰۶–۱۴۰۵",
  term: "first",
  status: "planned",
  startDate: "",
  endDate: "",
  registrationStart: "",
  registrationEnd: "",
  courses: 0,
  classes: 0,
  students: 0,
  description: "",
};

const STATUS = {
  active: {
    label: "در حال برگزاری",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  planned: {
    label: "برنامه‌ریزی‌شده",
    className: "bg-blue-50 text-blue-700 ring-blue-600/20",
    dot: "bg-blue-500",
  },
  closed: {
    label: "پایان‌یافته",
    className: "bg-slate-100 text-slate-600 ring-slate-500/20",
    dot: "bg-slate-400",
  },
  draft: {
    label: "پیش‌نویس",
    className: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
  },
};

function faNumber(value) {
  return Number(value || 0).toLocaleString("fa-IR");
}

function formatDate(value) {
  if (!value) return "—";

  const [year, month, day] = value.split("-");
  return `${faNumber(day)}/${faNumber(month)}/${faNumber(year)}`;
}

function StatusBadge({ status }) {
  const item = STATUS[status] || STATUS.draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${item.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </span>
  );
}

function StatCard({ title, value, caption, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {faNumber(value)}
          </p>
        </div>
        <div className={`rounded-2xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400">{caption}</p>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children, hint }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs leading-5 text-slate-400">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50";

export default function Semesters() {
  const navigate = useNavigate();

  const [semesters, setSemesters] = useState(INITIAL_SEMESTERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [termFilter, setTermFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const stats = useMemo(
    () => ({
      total: semesters.length,
      active: semesters.filter((s) => s.status === "active").length,
      planned: semesters.filter((s) => s.status === "planned").length,
      closed: semesters.filter((s) => s.status === "closed").length,
    }),
    [semesters]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return semesters.filter((semester) => {
      const matchesSearch =
        !query ||
        semester.title.toLowerCase().includes(query) ||
        semester.code.toLowerCase().includes(query) ||
        semester.year.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || semester.status === statusFilter;

      const matchesTerm =
        termFilter === "all" || semester.term === termFilter;

      return matchesSearch && matchesStatus && matchesTerm;
    });
  }, [semesters, search, statusFilter, termFilter]);

  const updateField = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setError("");
  };

  const openCreate = () => {
    const nextId = Math.max(0, ...semesters.map((s) => s.id)) + 1;
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      code: String(nextId + 14050),
      title: "",
    });
    setError("");
    setModalOpen(true);
  };

  const openEdit = (semester) => {
    setEditingId(semester.id);
    setForm({ ...semester });
    setError("");
    setModalOpen(true);
    setMenuId(null);
  };

  const saveSemester = (e) => {
    e.preventDefault();

    if (!form.code.trim() || !form.title.trim() || !form.year.trim()) {
      setError("کد، عنوان و سال تحصیلی الزامی هستند.");
      return;
    }

    const duplicateCode = semesters.some(
      (s) =>
        s.code.trim() === form.code.trim() && s.id !== editingId
    );

    if (duplicateCode) {
      setError("این کد نیمسال قبلاً استفاده شده است.");
      return;
    }

    if (
      !form.startDate ||
      !form.endDate ||
      form.startDate > form.endDate
    ) {
      setError("تاریخ شروع و پایان نیمسال را به‌درستی وارد کن.");
      return;
    }

    if (
      form.registrationStart &&
      form.registrationEnd &&
      form.registrationStart > form.registrationEnd
    ) {
      setError("تاریخ شروع انتخاب واحد نباید بعد از تاریخ پایان باشد.");
      return;
    }

    const newSemester = {
      ...form,
      id: editingId ?? Math.max(0, ...semesters.map((s) => s.id)) + 1,
      code: form.code.trim(),
      title: form.title.trim(),
      year: form.year.trim(),
    };

    setSemesters((previous) =>
      editingId
        ? previous.map((s) => (s.id === editingId ? newSemester : s))
        : [...previous, newSemester]
    );

    setModalOpen(false);
    setNotice(editingId ? "نیمسال ویرایش شد." : "نیمسال جدید ایجاد شد.");
  };

  const activateSemester = (id) => {
    setSemesters((previous) =>
      previous.map((s) => {
        if (s.id === id) return { ...s, status: "active" };
        if (s.status === "active") return { ...s, status: "closed" };
        return s;
      })
    );

    setMenuId(null);
    setNotice("نیمسال فعال تغییر کرد. این تغییر فعلاً فقط نمایشی است.");
  };

  const duplicateSemester = (semester) => {
    const newId = Math.max(0, ...semesters.map((s) => s.id)) + 1;

    setSemesters((previous) => [
      ...previous,
      {
        ...semester,
        id: newId,
        code: String(Number(semester.code) + 10),
        title: `${semester.title} - کپی`,
        status: "draft",
        courses: 0,
        classes: 0,
        students: 0,
      },
    ]);

    setMenuId(null);
    setNotice("یک کپی پیش‌نویس از نیمسال ایجاد شد.");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.status === "active") {
      setNotice("نیمسال فعال قابل حذف نیست.");
      setDeleteTarget(null);
      return;
    }

    setSemesters((previous) =>
      previous.filter((s) => s.id !== deleteTarget.id)
    );
    setNotice("نیمسال حذف شد.");
    setDeleteTarget(null);
  };

  const openDetails = (id) => {
    navigate(`/admin/semesters/${id}`);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50/80 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <FiCalendar size={24} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  نیمسال‌های تحصیلی
                </h1>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  مدیریت آموزش
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                مدیریت دوره‌های آموزشی، تقویم دانشگاه و وضعیت نیمسال‌ها
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700"
          >
            <FiPlus size={18} />
            ایجاد نیمسال جدید
          </button>
        </header>

        {notice && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <div className="flex items-center gap-2">
              <FiCheck size={18} />
              {notice}
            </div>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="بستن پیام"
            >
              <FiX size={17} />
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="کل نیمسال‌ها"
            value={stats.total}
            caption="تمام دوره‌های ثبت‌شده"
            icon={FiCalendar}
            color="bg-indigo-50 text-indigo-600"
          />
          <StatCard
            title="نیمسال فعال"
            value={stats.active}
            caption="دوره جاری آموزش"
            icon={FiCheck}
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            title="برنامه‌ریزی‌شده"
            value={stats.planned}
            caption="دوره‌های آینده"
            icon={FiClock}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="پایان‌یافته"
            value={stats.closed}
            caption="دوره‌های بایگانی‌شده"
            icon={FiBookOpen}
            color="bg-slate-100 text-slate-600"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-bold text-slate-900">فهرست نیمسال‌ها</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {faNumber(filtered.length)} مورد مطابق فیلترهای انتخاب‌شده
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:w-64">
                  <FiSearch
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جست‌وجوی عنوان، کد یا سال..."
                    className={`${inputClass} pr-10`}
                  />
                </div>

                <div className="relative sm:w-44">
                  <FiFilter
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`${inputClass} pr-9`}
                  >
                    <option value="all">همه وضعیت‌ها</option>
                    <option value="active">در حال برگزاری</option>
                    <option value="planned">برنامه‌ریزی‌شده</option>
                    <option value="draft">پیش‌نویس</option>
                    <option value="closed">پایان‌یافته</option>
                  </select>
                </div>

                <select
                  value={termFilter}
                  onChange={(e) => setTermFilter(e.target.value)}
                  className={`${inputClass} sm:w-40`}
                >
                  <option value="all">همه ترم‌ها</option>
                  <option value="first">نیمسال اول</option>
                  <option value="second">نیمسال دوم</option>
                  <option value="summer">تابستان</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-right">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500">
                <tr>
                  <th className="px-5 py-4">نیمسال تحصیلی</th>
                  <th className="px-5 py-4">کد</th>
                  <th className="px-5 py-4">بازه نیمسال</th>
                  <th className="px-5 py-4">دروس / کلاس‌ها</th>
                  <th className="px-5 py-4">دانشجویان</th>
                  <th className="px-5 py-4">وضعیت</th>
                  <th className="px-5 py-4">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((semester) => (
                  <tr
                    key={semester.id}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => openDetails(semester.id)}
                        className="text-right font-bold text-slate-800 transition hover:text-indigo-600"
                      >
                        {semester.title}
                      </button>
                      <p className="mt-1 text-xs text-slate-400">
                        {semester.term === "first"
                          ? "نیمسال اول"
                          : semester.term === "second"
                            ? "نیمسال دوم"
                            : "ترم تابستان"}
                        {" · "}
                        {semester.year}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-mono text-sm text-slate-600">
                      {faNumber(semester.code)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="whitespace-nowrap text-sm text-slate-700">
                        {formatDate(semester.startDate)}
                      </p>
                      <p className="mt-1 whitespace-nowrap text-xs text-slate-400">
                        تا {formatDate(semester.endDate)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {faNumber(semester.courses)} درس
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {faNumber(semester.classes)} کلاس
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {faNumber(semester.students)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={semester.status} />
                    </td>
                    <td className="relative px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openDetails(semester.id)}
                          title="مشاهده جزئیات"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <FiEye size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(semester)}
                          title="ویرایش"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setMenuId(menuId === semester.id ? null : semester.id)
                          }
                          title="سایر عملیات"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                        >
                          <FiMoreVertical size={17} />
                        </button>
                      </div>

                      {menuId === semester.id && (
                        <div className="absolute left-8 top-12 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                          {semester.status !== "active" && (
                            <button
                              type="button"
                              onClick={() => activateSemester(semester.id)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <FiPower size={16} />
                              فعال‌سازی نیمسال
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => duplicateSemester(semester)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <FiCopy size={16} />
                            کپی نیمسال
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteTarget(semester);
                              setMenuId(null);
                            }}
                            disabled={semester.status === "active"}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <FiTrash2 size={16} />
                            حذف نیمسال
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <FiSearch
                        className="mx-auto text-slate-300"
                        size={32}
                      />
                      <p className="mt-3 font-semibold text-slate-700">
                        نیمسالی پیدا نشد
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        عبارت جست‌وجو یا فیلترها را تغییر بده.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-xs text-slate-400">
              نمایش {faNumber(filtered.length)} مورد از {faNumber(semesters.length)} نیمسال
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="rounded-lg border border-slate-200 p-2">
                <FiChevronRight size={15} />
              </span>
              <span className="rounded-lg bg-indigo-600 px-3 py-2 font-bold text-white">
                ۱
              </span>
              <span className="rounded-lg border border-slate-200 p-2">
                <FiChevronLeft size={15} />
              </span>
              <span className="mr-2">صفحه‌بندی نمایشی</span>
            </div>
          </div>
        </section>

        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <FiAlertCircle className="mt-0.5 shrink-0" size={19} />
          <p>
            اطلاعات این صفحه نمونه هستند. فعال‌سازی، ویرایش و حذف فقط در وضعیت
            محلی React اعمال می‌شوند و هنوز در دیتابیس ذخیره نمی‌شوند.
          </p>
        </div>
      </div>

      {modalOpen && (
        <Modal
          title={editingId ? "ویرایش نیمسال تحصیلی" : "ایجاد نیمسال جدید"}
          subtitle="اطلاعات پایه و بازه زمانی نیمسال را تکمیل کن."
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={saveSemester} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="کد نیمسال *">
                <input
                  value={form.code}
                  onChange={(e) => updateField("code", e.target.value)}
                  className={inputClass}
                  placeholder="مثلاً ۱۴۰۶۱"
                />
              </FormField>
              <FormField label="سال تحصیلی *">
                <input
                  value={form.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  className={inputClass}
                  placeholder="۱۴۰۶–۱۴۰۵"
                />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="عنوان نیمسال *">
                  <input
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className={inputClass}
                    placeholder="نیمسال اول ۱۴۰۶–۱۴۰۵"
                  />
                </FormField>
              </div>
              <FormField label="نوع نیمسال">
                <select
                  value={form.term}
                  onChange={(e) => updateField("term", e.target.value)}
                  className={inputClass}
                >
                  <option value="first">نیمسال اول</option>
                  <option value="second">نیمسال دوم</option>
                  <option value="summer">ترم تابستان</option>
                </select>
              </FormField>
              <FormField label="وضعیت">
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className={inputClass}
                >
                  <option value="draft">پیش‌نویس</option>
                  <option value="planned">برنامه‌ریزی‌شده</option>
                  <option value="closed">پایان‌یافته</option>
                </select>
              </FormField>
              <FormField label="شروع نیمسال *">
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                  className={inputClass}
                />
              </FormField>
              <FormField label="پایان نیمسال *">
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => updateField("endDate", e.target.value)}
                  className={inputClass}
                />
              </FormField>
              <FormField label="شروع انتخاب واحد">
                <input
                  type="date"
                  value={form.registrationStart}
                  onChange={(e) =>
                    updateField("registrationStart", e.target.value)
                  }
                  className={inputClass}
                />
              </FormField>
              <FormField label="پایان انتخاب واحد">
                <input
                  type="date"
                  value={form.registrationEnd}
                  onChange={(e) =>
                    updateField("registrationEnd", e.target.value)
                  }
                  className={inputClass}
                />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="توضیحات">
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    className={`${inputClass} resize-y`}
                    placeholder="توضیحات اختیاری درباره نیمسال..."
                  />
                </FormField>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
              >
                <FiCheck size={17} />
                {editingId ? "ذخیره تغییرات" : "ایجاد نیمسال"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal
          title="حذف نیمسال"
          subtitle="این عملیات در نسخه نمایشی برگشت‌پذیر نیست."
          onClose={() => setDeleteTarget(null)}
        >
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-xl bg-rose-50 p-4 text-rose-800">
              <FiAlertCircle className="mt-0.5 shrink-0" size={22} />
              <div>
                <p className="font-bold">{deleteTarget.title}</p>
                <p className="mt-1 text-sm leading-6">
                  آیا مطمئنی که می‌خواهی این نیمسال را حذف کنی؟
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:bg-rose-700"
              >
                <FiTrash2 size={16} />
                حذف نیمسال
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
