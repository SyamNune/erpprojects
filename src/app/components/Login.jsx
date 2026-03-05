import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { GraduationCap } from "lucide-react";
import { mockUsers } from "../data/mockData";
import { getStoredData } from "../utils/storage";
import { toast } from "sonner";
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }
    const users = getStoredData("users", mockUsers);
    const user = users.find(
      (u) => u.username === username && u.password === password && u.status === "Active"
    );
    if (user) {
      onLogin(user.role.toLowerCase(), user.id, user.username);
      toast.success(`Welcome, ${user.name}!`);
    } else {
      toast.error("Invalid username or password, or account is inactive");
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx("div", { className: "bg-blue-400 p-3 rounded-full", children: /* @__PURE__ */ jsx(GraduationCap, { className: "w-8 h-8 text-white" }) }) }),
      /* @__PURE__ */ jsx(CardTitle, { children: "Educational ERP System" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Sign in to access your dashboard" })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "username", children: "Username" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "username",
              type: "text",
              placeholder: "Enter username",
              value: username,
              onChange: (e) => setUsername(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              type: "password",
              placeholder: "Enter password",
              value: password,
              onChange: (e) => setPassword(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Sign In" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 text-sm text-gray-500 space-y-1", children: /* @__PURE__ */ jsxs("div", { className: "border-t pt-3", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Demo Credentials:" }),
        /* @__PURE__ */ jsx("p", { children: "Admin: admin / admin123" }),
        /* @__PURE__ */ jsx("p", { children: "Teacher: drsarahmiller / teacher123" }),
        /* @__PURE__ */ jsx("p", { children: "Student: johnsmith1 / student123" }),
        /* @__PURE__ */ jsx("p", { children: "Principal: principal / principal123" })
      ] }) })
    ] })
  ] }) });
}
export {
  Login
};
