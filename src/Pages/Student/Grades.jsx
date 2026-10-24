import { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/exam/student/grades/";

function Grades() {
  const [grades, setGrades] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchGrades() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("access");

        if (!token) {
          throw new Error("برای مشاهده نمرات ابتدا وارد حساب خود شوید.");
        }

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        if (response.status === 401) {
          throw new Error("نشست شما معتبر نیست؛ دوباره وارد شوید.");
        }

        if (response.status === 403) {
          throw new Error("دسترسی به صفحه نمرات برای این حساب مجاز نیست.");
        }

        if (!response.ok) {
          throw new Error("دریافت اطلاعات نمرات با خطا مواجه شد.");
        }

        const data = await response.json();

        setGrades(
          (data.results ?? []).map((item) => ({
            id: item.enrollment_id,
            semester: item.semester_title || "نیمسال نامشخص",
            academicYear: item.academic_year || "",
            name: item.course_title || "بدون عنوان",
            code: String(item.course_code ?? ""),
            units: Number(item.units ?? 0),
            score:
              item.final_score == null
                ? null
                : Number(item.final_score),
            status: item.grade_status,
            enrollmentStatus: item.enrollment_status,
            finalizedAt: item.finalized_at,
            exams: item.exams ?? [],
          }))
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "خطای نامشخص در دریافت اطلاعات.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchGrades();

    return () => controller.abort();
  }, []);

  const semesters = useMemo(() => {
    const unique = [
      ...new Set(grades.map((grade) => grade.semester)),
    ];

    return unique;
  }, [grades]);

  const filteredGrades = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return grades.filter((grade) => {
      const semesterMatches =
        selectedSemester === "all" ||
        grade.semester === selectedSemester;

      const searchMatches =
        !query ||
        grade.name.toLowerCase().includes(query) ||
        grade.code.toLowerCase().includes(query);

      return semesterMatches && searchMatches;
    });
  }, [grades, selectedSemester, searchTerm]);

  const semesterAverage = useMemo(() => {
    const scored = filteredGrades.filter(
      (grade) => grade.score !== null
    );

    const totalUnits = scored.reduce(
      (sum, grade) => sum + grade.units,
      0
    );

    if (!totalUnits) return null;

    return (
      scored.reduce(
        (sum, grade) => sum + grade.score * grade.units,
        0
      ) / totalUnits
    );
  }, [filteredGrades]);

  const overallAverage = useMemo(() => {
    const scored = grades.filter(
      (grade) => grade.score !== null
    );

    const totalUnits = scored.reduce(
      (sum, grade) => sum + grade.units,
      0
    );

    if (!totalUnits) return null;

    return (
      scored.reduce(
        (sum, grade) => sum + grade.score * grade.units,
        0
      ) / totalUnits
    );
  }, [grades]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        در حال دریافت نمرات...
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir="rtl"
        className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700"
      >
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">نمرات و کارنامه</h1>

        <select
          value={selectedSemester}
          onChange={(event) =>
            setSelectedSemester(event.target.value)
          }
          className="rounded-lg border border-gray-300 bg-white px-4 py-2"
        >
          <option value="all">تمام نیمسال‌ها</option>

          {semesters.map((semester) => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="میانگین نیمسال"
          value={
            semesterAverage === null
              ? "—"
              : semesterAverage.toFixed(2)
          }
        />

        <SummaryCard
          title="میانگین کل"
          value={
            overallAverage === null
              ? "—"
              : overallAverage.toFixed(2)
          }
        />

        <SummaryCard
          title="تعداد درس‌ها"
          value={filteredGrades.length}
        />
      </div>

      <input
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="جستجو بر اساس نام یا کد درس..."
        className="w-full rounded-lg border border-gray-300 px-4 py-3"
      />

      {filteredGrades.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
          نمره‌ای برای نمایش پیدا نشد.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[700px] text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">نام درس</th>
                <th className="p-4">کد درس</th>
                <th className="p-4">واحد</th>
                <th className="p-4">نیمسال</th>
                <th className="p-4">نمره نهایی</th>
                <th className="p-4">وضعیت</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredGrades.map((grade) => (
                <tr key={grade.id}>
                  <td className="p-4 font-medium">
                    {grade.name}
                  </td>
                  <td className="p-4">{grade.code}</td>
                  <td className="p-4">{grade.units}</td>
                  <td className="p-4">{grade.semester}</td>
                  <td className="p-4 font-semibold">
                    {grade.score === null
                      ? "اعلام نشده"
                      : grade.score.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <GradeStatus status={grade.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function GradeStatus({ status }) {
  if (!status) {
    return (
      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">
        در انتظار نهایی‌شدن
      </span>
    );
  }

  const normalized = status.trim().toLowerCase();

  const passed = ["قبول", "passed", "pass"].includes(normalized);
  const failed = ["مردود", "failed", "fail"].includes(normalized);

  const styles = passed
    ? "bg-green-100 text-green-700"
    : failed
      ? "bg-red-100 text-red-700"
      : "bg-blue-100 text-blue-700";

  return (
    <span className={`rounded-full px-3 py-1 text-sm ${styles}`}>
      {status}
    </span>
  );
}

export default Grades;