import { useMemo, useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const initialStudents = [
  {
    id: 1,
    studentNumber: "14021001",
    name: "علی محمدی",
    field: "مهندسی کامپیوتر",
    degree: "کارشناسی",
    entryYear: "1402",
    status: "شاغل به تحصیل",
  },
  {
    id: 2,
    studentNumber: "14011002",
    name: "سارا احمدی",
    field: "مهندسی برق",
    degree: "کارشناسی",
    entryYear: "1401",
    status: "شاغل به تحصیل",
  },
  {
    id: 3,
    studentNumber: "14001003",
    name: "محمد رضایی",
    field: "مهندسی کامپیوتر",
    degree: "کارشناسی ارشد",
    entryYear: "1400",
    status: "فارغ‌التحصیل",
  },
  {
    id: 4,
    studentNumber: "14031004",
    name: "نگار کریمی",
    field: "مدیریت",
    degree: "کارشناسی",
    entryYear: "1403",
    status: "شاغل به تحصیل",
  },
  {
    id: 5,
    studentNumber: "14021005",
    name: "امیر حسینی",
    field: "مهندسی برق",
    degree: "کارشناسی",
    entryYear: "1402",
    status: "مرخصی تحصیلی",
  },
  {
    id: 6,
    studentNumber: "14011006",
    name: "مریم کاظمی",
    field: "مهندسی کامپیوتر",
    degree: "کارشناسی ارشد",
    entryYear: "1401",
    status: "شاغل به تحصیل",
  },
  {
    id: 7,
    studentNumber: "14031007",
    name: "رضا جعفری",
    field: "حسابداری",
    degree: "کارشناسی",
    entryYear: "1403",
    status: "شاغل به تحصیل",
  },
  {
    id: 8,
    studentNumber: "14021008",
    name: "زهرا موسوی",
    field: "مدیریت",
    degree: "کارشناسی",
    entryYear: "1402",
    status: "انصراف",
  },
];

const emptyForm = {
  studentNumber: "",
  name: "",
  field: "مهندسی کامپیوتر",
  degree: "کارشناسی",
  entryYear: "1405",
  status: "شاغل به تحصیل",
};

const statusStyles = {
  "شاغل به تحصیل": "bg-emerald-50 text-emerald-700",
  فارغ‌التحصیل: "bg-blue-50 text-blue-700",
  "مرخصی تحصیلی": "bg-amber-50 text-amber-700",
  انصراف: "bg-rose-50 text-rose-700",
};

function SummaryCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{title}</p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-slate-800">{value}</p>
    </div>
  );
}

export default function Students() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [fieldFilter, setFieldFilter] = useState("همه");
  const [statusFilter, setStatusFilter] = useState("همه");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const pageSize = 5;

  const fields = ["مهندسی کامپیوتر", "مهندسی برق", "مدیریت", "حسابداری"];

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        [
          student.studentNumber,
          student.name,
          student.field,
          student.degree,
          student.entryYear,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesField =
        fieldFilter === "همه" || student.field === fieldFilter;

      const matchesStatus =
        statusFilter === "همه" || student.status === statusFilter;

      return matchesSearch && matchesField && matchesStatus;
    });
  }, [students, search, fieldFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const visibleStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const enrolledCount = students.filter(
    (student) => student.status === "شاغل به تحصیل",
  ).length;

  const graduatedCount = students.filter(
    (student) => student.status === "فارغ‌التحصیل",
  ).length;

  function openAddModal() {
    setEditingStudent(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(student) {
    setEditingStudent(student);
    setForm({
      studentNumber: student.studentNumber,
      name: student.name,
      field: student.field,
      degree: student.degree,
      entryYear: student.entryYear,
      status: student.status,
    });
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingStudent(null);
    setError("");
  }

  function updateForm(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.studentNumber.trim() ||
      !form.name.trim() ||
      !form.entryYear.trim()
    ) {
      setError("شماره دانشجویی، نام و سال ورود الزامی است.");
      return;
    }

    const duplicateNumber = students.some(
      (student) =>
        student.studentNumber.trim() === form.studentNumber.trim() &&
        student.id !== editingStudent?.id,
    );

    if (duplicateNumber) {
      setError("این شماره دانشجویی قبلاً ثبت شده است.");
      return;
    }

    const normalizedForm = {
      ...form,
      studentNumber: form.studentNumber.trim(),
      name: form.name.trim(),
      entryYear: form.entryYear.trim(),
    };

    if (editingStudent) {
      setStudents((previous) =>
        previous.map((student) =>
          student.id === editingStudent.id
            ? { ...student, ...normalizedForm }
            : student,
        ),
      );
    } else {
      setStudents((previous) => [
        ...previous,
        { id: Date.now(), ...normalizedForm },
      ]);
      setPage(Math.ceil((filteredStudents.length + 1) / pageSize));
    }

    closeModal();
  }

  function handleDelete(student) {
    const confirmed = window.confirm(
      `آیا از حذف دانشجوی «${student.name}» با شماره ${student.studentNumber} مطمئن هستید؟`,
    );

    if (!confirmed) return;

    setStudents((previous) =>
      previous.filter((item) => item.id !== student.id),
    );
    setPage(1);
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* عنوان و عملیات */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <FiUsers size={16} />
            مدیریت آموزشی
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-800">
            مدیریت دانشجویان
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            اطلاعات تحصیلی دانشجویان را مشاهده و مدیریت کنید.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          افزودن دانشجو
        </button>
      </section>

      {/* آمار */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="کل دانشجویان"
          value={students.length}
          icon={FiUsers}
          color="bg-blue-50 text-blue-700"
        />
        <SummaryCard
          title="شاغل به تحصیل"
          value={enrolledCount}
          icon={FiUsers}
          color="bg-emerald-50 text-emerald-700"
        />
        <SummaryCard
          title="فارغ‌التحصیل"
          value={graduatedCount}
          icon={FiUserCheck}
          color="bg-violet-50 text-violet-700"
        />
      </section>

      {/* فیلترها و جدول */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-1 gap-3 border-b border-slate-100 p-4 lg:grid-cols-[minmax(240px,1fr)_220px_200px]">
          <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-blue-400">
            <FiSearch size={18} className="shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="جست‌وجوی نام یا شماره دانشجویی..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>

          <select
            value={fieldFilter}
            onChange={(event) => {
              setFieldFilter(event.target.value);
              setPage(1);
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
          >
            <option value="همه">همه رشته‌ها</option>
            {fields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
          >
            <option value="همه">همه وضعیت‌ها</option>
            <option value="شاغل به تحصیل">شاغل به تحصیل</option>
            <option value="فارغ‌التحصیل">فارغ‌التحصیل</option>
            <option value="مرخصی تحصیلی">مرخصی تحصیلی</option>
            <option value="انصراف">انصراف</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-right">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">دانشجو</th>
                <th className="px-5 py-4 font-semibold">شماره دانشجویی</th>
                <th className="px-5 py-4 font-semibold">رشته</th>
                <th className="px-5 py-4 font-semibold">مقطع</th>
                <th className="px-5 py-4 font-semibold">سال ورود</th>
                <th className="px-5 py-4 font-semibold">وضعیت</th>
                <th className="px-5 py-4 text-center font-semibold">عملیات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {visibleStudents.map((student) => (
                <tr
                  key={student.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                        {student.name.slice(0, 1)}
                      </div>
                      <span className="whitespace-nowrap text-sm font-semibold text-slate-800">
                        {student.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {student.studentNumber}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {student.field}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {student.degree}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {student.entryYear}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                        statusStyles[student.status] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        title="ویرایش دانشجو"
                        aria-label={`ویرایش ${student.name}`}
                        onClick={() => openEditModal(student)}
                        className="rounded-lg p-2 text-blue-700 transition hover:bg-blue-50"
                      >
                        <FiEdit2 size={17} />
                      </button>

                      <button
                        type="button"
                        title="حذف دانشجو"
                        aria-label={`حذف ${student.name}`}
                        onClick={() => handleDelete(student)}
                        className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    دانشجویی با این مشخصات پیدا نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {filteredStudents.length === 0
              ? "دانشجویی برای نمایش وجود ندارد."
              : `نمایش ${(currentPage - 1) * pageSize + 1} تا ${Math.min(
                  currentPage * pageSize,
                  filteredStudents.length,
                )} از ${filteredStudents.length} دانشجو`}
          </p>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              aria-label="صفحه قبلی"
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronRight size={18} />
            </button>

            <span className="min-w-20 text-center text-sm text-slate-600">
              صفحه {currentPage} از {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setPage((previous) => Math.min(totalPages, previous + 1))
              }
              aria-label="صفحه بعدی"
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronLeft size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* فرم افزودن و ویرایش */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-modal-title"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2
                  id="student-modal-title"
                  className="text-lg font-extrabold text-slate-800"
                >
                  {editingStudent ? "ویرایش دانشجو" : "افزودن دانشجوی جدید"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  اطلاعات تحصیلی را تکمیل کنید.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="بستن فرم"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    نام و نام خانوادگی
                  </label>
                  <input
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    placeholder="نام دانشجو"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    شماره دانشجویی
                  </label>
                  <input
                    value={form.studentNumber}
                    onChange={(event) =>
                      updateForm("studentNumber", event.target.value)
                    }
                    placeholder="مثلاً 14051001"
                    dir="ltr"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    رشته تحصیلی
                  </label>
                  <select
                    value={form.field}
                    onChange={(event) =>
                      updateForm("field", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    {fields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    مقطع تحصیلی
                  </label>
                  <select
                    value={form.degree}
                    onChange={(event) =>
                      updateForm("degree", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="کاردانی">کاردانی</option>
                    <option value="کارشناسی">کارشناسی</option>
                    <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                    <option value="دکتری">دکتری</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    سال ورود
                  </label>
                  <input
                    value={form.entryYear}
                    onChange={(event) =>
                      updateForm("entryYear", event.target.value)
                    }
                    placeholder="مثلاً 1405"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    وضعیت تحصیلی
                  </label>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="شاغل به تحصیل">شاغل به تحصیل</option>
                    <option value="فارغ‌التحصیل">فارغ‌التحصیل</option>
                    <option value="مرخصی تحصیلی">مرخصی تحصیلی</option>
                    <option value="انصراف">انصراف</option>
                  </select>
                </div>
              </div>

              {error && (
                <p className="rounded-xl bg-rose-50 px-3 py-3 text-sm text-rose-700">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  {editingStudent ? "ذخیره تغییرات" : "ثبت دانشجو"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
