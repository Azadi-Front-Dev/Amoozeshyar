
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const pageTitles = {
  "/admin/dashboard": "داشبورد",
  "/admin/users": "مدیریت کاربران",
  "/admin/students": "مدیریت دانشجویان",
  "/admin/professors": "مدیریت استادان",
  "/admin/staff": "مدیریت کارکنان",
  "/admin/departments": "دانشکده‌ها و گروه‌ها",
  "/admin/courses": "مدیریت دروس",
  "/admin/classes": "کلاس‌ها و برنامه هفتگی",
  "/admin/semesters": "نیمسال‌های تحصیلی",
  "/admin/enrollments": "مدیریت انتخاب واحد",
  "/admin/reports": "گزارش‌های آموزشی",
  "/admin/activity": "فعالیت‌های سامانه",
  "/admin/settings": "تنظیمات",
};

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const user = readUser();
  const userName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "مدیر سامانه";

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/Login", { replace: true });
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="min-h-screen lg:mr-[270px]">
        <AdminHeader
          title={pageTitles[location.pathname] || "مدیریت سامانه"}
          userName={userName}
          onMenuClick={() => setSidebarOpen(true)}
          search={search}
          onSearchChange={setSearch}
        />

        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 xl:p-8">
          <Outlet context={{ search, setSearch }} />
        </main>
      </div>
    </div>
  );
}
