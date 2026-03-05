import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Login } from "./components/Login";
import { AdminDashboard } from "./components/AdminDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { StudentDashboard } from "./components/StudentDashboard";
import { AdministratorDashboard } from "./components/AdministratorDashboard";
import { Button } from "./components/ui/button";
import { LogOut, GraduationCap } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { initializeStorage } from "./utils/storage";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  useEffect(() => {
    initializeStorage();
  }, []);
  const handleLogin = (role, id, uname) => {
    setUserRole(role);
    setUserId(id);
    setUsername(uname);
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("");
    setUserId("");
    setUsername("");
  };
  if (!isLoggedIn) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Login, { onLogin: handleLogin }),
      /* @__PURE__ */ jsx(Toaster, {})
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("header", { className: "bg-white border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-blue-400 p-2 rounded-lg", children: /* @__PURE__ */ jsx(GraduationCap, { className: "w-6 h-6 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl", children: "Educational ERP System" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
            userRole === "admin" && "Admin Portal",
            userRole === "teacher" && "Teacher Portal",
            userRole === "student" && "Student Portal",
            userRole === "administrator" && "Administrator Portal"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: handleLogout, variant: "outline", className: "gap-2", children: [
        /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
        "Logout"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { children: [
      userRole === "admin" && /* @__PURE__ */ jsx(AdminDashboard, {}),
      userRole === "teacher" && /* @__PURE__ */ jsx(TeacherDashboard, { username }),
      userRole === "student" && /* @__PURE__ */ jsx(StudentDashboard, { userId, username }),
      userRole === "administrator" && /* @__PURE__ */ jsx(AdministratorDashboard, { username, userId })
    ] }),
    /* @__PURE__ */ jsx(Toaster, {})
  ] });
}
export {
  App as default
};
