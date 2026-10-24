import "./App.css";
import { Navigate, useRoutes } from "react-router-dom";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Verify from "./Pages/Verify";
import Notfound from "./Pages/Notfound";
import ForgotPassword from "./Pages/ForgotPassword";

import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";
import StudentDashboard from "./Pages/Student/Dashboard.jsx";
import ProfessorDashboard from "./Pages/Professor/Dashboard.jsx";
import AdminLayout from "./Components/Admin/AdminLayout.jsx";
import Users from "./Pages/Admin/Users.jsx";
import Students from "./Pages/Admin/Students.jsx";
import Departments from "./Pages/Admin/Departments.jsx";
import Courses from "./Pages/Admin/Courses.jsx";
import Classes from "./Pages/Admin/Classes.jsx";
import Enrollments from "./Pages/Admin/Enrollments.jsx";
import Reports from "./Pages/Admin/Reports.jsx";
import Activity from "./Pages/Admin/Activity.jsx";
import Settings from "./Pages/Admin/Settings.jsx";
import Semesters from "./Pages/Admin/Semesters.jsx";
import SemesterDetails from "./Pages/Admin/SemesterDetails.jsx";
import OfferingCourses from "./Pages/Admin/OfferingCourses.jsx";
import RegistrationWindows from "./Pages/Admin/RegistrationWindows.jsx";

// ---STD 
import StudentLayout from "./Pages/Student/StudentLayout.jsx";
import StudentEnrollment from "./Pages/Student/Enrollment.jsx";
import Schedule from "./Pages/Student/Schedule.jsx";
import Grades from "./Pages/Student/Grades.jsx";
import Finance from "./Pages/Student/Finance.jsx";
import Profile from "./Pages/Student/Profile.jsx";






function PlaceholderPage({ title }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      <p className="mt-3 text-sm leading-7 text-slate-500">
        طراحی این بخش در مرحله بعد تکمیل خواهد شد.
      </p>
    </section>
  );
}

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Verify",
    element: <Verify />,
  },
  {
    path: "/ForgotPassword",
    element: <ForgotPassword />,
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "students",
        element: <Students />,
      },
      {
        path: "professors",
        element: <PlaceholderPage title="مدیریت استادان" />,
      },
      {
        path: "staff",
        element: <PlaceholderPage title="مدیریت کارکنان" />,
      },
      {
        path: "departments",
        element: <Departments />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "classes",
        element: <Classes />,
      },
      {
        path: "semesters",
        element: <Semesters />,
      },
      {
        path: "semesterdetils",
        element: <SemesterDetails />,
      },
      {
        path: "enrollments",
        element: <Enrollments />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "activity",
        element: <Activity />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "offeringcourses",
        element: <OfferingCourses />,
      },
      {
        path: "registrationWindows",
        element: <RegistrationWindows />,
      },
    ],
  },

{
  path: "/student",
  element: <StudentLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },
    {
      path: "dashboard",
      element: <StudentDashboard />,
    },
    {
      path: "enrollment",
      element: <StudentEnrollment />,
    },
    {
      path: "schedule",
      element: <Schedule />,
    },
    {
      path: "grades",
      element: <Grades />,
    },
    {
      path: "finance",
      element: <Finance />,
    },
    {
      path: "profile",
      element: <Profile />,
    },
  ],
},

// {
//   path: "/professor/dashboard",
//   element: <ProfessorDashboard />,
// },

  {
    path: "/professor/dashboard",
    element: <ProfessorDashboard />,
  },

  {
    path: "*",
    element: <Notfound />,
  },
];

function App() {
  return useRoutes(routes);
}

export default App;
