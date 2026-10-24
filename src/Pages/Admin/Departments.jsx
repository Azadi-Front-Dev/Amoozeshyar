import { useMemo, useState } from "react";
import {
  FiHome,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
} from "react-icons/fi";

const initialDepartments = [
  {
    id: 1,
    code: "ENG-01",
    name: "دانشکده فنی و مهندسی",
    dean: "دکتر رضا احمدی",
    phone: "021-44551001",
    status: "فعال",
  },
  {
    id: 2,
    code: "SCI-02",
    name: "دانشکده علوم پایه",
    dean: "دکتر مریم کاظمی",
    phone: "021-44551002",
    status: "فعال",
  },
  {
    id: 3,
    code: "HUM-03",
    name: "دانشکده علوم انسانی",
    dean: "دکتر علی رضایی",
    phone: "021-44551003",
    status: "فعال",
  },
  {
    id: 4,
    code: "ART-04",
    name: "دانشکده هنر و معماری",
    dean: "دکتر سارا محمدی",
    phone: "021-44551004",
    status: "غیرفعال",
  },
  {
    id: 5,
    code: "MGT-05",
    name: "دانشکده مدیریت و اقتصاد",
    dean: "دکتر نگار کریمی",
    phone: "021-44551005",
    status: "فعال",
  },
];

const emptyForm = {
  code: "",
  name: "",
  dean: "",
  phone: "",
  status: "فعال",
};

function StatCard({ title, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{title}</p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-slate-800">{value}</p>
    </div>
  );
}

export default function Departments() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("همه");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const pageSize = 5;

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return departments.filter((department) => {
      const matchesSearch =
        !query ||
        [
          department.code,
          department.name,
          department.dean,
          department.phone,
        ].some((value) => value.toLowerCase().includes(query));
      const matchesStatus =
        statusFilter === "همه" || department.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [departments, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDepartments.length / pageSize),
  );
  const currentPage = Math.min(page, totalPages);
  const visibleDepartments = filteredDepartments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const activeCount = departments.filter(
    (item) => item.status === "فعال",
  ).length;
  const inactiveCount = departments.filter(
    (item) => item.status === "غیرفعال",
  ).length;

  function openAddModal() {
    setEditingDepartment(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(department) {
    setEditingDepartment(department);
    setForm({
      code: department.code,
      name: department.name,
      dean: department.dean,
      phone: department.phone,
      status: department.status,
    });
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingDepartment(null);
    setError("");
  }

  function updateForm(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.code.trim() || !form.name.trim()) {
      setError("کد و نام دانشکده الزامی است.");
      return;
    }

    const duplicateCode = departments.some(
      (item) =>
        item.code.trim().toLowerCase() === form.code.trim().toLowerCase() &&
        item.id !== editingDepartment?.id,
    );
    if (duplicateCode) {
      setError("این کد دانشکده قبلاً ثبت شده است.");
      return;
    }

    const normalizedForm = {
      code: form.code.trim(),
      name: form.name.trim(),
      dean: form.dean.trim(),
      phone: form.phone.trim(),
      status: form.status,
    };

    if (editingDepartment) {
      setDepartments((previous) =>
        previous.map((item) =>
          item.id === editingDepartment.id
            ? { ...item, ...normalizedForm }
            : item,
        ),
      );
    } else {
      setDepartments((previous) => [
        ...previous,
        { id: Date.now(), ...normalizedForm },
      ]);
      setPage(Math.ceil((filteredDepartments.length + 1) / pageSize));
    }
    closeModal();
  }

  function handleDelete(department) {
    const confirmed = window.confirm(
      `آیا از حذف «${department.name}» مطمئن هستید؟`,
    );
    if (!confirmed) return;
    setDepartments((previous) =>
      previous.filter((item) => item.id !== department.id),
    );
    setPage(1);
  }

  return (
    <div className="space-y-6" dir="rtl">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <FiHome size={16} />
            مدیریت آموزشی
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-800">
            مدیریت دانشکده‌ها
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            اطلاعات دانشکده‌ها، کدها و وضعیت فعالیت آن‌ها را مدیریت کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          افزودن دانشکده
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="کل دانشکده‌ها"
          value={departments.length}
          icon={FiHome}
          iconClass="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="دانشکده‌های فعال"
          value={activeCount}
          icon={FiCheckCircle}
          iconClass="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="دانشکده‌های غیرفعال"
          value={inactiveCount}
          icon={FiX}
          iconClass="bg-rose-50 text-rose-700"
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-1 gap-3 border-b border-slate-100 p-4 md:grid-cols-[minmax(240px,1fr)_220px]">
          <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-blue-400">
            <FiSearch size={18} className="shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="جست‌وجوی نام، کد، رئیس یا تلفن دانشکده..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
          >
            <option value="همه">همه وضعیت‌ها</option>
            <option value="فعال">فعال</option>
            <option value="غیرفعال">غیرفعال</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-right">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">کد دانشکده</th>
                <th className="px-5 py-4 font-semibold">نام دانشکده</th>
                <th className="px-5 py-4 font-semibold">رئیس دانشکده</th>
                <th className="px-5 py-4 font-semibold">شماره تماس</th>
                <th className="px-5 py-4 font-semibold">وضعیت</th>
                <th className="px-5 py-4 text-center font-semibold">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleDepartments.map((department) => (
                <tr
                  key={department.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td
                    className="px-5 py-4 text-sm font-medium text-slate-600"
                    dir="ltr"
                  >
                    {department.code}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                    {department.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {department.dean || "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600" dir="ltr">
                    {department.phone || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold ${department.status === "فعال" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      {department.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        title="ویرایش دانشکده"
                        aria-label={`ویرایش ${department.name}`}
                        onClick={() => openEditModal(department)}
                        className="rounded-lg p-2 text-blue-700 transition hover:bg-blue-50"
                      >
                        <FiEdit2 size={17} />
                      </button>
                      <button
                        type="button"
                        title="حذف دانشکده"
                        aria-label={`حذف ${department.name}`}
                        onClick={() => handleDelete(department)}
                        className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleDepartments.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    دانشکده‌ای با این مشخصات پیدا نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {filteredDepartments.length === 0
              ? "دانشکده‌ای برای نمایش وجود ندارد."
              : `نمایش ${(currentPage - 1) * pageSize + 1} تا ${Math.min(currentPage * pageSize, filteredDepartments.length)} از ${filteredDepartments.length} دانشکده`}
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
            aria-labelledby="department-modal-title"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2
                  id="department-modal-title"
                  className="text-lg font-extrabold text-slate-800"
                >
                  {editingDepartment ? "ویرایش دانشکده" : "افزودن دانشکده جدید"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  اطلاعات دانشکده را وارد کنید.
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
                    نام دانشکده *
                  </label>
                  <input
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    placeholder="مثلاً دانشکده فنی و مهندسی"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    کد دانشکده *
                  </label>
                  <input
                    value={form.code}
                    onChange={(event) => updateForm("code", event.target.value)}
                    placeholder="مثلاً ENG-01"
                    dir="ltr"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    رئیس دانشکده
                  </label>
                  <input
                    value={form.dean}
                    onChange={(event) => updateForm("dean", event.target.value)}
                    placeholder="نام و نام خانوادگی"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    شماره تماس
                  </label>
                  <input
                    value={form.phone}
                    onChange={(event) =>
                      updateForm("phone", event.target.value)
                    }
                    placeholder="021-12345678"
                    dir="ltr"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    وضعیت
                  </label>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="فعال">فعال</option>
                    <option value="غیرفعال">غیرفعال</option>
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
                  {editingDepartment ? "ذخیره تغییرات" : "ثبت دانشکده"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
