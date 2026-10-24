
import { useMemo, useState } from "react";
import {
  FiCalendar, FiPlus, FiSearch, FiEdit2, FiTrash2,
  FiX, FiCheck, FiClock, FiUsers, FiAlertCircle
} from "react-icons/fi";

const INITIAL_WINDOWS = [
  {
    id: 1,
    title: "انتخاب واحد ورودی ۱۴۰۳",
    semester: "نیمسال اول ۱۴۰۶–۱۴۰۷",
    department: "مهندسی کامپیوتر",
    level: "کارشناسی",
    entryYear: "۱۴۰۳",
    startDate: "2026-09-01",
    startTime: "08:00",
    endDate: "2026-09-03",
    endTime: "23:00",
    status: "scheduled",
    notes: "اولویت انتخاب واحد با دانشجویان این ورودی است.",
  },
  {
    id: 2,
    title: "انتخاب واحد کارشناسی ارشد",
    semester: "نیمسال اول ۱۴۰۶–۱۴۰۷",
    department: "همه دانشکده‌ها",
    level: "کارشناسی ارشد",
    entryYear: "همه ورودی‌ها",
    startDate: "2026-09-04",
    startTime: "08:00",
    endDate: "2026-09-05",
    endTime: "23:00",
    status: "scheduled",
    notes: "",
  },
  {
    id: 3,
    title: "انتخاب واحد ورودی ۱۴۰۲",
    semester: "نیمسال اول ۱۴۰۶–۱۴۰۷",
    department: "همه دانشکده‌ها",
    level: "کارشناسی",
    entryYear: "۱۴۰۲",
    startDate: "2026-08-25",
    startTime: "08:00",
    endDate: "2026-08-27",
    endTime: "23:00",
    status: "inactive",
    notes: "نمونه بازه غیرفعال",
  },
];

const EMPTY_FORM = {
  title: "",
  semester: "نیمسال اول ۱۴۰۶–۱۴۰۷",
  department: "همه دانشکده‌ها",
  level: "کارشناسی",
  entryYear: "همه ورودی‌ها",
  startDate: "",
  startTime: "08:00",
  endDate: "",
  endTime: "23:00",
  notes: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition disabled:opacity-50";

function StatusBadge({ status }) {
  const config = {
    scheduled: ["برنامه‌ریزی‌شده", "bg-blue-50 text-blue-700"],
    active: ["فعال", "bg-emerald-50 text-emerald-700"],
    inactive: ["غیرفعال", "bg-slate-100 text-slate-600"],
    completed: ["پایان‌یافته", "bg-purple-50 text-purple-700"],
  };
  const [label, cls] = config[status] || config.inactive;
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>{label}</span>;
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function formatDate(value) {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export default function RegistrationWindows() {
  const [windows, setWindows] = useState(INITIAL_WINDOWS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => windows.filter(item => {
    const q = search.trim().toLowerCase();
    const matches = !q ||
      [item.title, item.department, item.level, item.entryYear]
        .some(v => (v || "").toLowerCase().includes(q));
    return matches && (statusFilter === "all" || item.status === statusFilter);
  }), [windows, search, statusFilter]);

  const activeCount = windows.filter(x => x.status === "active").length;
  const scheduledCount = windows.filter(x => x.status === "scheduled").length;
  const inactiveCount = windows.filter(x => x.status === "inactive").length;

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setModal(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      semester: item.semester,
      department: item.department,
      level: item.level,
      entryYear: item.entryYear,
      startDate: item.startDate,
      startTime: item.startTime,
      endDate: item.endDate,
      endTime: item.endTime,
      notes: item.notes || "",
    });
    setError("");
    setModal(true);
  }

  function updateField(key, value) {
    setForm(current => ({ ...current, [key]: value }));
  }

  function saveWindow(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.startDate || !form.endDate) {
      setError("عنوان بازه، تاریخ شروع و تاریخ پایان الزامی است.");
      return;
    }

    const start = new Date(`${form.startDate}T${form.startTime}:00`);
    const end = new Date(`${form.endDate}T${form.endTime}:00`);

    if (end <= start) {
      setError("تاریخ و ساعت پایان باید بعد از شروع باشد.");
      return;
    }

    const overlapping = windows.some(item => {
      if (item.id === editingId || item.status === "inactive") return false;

      // بازه‌های گروه‌های کاملاً یکسان نباید هم‌پوشانی داشته باشند.
      const sameAudience =
        item.semester === form.semester &&
        item.department === form.department &&
        item.level === form.level &&
        item.entryYear === form.entryYear;

      if (!sameAudience) return false;

      const otherStart = new Date(`${item.startDate}T${item.startTime}:00`);
      const otherEnd = new Date(`${item.endDate}T${item.endTime}:00`);
      return start < otherEnd && end > otherStart;
    });

    if (overlapping) {
      setError("برای همین نیمسال و همین گروه دانشجویی، بازه دیگری با این زمان هم‌پوشانی دارد.");
      return;
    }

    const existing = windows.find(x => x.id === editingId);
    const item = {
      ...form,
      id: editingId ?? Date.now(),
      status: existing?.status === "active" ? "scheduled" : (existing?.status || "scheduled"),
    };

    setWindows(current => editingId
      ? current.map(x => x.id === editingId ? item : x)
      : [item, ...current]
    );

    setModal(false);
    setNotice(editingId
      ? "بازه زمانی به‌روزرسانی شد؛ برای اعمال تغییرات، وضعیت بازه را دوباره بررسی کنید."
      : "بازه زمانی جدید ثبت شد و هنوز فعال نیست.");
  }

  function toggleActive(item) {
    if (item.status === "active") {
      setWindows(current => current.map(x =>
        x.id === item.id ? { ...x, status: "inactive" } : x
      ));
      setNotice("بازه غیرفعال شد؛ دانشجویان نباید بتوانند از آن استفاده کنند.");
      return;
    }

    const start = new Date(`${item.startDate}T${item.startTime}:00`);
    const end = new Date(`${item.endDate}T${item.endTime}:00`);
    const now = new Date();

    if (end <= start) {
      setNotice("این بازه تاریخ و ساعت معتبری ندارد.");
      return;
    }

    // در نسخه نمونه، فعال‌سازی دستی است؛ سرور واقعی باید ساعت دانشگاه را ملاک بگیرد.
    setWindows(current => current.map(x =>
      x.id === item.id ? { ...x, status: "active" } : x
    ));
    setNotice(
      now < start
        ? "بازه فعال شد، اما تا رسیدن زمان شروع نباید امکان انتخاب واحد به دانشجو داده شود."
        : now > end
          ? "توجه: زمان این بازه گذشته است؛ در نسخه واقعی باید وضعیت پایان‌یافته ثبت شود."
          : "بازه انتخاب واحد فعال شد."
    );
  }

  function removeWindow() {
    setWindows(current => current.filter(x => x.id !== deleteId));
    setDeleteId(null);
    setNotice("بازه زمانی حذف شد.");
  }

  return (
    <div dir="rtl" className="space-y-6 pb-8 text-slate-800">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <FiCalendar /> مدیریت آموزشی <span>/</span> زمان‌بندی انتخاب واحد
          </div>
          <h1 className="text-2xl font-bold">زمان‌بندی انتخاب واحد</h1>
          <p className="mt-2 text-sm text-slate-500">
            تعریف بازه‌های مستقل انتخاب واحد برای ورودی‌ها، دانشکده‌ها و مقاطع مختلف
          </p>
        </div>
        <button onClick={openCreate} className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}>
          <FiPlus /> تعریف بازه جدید
        </button>
      </div>

      {notice && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-800">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="بستن پیام"><FiX /></button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["کل بازه‌ها", windows.length, <FiCalendar />],
          ["فعال", activeCount, <FiCheck />],
          ["برنامه‌ریزی‌شده", scheduledCount, <FiClock />],
          ["غیرفعال", inactiveCount, <FiUsers />],
        ].map(([label, value, icon]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between text-sm text-slate-500">
              {label}<span className="rounded-xl bg-slate-100 p-2 text-slate-600">{icon}</span>
            </div>
            <div className="mt-3 text-2xl font-bold">{value.toLocaleString("fa-IR")}</div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <FiAlertCircle className="mt-1 shrink-0" />
        <p>
          فعال‌کردن بازه در این نسخه فقط وضعیت نمونه را تغییر می‌دهد. در نسخه متصل به سرور،
          اجازه انتخاب واحد باید در سمت Django نیز بر اساس زمان فعلی، نیمسال، گروه دانشجو،
          وضعیت بازه و وضعیت انتشار دروس کنترل شود.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-2">
          <div className="relative">
            <FiSearch className="absolute right-3 top-3 text-slate-400" />
            <input className={`${inputClass} pr-9`} value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="جست‌وجو عنوان، دانشکده، مقطع یا ورودی..." />
          </div>
          <select className={inputClass} value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">همه وضعیت‌ها</option>
            <option value="scheduled">برنامه‌ریزی‌شده</option>
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
            <option value="completed">پایان‌یافته</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-right text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {["عنوان بازه", "گروه دانشجویان", "شروع", "پایان", "وضعیت", "عملیات"].map(x =>
                  <th key={x} className="px-4 py-3 font-medium">{x}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4">
                    <div className="font-semibold">{item.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.semester}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div>{item.department}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.level} · ورودی {item.entryYear}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div>{formatDate(item.startDate)}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.startTime}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div>{formatDate(item.endDate)}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.endTime}</div>
                  </td>
                  <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button title="ویرایش" onClick={() => openEdit(item)} className={`${buttonClass} border border-slate-200 p-2`}><FiEdit2 /></button>
                      <button title={item.status === "active" ? "غیرفعال کردن" : "فعال‌سازی"} onClick={() => toggleActive(item)} className={`${buttonClass} p-2 ${item.status === "active" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                        {item.status === "active" ? <FiX /> : <FiCheck />}
                      </button>
                      <button title="حذف" onClick={() => setDeleteId(item.id)} className={`${buttonClass} bg-red-50 p-2 text-red-600`}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="6" className="p-10 text-center text-slate-500">بازه‌ای پیدا نشد.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          نمایش {filtered.length.toLocaleString("fa-IR")} بازه · داده‌های نمونه
        </div>
      </section>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4">
          <form onSubmit={saveWindow} className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-bold">{editingId ? "ویرایش بازه" : "تعریف بازه انتخاب واحد"}</h2>
                <p className="mt-1 text-xs text-slate-500">تاریخ‌ها در این فرم میلادی ذخیره می‌شوند؛ برای تقویم شمسی می‌توانیم بعداً رابط را بومی‌سازی کنیم.</p>
              </div>
              <button type="button" onClick={() => setModal(false)}><FiX size={20} /></button>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="عنوان بازه"><input className={inputClass} value={form.title} onChange={e => updateField("title", e.target.value)} placeholder="مثلاً انتخاب واحد ورودی ۱۴۰۳" /></Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="نیمسال تحصیلی">
                  <select className={inputClass} value={form.semester} onChange={e => updateField("semester", e.target.value)}>
                    <option>نیمسال اول ۱۴۰۶–۱۴۰۷</option>
                    <option>نیمسال دوم ۱۴۰۵–۱۴۰۶</option>
                    <option>نیمسال تابستان ۱۴۰۶</option>
                  </select>
                </Field>
              </div>
              <Field label="دانشکده">
                <select className={inputClass} value={form.department} onChange={e => updateField("department", e.target.value)}>
                  <option>همه دانشکده‌ها</option><option>مهندسی کامپیوتر</option><option>علوم پایه</option><option>مهندسی برق</option><option>مدیریت</option>
                </select>
              </Field>
              <Field label="مقطع">
                <select className={inputClass} value={form.level} onChange={e => updateField("level", e.target.value)}>
                  <option>همه مقاطع</option><option>کاردانی</option><option>کارشناسی</option><option>کارشناسی ارشد</option><option>دکتری</option>
                </select>
              </Field>
              <Field label="سال ورود">
                <select className={inputClass} value={form.entryYear} onChange={e => updateField("entryYear", e.target.value)}>
                  <option>همه ورودی‌ها</option><option>۱۴۰۱</option><option>۱۴۰۲</option><option>۱۴۰۳</option><option>۱۴۰۴</option><option>۱۴۰۵</option>
                </select>
              </Field>
              <div />
              <Field label="تاریخ شروع"><input type="date" className={inputClass} value={form.startDate} onChange={e => updateField("startDate", e.target.value)} /></Field>
              <Field label="ساعت شروع"><input type="time" className={inputClass} value={form.startTime} onChange={e => updateField("startTime", e.target.value)} /></Field>
              <Field label="تاریخ پایان"><input type="date" className={inputClass} value={form.endDate} onChange={e => updateField("endDate", e.target.value)} /></Field>
              <Field label="ساعت پایان"><input type="time" className={inputClass} value={form.endTime} onChange={e => updateField("endTime", e.target.value)} /></Field>
              <div className="sm:col-span-2">
                <Field label="توضیحات (اختیاری)">
                  <textarea rows="3" className={inputClass} value={form.notes} onChange={e => updateField("notes", e.target.value)} placeholder="توضیحات ویژه این بازه..." />
                </Field>
              </div>
            </div>
            {error && <div className="mx-5 mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <div className="flex justify-end gap-2 border-t p-5">
              <button type="button" onClick={() => setModal(false)} className={`${buttonClass} border border-slate-200`}>انصراف</button>
              <button type="submit" className={`${buttonClass} bg-blue-600 text-white`}><FiCheck /> ذخیره بازه</button>
            </div>
          </form>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-bold">حذف بازه زمانی؟</h2>
            <p className="my-3 text-sm leading-6 text-slate-500">در نسخه واقعی، حذف بازه‌ای که انتخاب واحد در آن ثبت شده باید با محدودیت و بررسی انجام شود.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className={`${buttonClass} border border-slate-200`}>انصراف</button>
              <button onClick={removeWindow} className={`${buttonClass} bg-red-600 text-white`}><FiTrash2 /> حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
