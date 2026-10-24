import { useMemo, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiBookOpen,
} from "react-icons/fi";

const initialClasses = [
  {
    id: 1,
    courseCode: "CE101",
    courseName: "برنامه‌سازی پیشرفته",
    faculty: "دانشکده فنی و مهندسی",
    department: "مهندسی کامپیوتر",
    semester: "1405-1",
    professor: "دکتر رضایی",
    section: "01",
    day: "شنبه",
    startTime: "08:00",
    endTime: "10:00",
    building: "ساختمان فناوری",
    room: "101",
    capacity: 35,
    enrolled: 28,
    status: "فعال",
  },
  {
    id: 2,
    courseCode: "CE204",
    courseName: "ساختمان داده‌ها",
    faculty: "دانشکده فنی و مهندسی",
    department: "مهندسی کامپیوتر",
    semester: "1405-1",
    professor: "دکتر احمدی",
    section: "01",
    day: "شنبه",
    startTime: "10:00",
    endTime: "12:00",
    building: "ساختمان فناوری",
    room: "203",
    capacity: 30,
    enrolled: 30,
    status: "تکمیل ظرفیت",
  },
  {
    id: 3,
    courseCode: "EE110",
    courseName: "مدارهای الکتریکی",
    faculty: "دانشکده فنی و مهندسی",
    department: "مهندسی برق",
    semester: "1405-1",
    professor: "مهندس کریمی",
    section: "02",
    day: "یکشنبه",
    startTime: "08:00",
    endTime: "10:00",
    building: "ساختمان مهندسی",
    room: "110",
    capacity: 40,
    enrolled: 24,
    status: "فعال",
  },
  {
    id: 4,
    courseCode: "MG101",
    courseName: "اصول مدیریت",
    faculty: "دانشکده علوم انسانی",
    department: "مدیریت",
    semester: "1405-1",
    professor: "دکتر موسوی",
    section: "01",
    day: "دوشنبه",
    startTime: "10:00",
    endTime: "12:00",
    building: "ساختمان علوم انسانی",
    room: "204",
    capacity: 45,
    enrolled: 32,
    status: "فعال",
  },
  {
    id: 5,
    courseCode: "CE305",
    courseName: "پایگاه داده‌ها",
    faculty: "دانشکده فنی و مهندسی",
    department: "مهندسی کامپیوتر",
    semester: "1405-1",
    professor: "دکتر رضایی",
    section: "01",
    day: "سه‌شنبه",
    startTime: "13:00",
    endTime: "15:00",
    building: "ساختمان فناوری",
    room: "105",
    capacity: 32,
    enrolled: 21,
    status: "فعال",
  },
  {
    id: 6,
    courseCode: "AC202",
    courseName: "حسابداری میانه",
    faculty: "دانشکده علوم انسانی",
    department: "حسابداری",
    semester: "1405-1",
    professor: "دکتر جعفری",
    section: "02",
    day: "چهارشنبه",
    startTime: "08:00",
    endTime: "10:00",
    building: "ساختمان علوم انسانی",
    room: "108",
    capacity: 35,
    enrolled: 19,
    status: "فعال",
  },
  {
    id: 7,
    courseCode: "CE410",
    courseName: "مهندسی نرم‌افزار",
    faculty: "دانشکده فنی و مهندسی",
    department: "مهندسی کامپیوتر",
    semester: "1405-2",
    professor: "دکتر احمدی",
    section: "01",
    day: "شنبه",
    startTime: "13:00",
    endTime: "15:00",
    building: "ساختمان فناوری",
    room: "202",
    capacity: 30,
    enrolled: 12,
    status: "برنامه‌ریزی‌شده",
  },
];

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
const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه"];
const statuses = ["فعال", "تکمیل ظرفیت", "برنامه‌ریزی‌شده", "لغوشده"];

const emptyForm = {
  courseCode: "",
  courseName: "",
  faculty: faculties[0],
  department: departmentsByFaculty[faculties[0]][0],
  semester: "1405-1",
  professor: "",
  section: "01",
  day: "شنبه",
  startTime: "08:00",
  endTime: "10:00",
  building: "",
  room: "",
  capacity: "30",
  enrolled: "0",
  status: "فعال",
};

const statusStyles = {
  فعال: "bg-emerald-50 text-emerald-700",
  "تکمیل ظرفیت": "bg-amber-50 text-amber-700",
  برنامه‌ریزی‌شده: "bg-blue-50 text-blue-700",
  لغوشده: "bg-rose-50 text-rose-700",
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

export default function Classes() {
  const [classes, setClasses] = useState(initialClasses);
  const [facultyFilter, setFacultyFilter] = useState("همه");
  const [semesterFilter, setSemesterFilter] = useState("1405-1");
  const [departmentFilter, setDepartmentFilter] = useState("همه");
  const [dayFilter, setDayFilter] = useState("همه");
  const [statusFilter, setStatusFilter] = useState("همه");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [error, setError] = useState("");

  const pageSize = 5;
  const availableDepartments =
    facultyFilter === "همه"
      ? [...new Set(Object.values(departmentsByFaculty).flat())]
      : departmentsByFaculty[facultyFilter] || [];

  const filteredClasses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return classes.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.courseCode,
          item.courseName,
          item.professor,
          item.room,
          item.building,
          item.department,
        ].some((value) => value.toLocaleLowerCase().includes(query));
      return (
        matchesSearch &&
        (facultyFilter === "همه" || item.faculty === facultyFilter) &&
        (semesterFilter === "همه" || item.semester === semesterFilter) &&
        (departmentFilter === "همه" || item.department === departmentFilter) &&
        (dayFilter === "همه" || item.day === dayFilter) &&
        (statusFilter === "همه" || item.status === statusFilter)
      );
    });
  }, [
    classes,
    search,
    facultyFilter,
    semesterFilter,
    departmentFilter,
    dayFilter,
    statusFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredClasses.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleClasses = filteredClasses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const currentSemesterClasses = classes.filter(
    (item) => item.semester === "1405-1",
  ).length;
  const activeClasses = classes.filter((item) => item.status === "فعال").length;
  const totalSeats = classes
    .filter(
      (item) => item.semester === semesterFilter || semesterFilter === "همه",
    )
    .reduce((sum, item) => sum + Number(item.capacity || 0), 0);

  function updateForm(key, value) {
    setForm((previous) => {
      const next = { ...previous, [key]: value };
      if (key === "faculty") {
        next.department = (departmentsByFaculty[value] || [""])[0];
      }
      return next;
    });
  }

  function resetPage() {
    setPage(1);
  }

  function openAddModal() {
    setEditingClass(null);
    setForm({ ...emptyForm });
    setError("");
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditingClass(item);
    setForm({
      ...item,
      capacity: String(item.capacity),
      enrolled: String(item.enrolled),
    });
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingClass(null);
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.courseCode.trim() ||
      !form.courseName.trim() ||
      !form.professor.trim() ||
      !form.building.trim() ||
      !form.room.trim()
    ) {
      setError("کد و نام درس، استاد، ساختمان و شماره کلاس الزامی است.");
      return;
    }

    if (form.startTime >= form.endTime) {
      setError("زمان پایان باید بعد از زمان شروع باشد.");
      return;
    }

    const capacity = Number(form.capacity);
    const enrolled = Number(form.enrolled);
    if (
      !Number.isFinite(capacity) ||
      capacity < 1 ||
      enrolled < 0 ||
      enrolled > capacity
    ) {
      setError(
        "ظرفیت کلاس معتبر نیست یا تعداد ثبت‌نامی‌ها از ظرفیت بیشتر است.",
      );
      return;
    }

    const hasRoomConflict = classes.some((item) => {
      if (item.id === editingClass?.id) return false;
      if (
        item.semester !== form.semester ||
        item.day !== form.day ||
        item.building !== form.building.trim() ||
        item.room !== form.room.trim()
      ) {
        return false;
      }
      return form.startTime < item.endTime && form.endTime > item.startTime;
    });

    if (hasRoomConflict) {
      setError(
        "در این بازه زمانی، کلاس دیگری در همین ساختمان و اتاق ثبت شده است.",
      );
      return;
    }

    const normalized = {
      ...form,
      courseCode: form.courseCode.trim(),
      courseName: form.courseName.trim(),
      professor: form.professor.trim(),
      building: form.building.trim(),
      room: form.room.trim(),
      capacity,
      enrolled,
    };

    if (editingClass) {
      setClasses((previous) =>
        previous.map((item) =>
          item.id === editingClass.id ? { ...item, ...normalized } : item,
        ),
      );
    } else {
      setClasses((previous) => [
        ...previous,
        { id: Date.now(), ...normalized },
      ]);
      setPage(1);
    }
    closeModal();
  }

  function handleDelete(item) {
    const confirmed = window.confirm(
      `آیا از حذف کلاس «${item.courseName} - گروه ${item.section}» مطمئن هستید؟`,
    );
    if (!confirmed) return;
    setClasses((previous) => previous.filter((entry) => entry.id !== item.id));
    setPage(1);
  }

  function changeFaculty(value) {
    setFacultyFilter(value);
    setDepartmentFilter("همه");
    resetPage();
  }

  const timeSlots = ["08:00", "10:00", "12:00", "13:00", "15:00", "17:00"];
  const weekDays = days.slice(0, 5);

  return (
    <div className="space-y-6" dir="rtl">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <FiCalendar size={16} />
            مدیریت آموزشی
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-800">
            کلاس‌ها و برنامه هفتگی
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            کلاس‌ها را بر اساس دانشکده، گروه آموزشی، نیمسال، روز و وضعیت مدیریت
            کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          افزودن کلاس
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="کل کلاس‌ها"
          value={classes.length}
          icon={FiBookOpen}
          color="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="کلاس‌های نیمسال جاری"
          value={currentSemesterClasses}
          icon={FiCalendar}
          color="bg-violet-50 text-violet-700"
        />
        <StatCard
          title="کلاس‌های فعال"
          value={activeClasses}
          icon={FiUsers}
          color="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="ظرفیت کل در فیلتر"
          value={totalSeats}
          icon={FiUsers}
          color="bg-amber-50 text-amber-700"
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
            <FiFilter size={17} />
            فیلترهای کلاس
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
            <Field label="دانشکده">
              <select
                value={facultyFilter}
                onChange={(event) => changeFaculty(event.target.value)}
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
            <Field label="نیمسال">
              <select
                value={semesterFilter}
                onChange={(event) => {
                  setSemesterFilter(event.target.value);
                  resetPage();
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
                onChange={(event) => {
                  setDepartmentFilter(event.target.value);
                  resetPage();
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
            <Field label="روز هفته">
              <select
                value={dayFilter}
                onChange={(event) => {
                  setDayFilter(event.target.value);
                  resetPage();
                }}
                className={inputClass}
              >
                <option value="همه">همه روزها</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="وضعیت">
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  resetPage();
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
                <FiSearch size={17} className="shrink-0 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    resetPage();
                  }}
                  placeholder="درس، استاد یا کلاس..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${viewMode === "table" ? "bg-blue-700 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              نمای جدول
            </button>
            <button
              type="button"
              onClick={() => setViewMode("week")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${viewMode === "week" ? "bg-blue-700 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              برنامه هفتگی
            </button>
            <span className="mr-auto text-xs text-slate-500">
              {filteredClasses.length} کلاس مطابق فیلترها
            </span>
          </div>
        </div>

        {viewMode === "table" ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px] text-right">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-4 py-4 font-semibold">درس / کد</th>
                    <th className="px-4 py-4 font-semibold">دانشکده / گروه</th>
                    <th className="px-4 py-4 font-semibold">استاد</th>
                    <th className="px-4 py-4 font-semibold">روز و ساعت</th>
                    <th className="px-4 py-4 font-semibold">مکان</th>
                    <th className="px-4 py-4 font-semibold">گروه</th>
                    <th className="px-4 py-4 font-semibold">ثبت‌نام / ظرفیت</th>
                    <th className="px-4 py-4 font-semibold">وضعیت</th>
                    <th className="px-4 py-4 text-center font-semibold">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleClasses.map((item) => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-800">
                          {item.courseName}
                        </div>
                        <div className="mt-1 text-xs text-slate-400" dir="ltr">
                          {item.courseCode} · {item.semester}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        <div>{item.faculty}</div>
                        <div className="mt-1 text-xs text-slate-400">
                          {item.department}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {item.professor}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        <div>{item.day}</div>
                        <div className="mt-1 text-xs text-slate-400" dir="ltr">
                          {item.startTime}–{item.endTime}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        <div>{item.building}</div>
                        <div className="mt-1 text-xs text-slate-400">
                          کلاس {item.room}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {item.section}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {item.enrolled} / {item.capacity}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold ${statusStyles[item.status] || "bg-slate-100 text-slate-600"}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            title="ویرایش کلاس"
                            aria-label={`ویرایش ${item.courseName}`}
                            onClick={() => openEditModal(item)}
                            className="rounded-lg p-2 text-blue-700 transition hover:bg-blue-50"
                          >
                            <FiEdit2 size={17} />
                          </button>
                          <button
                            type="button"
                            title="حذف کلاس"
                            aria-label={`حذف ${item.courseName}`}
                            onClick={() => handleDelete(item)}
                            className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"
                          >
                            <FiTrash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibleClasses.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        کلاسی با این فیلترها پیدا نشد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                {filteredClasses.length === 0
                  ? "نتیجه‌ای برای نمایش وجود ندارد."
                  : `نمایش ${(currentPage - 1) * pageSize + 1} تا ${Math.min(currentPage * pageSize, filteredClasses.length)} از ${filteredClasses.length} کلاس`}
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() =>
                    setPage((previous) => Math.max(1, previous - 1))
                  }
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
          </>
        ) : (
          <div className="p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
              <FiClock size={16} />
              برنامه هفتگی بر اساس کلاس‌های فیلترشده
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[900px] table-fixed text-right">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="w-24 border-b border-l border-slate-200 p-3 text-xs font-semibold text-slate-500">
                      ساعت
                    </th>
                    {weekDays.map((day) => (
                      <th
                        key={day}
                        className="border-b border-l border-slate-200 p-3 text-xs font-semibold text-slate-600"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.slice(0, -1).map((slot, index) => {
                    const nextSlot = timeSlots[index + 1];
                    return (
                      <tr key={slot}>
                        <th
                          className="border-b border-l border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-500"
                          dir="ltr"
                        >
                          {slot}
                          <div className="my-1 text-slate-300">—</div>
                          {nextSlot}
                        </th>
                        {weekDays.map((day) => {
                          const items = filteredClasses.filter(
                            (item) =>
                              item.day === day && item.startTime === slot,
                          );
                          return (
                            <td
                              key={day}
                              className="h-28 border-b border-l border-slate-200 p-2 align-top"
                            >
                              {items.map((item) => (
                                <div
                                  key={item.id}
                                  className="mb-1 rounded-lg border border-blue-100 bg-blue-50 p-2 text-xs"
                                >
                                  <div className="font-bold text-blue-900">
                                    {item.courseName}
                                  </div>
                                  <div className="mt-1 text-blue-700">
                                    {item.professor}
                                  </div>
                                  <div className="mt-1 flex items-center gap-1 text-blue-600">
                                    <FiMapPin size={12} /> {item.building}،{" "}
                                    {item.room}
                                  </div>
                                  <div className="mt-1 text-blue-600" dir="ltr">
                                    {item.startTime}–{item.endTime}
                                  </div>
                                  <div className="mt-2 flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => openEditModal(item)}
                                      className="font-semibold underline"
                                    >
                                      ویرایش
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(item)}
                                      className="font-semibold text-rose-600 underline"
                                    >
                                      حذف
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-6 text-slate-500">
              نمای برنامه هفتگی، کلاس‌ها را بر اساس روز و ساعت نمایش می‌دهد. در
              نسخه متصل به بک‌اند، زمان‌بندی و تداخل‌ها بر اساس داده‌های واقعی
              بررسی می‌شوند.
            </p>
          </div>
        )}
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
            aria-labelledby="class-modal-title"
            className="my-auto w-full max-w-4xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2
                  id="class-modal-title"
                  className="text-lg font-extrabold text-slate-800"
                >
                  {editingClass ? "ویرایش کلاس" : "افزودن کلاس جدید"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  اطلاعات درس، زمان‌بندی، استاد و مکان کلاس را تکمیل کنید.
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
                    value={form.courseCode}
                    onChange={(event) =>
                      updateForm("courseCode", event.target.value)
                    }
                    placeholder="مثلاً CE101"
                    dir="ltr"
                    className={inputClass}
                  />
                </Field>
                <Field label="نام درس">
                  <input
                    value={form.courseName}
                    onChange={(event) =>
                      updateForm("courseName", event.target.value)
                    }
                    placeholder="نام درس"
                    className={inputClass}
                  />
                </Field>
                <Field label="استاد">
                  <input
                    value={form.professor}
                    onChange={(event) =>
                      updateForm("professor", event.target.value)
                    }
                    placeholder="نام استاد"
                    className={inputClass}
                  />
                </Field>
                <Field label="دانشکده">
                  <select
                    value={form.faculty}
                    onChange={(event) =>
                      updateForm("faculty", event.target.value)
                    }
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
                    onChange={(event) =>
                      updateForm("department", event.target.value)
                    }
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
                <Field label="نیمسال">
                  <select
                    value={form.semester}
                    onChange={(event) =>
                      updateForm("semester", event.target.value)
                    }
                    className={inputClass}
                  >
                    {semesters.map((semester) => (
                      <option key={semester.value} value={semester.value}>
                        {semester.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="شماره گروه">
                  <input
                    value={form.section}
                    onChange={(event) =>
                      updateForm("section", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="روز هفته">
                  <select
                    value={form.day}
                    onChange={(event) => updateForm("day", event.target.value)}
                    className={inputClass}
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="وضعیت">
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value)
                    }
                    className={inputClass}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="ساعت شروع">
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(event) =>
                      updateForm("startTime", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="ساعت پایان">
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(event) =>
                      updateForm("endTime", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="ظرفیت">
                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(event) =>
                      updateForm("capacity", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="تعداد ثبت‌نامی">
                  <input
                    type="number"
                    min="0"
                    value={form.enrolled}
                    onChange={(event) =>
                      updateForm("enrolled", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="ساختمان">
                  <input
                    value={form.building}
                    onChange={(event) =>
                      updateForm("building", event.target.value)
                    }
                    placeholder="نام ساختمان"
                    className={inputClass}
                  />
                </Field>
                <Field label="شماره کلاس">
                  <input
                    value={form.room}
                    onChange={(event) => updateForm("room", event.target.value)}
                    placeholder="مثلاً ۱۰۱"
                    className={inputClass}
                  />
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
                  {editingClass ? "ذخیره تغییرات" : "ثبت کلاس"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
