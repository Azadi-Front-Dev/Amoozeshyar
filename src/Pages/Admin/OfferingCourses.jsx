
import { useMemo, useState } from "react";
import {
  FiBookOpen, FiSearch, FiPlus, FiEdit2, FiTrash2,
  FiX, FiCheck, FiEye, FiSend, FiAlertCircle,
  FiUsers, FiClock, FiFilter
} from "react-icons/fi";

const INITIAL_OFFERINGS = [
  {
    id: 1, code: "CS301", title: "پایگاه داده‌ها", units: 3,
    department: "مهندسی کامپیوتر", level: "کارشناسی",
    entryYear: "۱۴۰۳", instructor: "دکتر احمدی",
    group: "01", capacity: 35, enrolled: 0,
    day: "شنبه", start: "08:00", end: "10:00",
    room: "کلاس ۲۰۱", status: "draft",
  },
  {
    id: 2, code: "CS205", title: "ساختمان داده", units: 3,
    department: "مهندسی کامپیوتر", level: "کارشناسی",
    entryYear: "۱۴۰۲", instructor: "دکتر محمدی",
    group: "01", capacity: 30, enrolled: 0,
    day: "یکشنبه", start: "10:00", end: "12:00",
    room: "کلاس ۱۰۴", status: "draft",
  },
  {
    id: 3, code: "MATH201", title: "معادلات دیفرانسیل", units: 3,
    department: "علوم پایه", level: "کارشناسی",
    entryYear: "۱۴۰۳", instructor: "دکتر رضایی",
    group: "02", capacity: 40, enrolled: 0,
    day: "دوشنبه", start: "08:00", end: "10:00",
    room: "کلاس ۳۰۲", status: "published",
  },
  {
    id: 4, code: "CS410", title: "مهندسی نرم‌افزار", units: 3,
    department: "مهندسی کامپیوتر", level: "کارشناسی",
    entryYear: "۱۴۰۱", instructor: "",
    group: "01", capacity: 25, enrolled: 0,
    day: "سه‌شنبه", start: "12:00", end: "14:00",
    room: "", status: "draft",
  },
];

const EMPTY_FORM = {
  code: "", title: "", units: 3, department: "مهندسی کامپیوتر",
  level: "کارشناسی", entryYear: "۱۴۰۳", instructor: "",
  group: "01", capacity: 30, day: "شنبه",
  start: "08:00", end: "10:00", room: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

function StatusBadge({ status }) {
  const map = {
    draft: ["پیش‌نویس", "bg-amber-50 text-amber-700"],
    published: ["منتشرشده", "bg-emerald-50 text-emerald-700"],
  };
  const [label, cls] = map[status] || map.draft;
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

export default function OfferingCourses() {
  const [offerings, setOfferings] = useState(INITIAL_OFFERINGS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [reviewItem, setReviewItem] = useState(null);

  const departments = [...new Set(offerings.map(x => x.department))];

  const filtered = useMemo(() => offerings.filter(item => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q ||
      [item.title, item.code, item.instructor, item.department]
        .some(value => (value || "").toLowerCase().includes(q));
    return matchesSearch &&
      (statusFilter === "all" || item.status === statusFilter) &&
      (departmentFilter === "all" || item.department === departmentFilter);
  }), [offerings, search, statusFilter, departmentFilter]);

  const publishedCount = offerings.filter(x => x.status === "published").length;
  const draftCount = offerings.filter(x => x.status === "draft").length;
  const totalCapacity = offerings.reduce((sum, x) => sum + Number(x.capacity || 0), 0);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setModal(true);
  }

  function openEdit(item) {
    if (item.status === "published") {
      setNotice("برای جلوگیری از تغییر ناخواسته، ابتدا انتشار این گروه باید لغو شود.");
      return;
    }
    setEditingId(item.id);
    setForm({
      ...EMPTY_FORM,
      ...item,
    });
    setError("");
    setModal(true);
  }

  function updateField(key, value) {
    setForm(current => ({ ...current, [key]: value }));
  }

  function saveOffering(event) {
    event.preventDefault();
    setError("");

    if (!form.code.trim() || !form.title.trim()) {
      setError("کد درس و نام درس الزامی است.");
      return;
    }
    if (!form.instructor.trim() || !form.room.trim()) {
      setError("استاد و محل برگزاری را مشخص کنید.");
      return;
    }
    if (!form.capacity || Number(form.capacity) < 1) {
      setError("ظرفیت باید حداقل یک نفر باشد.");
      return;
    }
    if (form.start >= form.end) {
      setError("ساعت پایان باید بعد از ساعت شروع باشد.");
      return;
    }

    const duplicate = offerings.some(x =>
      x.id !== editingId &&
      x.code.trim().toLowerCase() === form.code.trim().toLowerCase() &&
      x.group === form.group
    );
    if (duplicate) {
      setError("برای این کد درس، گروه انتخاب‌شده قبلاً ثبت شده است.");
      return;
    }

    const normalized = {
      ...form,
      id: editingId ?? Date.now(),
      units: Number(form.units),
      capacity: Number(form.capacity),
      enrolled: editingId
        ? offerings.find(x => x.id === editingId)?.enrolled || 0
        : 0,
      status: "draft",
    };

    setOfferings(current => editingId
      ? current.map(x => x.id === editingId ? normalized : x)
      : [normalized, ...current]
    );
    setModal(false);
    setNotice(editingId ? "اطلاعات گروه درسی به‌روزرسانی شد." : "گروه درسی جدید ثبت شد.");
  }

  function publish(item) {
    const problems = [];
    if (!item.instructor?.trim()) problems.push("استاد مشخص نشده است");
    if (!item.room?.trim()) problems.push("کلاس مشخص نشده است");
    if (!item.code?.trim() || !item.title?.trim()) problems.push("اطلاعات درس ناقص است");
    if (item.start >= item.end) problems.push("بازه زمانی نامعتبر است");

    const conflict = offerings.some(other =>
      other.id !== item.id &&
      other.status === "published" &&
      other.day === item.day &&
      other.room === item.room &&
      item.start < other.end &&
      item.end > other.start
    );
    if (conflict) problems.push("تداخل زمانی با گروه منتشرشده در همین کلاس وجود دارد");

    if (problems.length) {
      setNotice(`امکان انتشار وجود ندارد: ${problems.join("؛ ")}.`);
      return;
    }

    setOfferings(current => current.map(x =>
      x.id === item.id ? { ...x, status: "published" } : x
    ));
    setReviewItem(null);
    setNotice(`گروه ${item.group} درس «${item.title}» منتشر شد.`);
  }

  function unpublish(item) {
    setOfferings(current => current.map(x =>
      x.id === item.id ? { ...x, status: "draft" } : x
    ));
    setNotice("انتشار گروه لغو شد. دانشجویان دیگر نباید آن را برای انتخاب واحد ببینند.");
  }

  function removeOffering() {
    setOfferings(current => current.filter(x => x.id !== deleteId));
    setDeleteId(null);
    setNotice("گروه درسی حذف شد.");
  }

  return (
    <div dir="rtl" className="space-y-6 pb-8 text-slate-800">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <FiBookOpen /> مدیریت آموزشی <span>/</span> دروس ارائه‌شده
          </div>
          <h1 className="text-2xl font-bold">دروس ارائه‌شده</h1>
          <p className="mt-2 text-sm text-slate-500">
            مدیریت گروه‌های درسی نیمسال و انتشار آن‌ها برای انتخاب واحد دانشجویان
          </p>
        </div>
        <button onClick={openCreate} className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}>
          <FiPlus /> افزودن گروه درسی
        </button>
      </div>

      {notice && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="بستن پیام"><FiX /></button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["کل گروه‌ها", offerings.length, <FiBookOpen />],
          ["پیش‌نویس", draftCount, <FiEdit2 />],
          ["منتشرشده", publishedCount, <FiCheck />],
          ["ظرفیت کل", totalCapacity, <FiUsers />],
        ].map(([label, value, icon]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between text-sm text-slate-500">
              {label}
              <span className="rounded-xl bg-slate-100 p-2 text-slate-600">{icon}</span>
            </div>
            <div className="mt-3 text-2xl font-bold">{value.toLocaleString("fa-IR")}</div>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-3">
          <div className="relative">
            <FiSearch className="absolute right-3 top-3 text-slate-400" />
            <input className={`${inputClass} pr-9`} value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="جست‌وجو نام درس، کد یا استاد..." />
          </div>
          <select className={inputClass} value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}>
            <option value="all">همه دانشکده‌ها</option>
            {departments.map(x => <option key={x}>{x}</option>)}
          </select>
          <select className={inputClass} value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">همه وضعیت‌ها</option>
            <option value="draft">پیش‌نویس</option>
            <option value="published">منتشرشده</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-right text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {["درس", "دانشکده / مقطع", "گروه", "استاد", "زمان و مکان", "ظرفیت", "وضعیت", "عملیات"].map(x =>
                  <th key={x} className="px-4 py-3 font-medium">{x}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4">
                    <div className="font-semibold">{item.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.code} · {item.units} واحد</div>
                  </td>
                  <td className="px-4 py-4">
                    <div>{item.department}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.level} · ورودی {item.entryYear}</div>
                  </td>
                  <td className="px-4 py-4">{item.group}</td>
                  <td className="px-4 py-4">{item.instructor || "تعیین نشده"}</td>
                  <td className="px-4 py-4">
                    <div>{item.day}، {item.start} تا {item.end}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.room || "کلاس تعیین نشده"}</div>
                  </td>
                  <td className="px-4 py-4">{item.enrolled} / {item.capacity}</td>
                  <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {item.status === "draft" ? (
                        <>
                          <button title="ویرایش" onClick={() => openEdit(item)} className={`${buttonClass} border border-slate-200 p-2`}><FiEdit2 /></button>
                          <button title="بررسی و انتشار" onClick={() => setReviewItem(item)} className={`${buttonClass} bg-emerald-50 p-2 text-emerald-700`}><FiSend /></button>
                          <button title="حذف" onClick={() => setDeleteId(item.id)} className={`${buttonClass} bg-red-50 p-2 text-red-600`}><FiTrash2 /></button>
                        </>
                      ) : (
                        <button onClick={() => unpublish(item)} className={`${buttonClass} border border-amber-200 bg-amber-50 text-amber-800`}>
                          لغو انتشار
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="8" className="p-10 text-center text-slate-500">موردی پیدا نشد.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          نمایش {filtered.length.toLocaleString("fa-IR")} گروه درسی · اطلاعات نمونه
        </div>
      </section>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4">
          <form onSubmit={saveOffering} className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-bold">{editingId ? "ویرایش گروه درسی" : "افزودن گروه درسی"}</h2>
                <p className="mt-1 text-xs text-slate-500">پس از ثبت، گروه در وضعیت پیش‌نویس قرار می‌گیرد.</p>
              </div>
              <button type="button" onClick={() => setModal(false)}><FiX size={20} /></button>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="کد درس"><input className={inputClass} value={form.code} onChange={e => updateField("code", e.target.value)} /></Field>
              <Field label="نام درس"><input className={inputClass} value={form.title} onChange={e => updateField("title", e.target.value)} /></Field>
              <Field label="تعداد واحد"><input type="number" min="1" max="6" className={inputClass} value={form.units} onChange={e => updateField("units", e.target.value)} /></Field>
              <Field label="دانشکده">
                <select className={inputClass} value={form.department} onChange={e => updateField("department", e.target.value)}>
                  <option>مهندسی کامپیوتر</option><option>علوم پایه</option><option>مهندسی برق</option><option>مدیریت</option>
                </select>
              </Field>
              <Field label="مقطع">
                <select className={inputClass} value={form.level} onChange={e => updateField("level", e.target.value)}>
                  <option>کاردانی</option><option>کارشناسی</option><option>کارشناسی ارشد</option><option>دکتری</option>
                </select>
              </Field>
              <Field label="سال ورود">
                <select className={inputClass} value={form.entryYear} onChange={e => updateField("entryYear", e.target.value)}>
                  <option>۱۴۰۱</option><option>۱۴۰۲</option><option>۱۴۰۳</option><option>۱۴۰۴</option><option>همه ورودی‌ها</option>
                </select>
              </Field>
              <Field label="شماره گروه"><input className={inputClass} value={form.group} onChange={e => updateField("group", e.target.value)} /></Field>
              <Field label="استاد">
                <input className={inputClass} value={form.instructor} onChange={e => updateField("instructor", e.target.value)} />
              </Field>
              <Field label="ظرفیت"><input type="number" min="1" className={inputClass} value={form.capacity} onChange={e => updateField("capacity", e.target.value)} /></Field>
              <Field label="روز کلاس">
                <select className={inputClass} value={form.day} onChange={e => updateField("day", e.target.value)}>
                  {["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه"].map(x => <option key={x}>{x}</option>)}
                </select>
              </Field>
              <Field label="ساعت شروع"><input type="time" className={inputClass} value={form.start} onChange={e => updateField("start", e.target.value)} /></Field>
              <Field label="ساعت پایان"><input type="time" className={inputClass} value={form.end} onChange={e => updateField("end", e.target.value)} /></Field>
              <div className="sm:col-span-2 lg:col-span-3">
                <Field label="محل برگزاری"><input className={inputClass} value={form.room} onChange={e => updateField("room", e.target.value)} placeholder="مثلاً ساختمان مهندسی، کلاس ۲۰۱" /></Field>
              </div>
            </div>
            {error && <div className="mx-5 mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <div className="flex justify-end gap-2 border-t p-5">
              <button type="button" onClick={() => setModal(false)} className={`${buttonClass} border border-slate-200`}>انصراف</button>
              <button type="submit" className={`${buttonClass} bg-blue-600 text-white`}><FiCheck /> ثبت گروه درسی</button>
            </div>
          </form>
        </div>
      )}

      {reviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-blue-50 p-3 text-blue-700"><FiEye size={22} /></span>
              <div><h2 className="font-bold">بررسی و انتشار گروه</h2><p className="mt-1 text-sm text-slate-500">{reviewItem.title} · گروه {reviewItem.group}</p></div>
            </div>
            <div className="my-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between gap-3"><span className="text-slate-500">استاد</span><span>{reviewItem.instructor || "تعیین نشده"}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-500">زمان</span><span>{reviewItem.day}، {reviewItem.start} تا {reviewItem.end}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-500">کلاس</span><span>{reviewItem.room || "تعیین نشده"}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-500">ظرفیت</span><span>{reviewItem.capacity} نفر</span></div>
            </div>
            <p className="mb-5 flex gap-2 text-xs leading-6 text-amber-800"><FiAlertCircle className="mt-1 shrink-0" /> انتشار این گروه یعنی اطلاعات آن برای فرایند انتخاب واحد قابل ارائه است. فعال‌شدن انتخاب واحد همچنان تابع زمان‌بندی دانشجویان است.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setReviewItem(null)} className={`${buttonClass} border border-slate-200`}>بازگشت</button>
              <button onClick={() => publish(reviewItem)} className={`${buttonClass} bg-emerald-600 text-white`}><FiSend /> تأیید و انتشار</button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-bold">حذف گروه درسی؟</h2>
            <p className="my-3 text-sm leading-6 text-slate-500">این عملیات در نسخه نمونه قابل بازگشت نیست.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className={`${buttonClass} border border-slate-200`}>انصراف</button>
              <button onClick={removeOffering} className={`${buttonClass} bg-red-600 text-white`}><FiTrash2 /> حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
