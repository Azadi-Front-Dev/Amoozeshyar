import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiX,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";

const initialUsers = [
  {
    id: 1,
    name: "علی محمدی",
    username: "ali.mohammadi",
    email: "ali@example.com",
    role: "دانشجو",
    status: "فعال",
  },
  {
    id: 2,
    name: "سارا احمدی",
    username: "sara.ahmadi",
    email: "sara@example.com",
    role: "استاد",
    status: "فعال",
  },
  {
    id: 3,
    name: "محمد رضایی",
    username: "mohammad.rezaei",
    email: "m.rezaei@example.com",
    role: "کارمند",
    status: "غیرفعال",
  },
  {
    id: 4,
    name: "نگار کریمی",
    username: "negar.karimi",
    email: "negar@example.com",
    role: "مدیر",
    status: "فعال",
  },
  {
    id: 5,
    name: "امیر حسینی",
    username: "amir.hosseini",
    email: "amir@example.com",
    role: "دانشجو",
    status: "فعال",
  },
  {
    id: 6,
    name: "مریم کاظمی",
    username: "maryam.kazemi",
    email: "maryam@example.com",
    role: "استاد",
    status: "غیرفعال",
  },
  {
    id: 7,
    name: "رضا جعفری",
    username: "reza.jafari",
    email: "reza@example.com",
    role: "کارمند",
    status: "فعال",
  },
  {
    id: 8,
    name: "زهرا موسوی",
    username: "zahra.mousavi",
    email: "zahra@example.com",
    role: "دانشجو",
    status: "فعال",
  },
];

const emptyForm = {
  name: "",
  username: "",
  email: "",
  role: "دانشجو",
  status: "فعال",
};

const roleStyles = {
  مدیر: "bg-violet-50 text-violet-700",
  استاد: "bg-blue-50 text-blue-700",
  دانشجو: "bg-cyan-50 text-cyan-700",
  کارمند: "bg-amber-50 text-amber-700",
};

function StatBox({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-slate-800">{value}</p>
    </div>
  );
}

export default function Users() {
  const { search: globalSearch = "" } = useOutletContext() || {};

  const [users, setUsers] = useState(initialUsers);
  const [localSearch, setLocalSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("همه");
  const [statusFilter, setStatusFilter] = useState("همه");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const pageSize = 5;

  const filteredUsers = useMemo(() => {
    const query = `${globalSearch} ${localSearch}`.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.name, user.username, user.email, user.role].some((value) =>
          value.toLowerCase().includes(query),
        );

      const matchesRole = roleFilter === "همه" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "همه" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, globalSearch, localSearch, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const activeCount = users.filter((user) => user.status === "فعال").length;
  const inactiveCount = users.length - activeCount;

  function openAddModal() {
    setEditingUser(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(user) {
    setEditingUser(user);
    setForm({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingUser(null);
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.username.trim() || !form.email.trim()) {
      setError("لطفاً تمام فیلدهای ضروری را تکمیل کنید.");
      return;
    }

    const duplicateUsername = users.some(
      (user) =>
        user.username.trim().toLowerCase() ===
          form.username.trim().toLowerCase() && user.id !== editingUser?.id,
    );

    if (duplicateUsername) {
      setError("این نام کاربری قبلاً ثبت شده است.");
      return;
    }

    const normalizedForm = {
      ...form,
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
    };

    if (editingUser) {
      setUsers((previous) =>
        previous.map((user) =>
          user.id === editingUser.id ? { ...user, ...normalizedForm } : user,
        ),
      );
    } else {
      setUsers((previous) => [
        ...previous,
        { id: Date.now(), ...normalizedForm },
      ]);
      setPage(Math.ceil((filteredUsers.length + 1) / pageSize));
    }

    closeModal();
  }

  function handleDelete(user) {
    const confirmed = window.confirm(
      `آیا از حذف کاربر «${user.name}» مطمئن هستید؟`,
    );

    if (!confirmed) return;

    setUsers((previous) => previous.filter((item) => item.id !== user.id));
    setPage(1);
  }

  function updateForm(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <FiUsers size={16} />
            مدیریت آموزشی
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-800">
            مدیریت کاربران
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            حساب‌های کاربری و نقش‌های سامانه را مدیریت کنید.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
        >
          <FiPlus size={19} />
          افزودن کاربر
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatBox label="کل کاربران" value={users.length} icon={FiUsers} />
        <StatBox label="کاربران فعال" value={activeCount} icon={FiUsers} />
        <StatBox label="کاربران غیرفعال" value={inactiveCount} icon={FiUsers} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-slate-200 px-3 lg:max-w-sm lg:flex-1">
            <FiSearch className="shrink-0 text-slate-400" size={18} />
            <input
              value={localSearch}
              onChange={(event) => {
                setLocalSearch(event.target.value);
                setPage(1);
              }}
              placeholder="جست‌وجوی نام، نام کاربری یا ایمیل..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
            <select
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(event.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400"
            >
              <option value="همه">همه نقش‌ها</option>
              <option value="مدیر">مدیر</option>
              <option value="استاد">استاد</option>
              <option value="دانشجو">دانشجو</option>
              <option value="کارمند">کارمند</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400"
            >
              <option value="همه">همه وضعیت‌ها</option>
              <option value="فعال">فعال</option>
              <option value="غیرفعال">غیرفعال</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-right">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">کاربر</th>
                <th className="px-5 py-4 font-semibold">نام کاربری</th>
                <th className="px-5 py-4 font-semibold">ایمیل</th>
                <th className="px-5 py-4 font-semibold">نقش</th>
                <th className="px-5 py-4 font-semibold">وضعیت</th>
                <th className="px-5 py-4 text-center font-semibold">عملیات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {visibleUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                        {user.name.slice(0, 1)}
                      </div>
                      <span className="whitespace-nowrap text-sm font-semibold text-slate-800">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {user.username}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {user.email}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                        roleStyles[user.role] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-2 text-xs font-medium ${
                        user.status === "فعال"
                          ? "text-emerald-700"
                          : "text-slate-500"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          user.status === "فعال"
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        title="ویرایش کاربر"
                        aria-label={`ویرایش ${user.name}`}
                        onClick={() => openEditModal(user)}
                        className="rounded-lg p-2 text-blue-700 transition hover:bg-blue-50"
                      >
                        <FiEdit2 size={17} />
                      </button>

                      <button
                        type="button"
                        title="حذف کاربر"
                        aria-label={`حذف ${user.name}`}
                        onClick={() => handleDelete(user)}
                        className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    کاربری با این مشخصات پیدا نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {filteredUsers.length === 0
              ? "هیچ کاربری برای نمایش وجود ندارد."
              : `نمایش ${(currentPage - 1) * pageSize + 1} تا ${Math.min(
                  currentPage * pageSize,
                  filteredUsers.length,
                )} از ${filteredUsers.length} کاربر`}
          </p>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="صفحه قبلی"
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
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="صفحه بعدی"
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
            aria-labelledby="user-modal-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2
                  id="user-modal-title"
                  className="text-lg font-extrabold text-slate-800"
                >
                  {editingUser ? "ویرایش کاربر" : "افزودن کاربر جدید"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  اطلاعات حساب کاربری را وارد کنید.
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
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  نام و نام خانوادگی
                </label>
                <input
                  autoFocus
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="مثلاً علی محمدی"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  نام کاربری
                </label>
                <input
                  value={form.username}
                  onChange={(event) =>
                    updateForm("username", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="مثلاً ali.mohammadi"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  ایمیل
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateForm("email", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="user@example.com"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    نقش کاربر
                  </label>
                  <select
                    value={form.role}
                    onChange={(event) => updateForm("role", event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="دانشجو">دانشجو</option>
                    <option value="استاد">استاد</option>
                    <option value="کارمند">کارمند</option>
                    <option value="مدیر">مدیر</option>
                  </select>
                </div>

                <div>
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
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  {editingUser ? "ذخیره تغییرات" : "ثبت کاربر"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
