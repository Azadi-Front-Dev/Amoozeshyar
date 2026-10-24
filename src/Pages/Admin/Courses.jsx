import { useMemo, useState } from "react";
import {
  FiBookOpen,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";

const faculties = ["دانشکده فنی و مهندسی", "دانشکده علوم انسانی"];
const departmentsByFaculty = {
  "دانشکده فنی و مهندسی": ["مهندسی کامپیوتر", "مهندسی برق"],
  "دانشکده علوم انسانی": ["مدیریت", "حسابداری"],
};
const semesters = [
  { value: "1405-1", label: "نیمسال اول ۱۴۰۵ (جاری)" },
  { value: "1405-2", label: "نیمسال دوم ۱۴۰۵" },
  { value: "1404-2", label: "نیمسال دوم ۱۴۰۴" },
];
const statuses = ["ارائه شده", "برنامه‌ریزی‌شده", "پایان‌یافته"];
const initialCourses = [
  {
    id: 1,
    code: "CE101",
    name: "برنامه‌سازی پیشرفته",
    faculty: faculties[0],
    department: "مهندسی کامپیوتر",
    semester: "1405-1",
    instructor: "دکتر رضایی",
    credits: 3,
    capacity: 35,
    status: "ارائه شده",
  },
  {
    id: 2,
    code: "CE204",
    name: "ساختمان داده‌ها",
    faculty: faculties[0],
    department: "مهندسی کامپیوتر",
    semester: "1405-1",
    instructor: "دکتر احمدی",
    credits: 3,
    capacity: 30,
    status: "ارائه شده",
  },
  {
    id: 3,
    code: "EE110",
    name: "مدارهای الکتریکی",
    faculty: faculties[0],
    department: "مهندسی برق",
    semester: "1405-1",
    instructor: "مهندس کریمی",
    credits: 3,
    capacity: 40,
    status: "ارائه شده",
  },
  {
    id: 4,
    code: "MG101",
    name: "اصول مدیریت",
    faculty: faculties[1],
    department: "مدیریت",
    semester: "1405-1",
    instructor: "دکتر موسوی",
    credits: 2,
    capacity: 45,
    status: "ارائه شده",
  },
  {
    id: 5,
    code: "CE305",
    name: "پایگاه داده‌ها",
    faculty: faculties[0],
    department: "مهندسی کامپیوتر",
    semester: "1404-2",
    instructor: "دکتر رضایی",
    credits: 3,
    capacity: 32,
    status: "پایان‌یافته",
  },
  {
    id: 6,
    code: "AC202",
    name: "حسابداری میانه",
    faculty: faculties[1],
    department: "حسابداری",
    semester: "1405-1",
    instructor: "دکتر جعفری",
    credits: 3,
    capacity: 35,
    status: "ارائه شده",
  },
  {
    id: 7,
    code: "CE401",
    name: "مهندسی نرم‌افزار",
    faculty: faculties[0],
    department: "مهندسی کامپیوتر",
    semester: "1405-2",
    instructor: "دکتر احمدی",
    credits: 3,
    capacity: 30,
    status: "برنامه‌ریزی‌شده",
  },
];
const emptyForm = {
  code: "",
  name: "",
  faculty: faculties[0],
  department: "مهندسی کامپیوتر",
  semester: "1405-1",
  instructor: "",
  credits: "3",
  capacity: "30",
  status: "ارائه شده",
};
const statusClasses = {
  "ارائه شده": "bg-emerald-50 text-emerald-700",
  برنامه‌ریزی‌شده: "bg-blue-50 text-blue-700",
  پایان‌یافته: "bg-slate-100 text-slate-600",
};
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500";

function StatCard({ title, value, icon: Icon, color }) {
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
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function Courses() {
  const [courses, setCourses] = useState(initialCourses);
  const [facultyFilter, setFacultyFilter] = useState("همه");
  const [semesterFilter, setSemesterFilter] = useState("1405-1");
  const [departmentFilter, setDepartmentFilter] = useState("همه");
  const [statusFilter, setStatusFilter] = useState("همه");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [error, setError] = useState("");
  const pageSize = 5;

  const availableDepartments =
    facultyFilter === "همه"
      ? [...new Set(Object.values(departmentsByFaculty).flat())]
      : departmentsByFaculty[facultyFilter] || [];

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        [course.code, course.name, course.instructor, course.department].some(
          (value) => value.toLocaleLowerCase().includes(query),
        );
      return (
        matchesSearch &&
        (facultyFilter === "همه" || course.faculty === facultyFilter) &&
        (semesterFilter === "همه" || course.semester === semesterFilter) &&
        (departmentFilter === "همه" ||
          course.department === departmentFilter) &&
        (statusFilter === "همه" || course.status === statusFilter)
      );
    });
  }, [
    courses,
    search,
    facultyFilter,
    semesterFilter,
    departmentFilter,
    statusFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const currentSemesterCount = courses.filter(
    (course) => course.semester === "1405-1",
  ).length;
  const offeredCount = courses.filter(
    (course) =>
      course.semester === semesterFilter && course.status === "ارائه شده",
  ).length;
  const creditsCount = filteredCourses.reduce(
    (sum, course) => sum + Number(course.credits || 0),
    0,
  );

  function updateForm(key, value) {
    setForm((previous) => {
      const next = { ...previous, [key]: value };
      if (key === "faculty")
        next.department = (departmentsByFaculty[value] || [""])[0];
      return next;
    });
  }
  function openAddModal() {
    setEditingCourse(null);
    setForm({ ...emptyForm });
    setError("");
    setModalOpen(true);
  }
  function openEditModal(course) {
    setEditingCourse(course);
    setForm({
      ...course,
      credits: String(course.credits),
      capacity: String(course.capacity),
    });
    setError("");
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditingCourse(null);
    setError("");
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (
      !form.code.trim() ||
      !form.name.trim() ||
      !form.instructor.trim() ||
      !form.faculty ||
      !form.department
    ) {
      setError("کد درس، نام درس، استاد و اطلاعات آموزشی الزامی است.");
      return;
    }
    const duplicate = courses.some(
      (course) =>
        course.code.trim().toLowerCase() === form.code.trim().toLowerCase() &&
        course.id !== editingCourse?.id &&
        course.semester === form.semester,
    );
    if (duplicate) {
      setError("این کد درس در نیمسال انتخاب‌شده قبلاً ثبت شده است.");
      return;
    }
    const normalized = {
      ...form,
      code: form.code.trim(),
      name: form.name.trim(),
      instructor: form.instructor.trim(),
      credits: Number(form.credits),
      capacity: Number(form.capacity),
    };
    if (editingCourse)
      setCourses((previous) =>
        previous.map((course) =>
          course.id === editingCourse.id
            ? { ...course, ...normalized }
            : course,
        ),
      );
    else {
      setCourses((previous) => [
        ...previous,
        { id: Date.now(), ...normalized },
      ]);
      setPage(1);
    }
    closeModal();
  }
  function handleDelete(course) {
    if (
      !window.confirm(
        `آیا از حذف درس «${course.name}» در نیمسال ${course.semester} مطمئن هستید؟`,
      )
    )
      return;
    setCourses((previous) => previous.filter((item) => item.id !== course.id));
    setPage(1);
  }
  function changeFaculty(value) {
    setFacultyFilter(value);
    setDepartmentFilter("همه");
    setPage(1);
  }

  return (
    <div className="space-y-6" dir="rtl">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <FiBookOpen size={16} />
            مدیریت آموزشی
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-800">
            مدیریت دروس
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            دروس را بر اساس دانشکده، گروه آموزشی و نیمسال تحصیلی بررسی و مدیریت
            کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          افزودن درس جدید
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="کل رکوردهای درس"
          value={courses.length}
          icon={FiBookOpen}
          color="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="دروس نیمسال جاری"
          value={currentSemesterCount}
          icon={FiCalendar}
          color="bg-violet-50 text-violet-700"
        />
        <StatCard
          title="ارائه‌شده در فیلتر فعلی"
          value={offeredCount}
          icon={FiUsers}
          color="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="مجموع واحدهای نتیجه‌ها"
          value={creditsCount}
          icon={FiFilter}
          color="bg-amber-50 text-amber-700"
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
            <FiFilter size={17} />
            فیلترهای نمایش دروس
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            <Field label="دانشکده">
              <select
                value={facultyFilter}
                onChange={(e) => changeFaculty(e.target.value)}
                className={inputClass}
              >
                <option value="همه">همه دانشکده‌ها</option>
                {faculties.map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="نیمسال تحصیلی">
              <select
                value={semesterFilter}
                onChange={(e) => {
                  setSemesterFilter(e.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                <option value="همه">همه نیمسال‌ها</option>
                {semesters.map((semester) => (
                  <option key={semester.value} value={semester.value}>
                    {semester.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="گروه آموزشی">
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                <option value="همه">همه گروه‌ها</option>
                {availableDepartments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="وضعیت ارائه">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                <option value="همه">همه وضعیت‌ها</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="جست‌وجو">
              <div className="flex h-[46px] items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-blue-500">
                <FiSearch className="shrink-0 text-slate-400" size={17} />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="نام، کد یا استاد..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </Field>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            نیمسال انتخاب‌شده:{" "}
            <strong className="text-slate-700">
              {semesters.find((item) => item.value === semesterFilter)?.label ||
                "همه نیمسال‌ها"}
            </strong>
          </span>
          <span>{filteredCourses.length} درس مطابق فیلترها</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-right">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">کد / نام درس</th>
                <th className="px-5 py-4 font-semibold">دانشکده</th>
                <th className="px-5 py-4 font-semibold">گروه آموزشی</th>
                <th className="px-5 py-4 font-semibold">نیمسال</th>
                <th className="px-5 py-4 font-semibold">استاد</th>
                <th className="px-5 py-4 font-semibold">واحد</th>
                <th className="px-5 py-4 font-semibold">ظرفیت</th>
                <th className="px-5 py-4 font-semibold">وضعیت</th>
                <th className="px-5 py-4 text-center font-semibold">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleCourses.map((course) => (
                <tr key={course.id} className="transition hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-800">
                      {course.name}
                    </div>
                    <div className="mt-1 text-xs text-slate-400" dir="ltr">
                      {course.code}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {course.faculty}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {course.department}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {course.semester}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {course.instructor}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {course.credits}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {course.capacity} نفر
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold ${statusClasses[course.status] || "bg-slate-100 text-slate-600"}`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        title="ویرایش درس"
                        aria-label={`ویرایش ${course.name}`}
                        onClick={() => openEditModal(course)}
                        className="rounded-lg p-2 text-blue-700 transition hover:bg-blue-50"
                      >
                        <FiEdit2 size={17} />
                      </button>
                      <button
                        type="button"
                        title="حذف درس"
                        aria-label={`حذف ${course.name}`}
                        onClick={() => handleDelete(course)}
                        className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleCourses.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    درسی با این فیلترها پیدا نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {filteredCourses.length === 0
              ? "نتیجه‌ای برای نمایش وجود ندارد."
              : `نمایش ${(currentPage - 1) * pageSize + 1} تا ${Math.min(currentPage * pageSize, filteredCourses.length)} از ${filteredCourses.length} درس`}
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-modal-title"
            className="my-auto w-full max-w-3xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2
                  id="course-modal-title"
                  className="text-lg font-extrabold text-slate-800"
                >
                  {editingCourse ? "ویرایش درس" : "افزودن درس جدید"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  اطلاعات درس و نحوه ارائه آن را وارد کنید.
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="کد درس">
                  <input
                    value={form.code}
                    onChange={(e) => updateForm("code", e.target.value)}
                    placeholder="مثلاً CE101"
                    dir="ltr"
                    className={inputClass}
                  />
                </Field>
                <Field label="نام درس">
                  <input
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="نام درس"
                    className={inputClass}
                  />
                </Field>
                <Field label="استاد">
                  <input
                    value={form.instructor}
                    onChange={(e) => updateForm("instructor", e.target.value)}
                    placeholder="نام استاد"
                    className={inputClass}
                  />
                </Field>
                <Field label="دانشکده">
                  <select
                    value={form.faculty}
                    onChange={(e) => updateForm("faculty", e.target.value)}
                    className={inputClass}
                  >
                    {faculties.map((faculty) => (
                      <option key={faculty} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="گروه آموزشی">
                  <select
                    value={form.department}
                    onChange={(e) => updateForm("department", e.target.value)}
                    className={inputClass}
                  >
                    {(departmentsByFaculty[form.faculty] || []).map(
                      (department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ),
                    )}
                  </select>
                </Field>
                <Field label="نیمسال تحصیلی">
                  <select
                    value={form.semester}
                    onChange={(e) => updateForm("semester", e.target.value)}
                    className={inputClass}
                  >
                    {semesters.map((semester) => (
                      <option key={semester.value} value={semester.value}>
                        {semester.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="تعداد واحد">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={form.credits}
                    onChange={(e) => updateForm("credits", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="ظرفیت کلاس">
                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) => updateForm("capacity", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="وضعیت ارائه">
                  <select
                    value={form.status}
                    onChange={(e) => updateForm("status", e.target.value)}
                    className={inputClass}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </Field>
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
                  {editingCourse ? "ذخیره تغییرات" : "ثبت درس"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
