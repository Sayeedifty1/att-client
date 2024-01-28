import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import Main from "../layout/Main";
import Login from "../pages/Login";
import Register from "../pages/Register";
import TeacherDash from "../pages/TeacherDash";
import UserDetails from "../pages/UserDetails";
import StudentDash from "../pages/StudentDash";
import AdminAtt from "../pages/AdminAtt";
import AddCourse from "../pages/AddCourse";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/add-course",
        element: <AddCourse />,
      },
      {
        path: "/dashboard",
        element: <UserDetails />,
      },
      {
        path: "/teacher-dashboard",
        element: <TeacherDash />,
      },
      {
        path: "/admin-attendance",
        element: <AdminAtt />,
      },
      {
        path: "/std-dashboard",
        element: <StudentDash />,
      },
    ],
  },
]);

export default router;
