import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Users, Shield, Activity } from "lucide-react";
import { mockUsers, mockSettings, mockStudents, engineeringBranches } from "../data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { getStoredData, setStoredData } from "../utils/storage";
function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [settings, setSettings] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "",
    degree: "",
    branch: "",
    status: "Active"
  });
  const [editingSetting, setEditingSetting] = useState(null);
  const [settingValue, setSettingValue] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState("");
  useEffect(() => {
    setUsers(getStoredData("users", mockUsers));
    setStudents(getStoredData("students", mockStudents));
    setSettings(getStoredData("settings", mockSettings));
  }, []);
  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.username || !newUser.password || !newUser.role) {
      toast.error("Please fill all required fields");
      return;
    }
    if (users.some((u) => u.username === newUser.username)) {
      toast.error("Username already exists");
      return;
    }
    if (newUser.role === "Student" && (!newUser.degree || !newUser.branch)) {
      toast.error("Please select degree and branch for student");
      return;
    }
    const userId = `U${String(users.length + 1).padStart(3, "0")}`;
    const user = {
      id: userId,
      ...newUser
    };
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    setStoredData("users", updatedUsers);
    if (newUser.role === "Student" && newUser.branch) {
      const studentId = `S${String(students.length + 1).padStart(3, "0")}`;
      const year = Math.ceil(Math.random() * 4);
      const subjects = engineeringBranches[newUser.branch] || [];
      const student = {
        id: studentId,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
        class: `Year ${year}`,
        degree: newUser.degree,
        branch: newUser.branch,
        rollNumber: `${newUser.branch.split(" ").map((w) => w[0]).join("")}${year}${String(students.length + 1).padStart(2, "0")}`,
        dateOfBirth: "2000-01-01",
        guardianName: `Guardian of ${newUser.name}`,
        guardianContact: "+1234567890",
        address: "Address",
        subjects
      };
      const updatedStudents = [...students, student];
      setStudents(updatedStudents);
      setStoredData("students", updatedStudents);
    }
    setNewUser({ name: "", email: "", username: "", password: "", role: "", degree: "", branch: "", status: "Active" });
    toast.success("User created successfully");
  };
  const toggleUserStatus = (userId) => {
    const updatedUsers = users.map(
      (user) => user.id === userId ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } : user
    );
    setUsers(updatedUsers);
    setStoredData("users", updatedUsers);
    toast.success("User status updated");
  };
  const changeUserRole = (userId) => {
    if (!editRole) {
      toast.error("Please select a role");
      return;
    }
    const updatedUsers = users.map(
      (user) => user.id === userId ? { ...user, role: editRole } : user
    );
    setUsers(updatedUsers);
    setStoredData("users", updatedUsers);
    setEditingUser(null);
    setEditRole("");
    toast.success("User role updated");
  };
  const updateSetting = (settingId) => {
    const updatedSettings = settings.map(
      (setting) => setting.id === settingId ? { ...setting, value: settingValue } : setting
    );
    setSettings(updatedSettings);
    setStoredData("settings", updatedSettings);
    setEditingSetting(null);
    setSettingValue("");
    toast.success("Setting updated");
  };
  const deleteUser = (userId) => {
    const updatedUsers = users.filter((u) => u.id !== userId);
    setUsers(updatedUsers);
    setStoredData("users", updatedUsers);
    toast.success("User deleted");
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl", children: "Admin Dashboard" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Configure system settings and manage user roles" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Total Users" }),
          /* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-gray-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: users.length }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Active Users" }),
          /* @__PURE__ */ jsx(Activity, { className: "h-4 w-4 text-green-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: users.filter((u) => u.status === "Active").length }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Total Students" }),
          /* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-blue-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: students.length }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Security Status" }),
          /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4 text-green-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: "Secure" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "users", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "users", children: "User Management" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "settings", children: "System Settings" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "roles", children: "Role Permissions" })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "users", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Create New User" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Add a new user account with credentials and role" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Full Name *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "John Doe",
                    value: newUser.name,
                    onChange: (e) => setNewUser({ ...newUser, name: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Email *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "email",
                    placeholder: "john.doe@college.edu",
                    value: newUser.email,
                    onChange: (e) => setNewUser({ ...newUser, email: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Username *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "johndoe",
                    value: newUser.username,
                    onChange: (e) => setNewUser({ ...newUser, username: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Password *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "password",
                    placeholder: "password123",
                    value: newUser.password,
                    onChange: (e) => setNewUser({ ...newUser, password: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Role *" }),
                /* @__PURE__ */ jsxs(Select, { value: newUser.role, onValueChange: (value) => setNewUser({ ...newUser, role: value }), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select role" }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "Admin", children: "Admin" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "Teacher", children: "Teacher" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "Student", children: "Student" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "Administrator", children: "Administrator" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Status" }),
                /* @__PURE__ */ jsxs(Select, { value: newUser.status, onValueChange: (value) => setNewUser({ ...newUser, status: value }), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "Active", children: "Active" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "Inactive", children: "Inactive" })
                  ] })
                ] })
              ] }),
              newUser.role === "Student" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Degree *" }),
                  /* @__PURE__ */ jsxs(Select, { value: newUser.degree, onValueChange: (value) => setNewUser({ ...newUser, degree: value }), children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select degree" }) }),
                    /* @__PURE__ */ jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsx(SelectItem, { value: "B.Tech", children: "B.Tech" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "M.Tech", children: "M.Tech" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Branch *" }),
                  /* @__PURE__ */ jsxs(Select, { value: newUser.branch, onValueChange: (value) => setNewUser({ ...newUser, branch: value }), children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select branch" }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: Object.keys(engineeringBranches).map((branch) => /* @__PURE__ */ jsx(SelectItem, { value: branch, children: branch }, branch)) })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(Button, { onClick: addUser, children: "Create User" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "User List" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Manage all system users and their access" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "ID" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Username" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Email" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Role" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Branch" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: users.map((user) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { children: user.id }),
              /* @__PURE__ */ jsx(TableCell, { children: user.name }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-sm", children: user.username }),
              /* @__PURE__ */ jsx(TableCell, { children: user.email }),
              /* @__PURE__ */ jsx(TableCell, { children: editingUser === user.id ? /* @__PURE__ */ jsxs(Select, { value: editRole, onValueChange: setEditRole, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "w-32", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "Admin", children: "Admin" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "Teacher", children: "Teacher" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "Student", children: "Student" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "Administrator", children: "Administrator" })
                ] })
              ] }) : /* @__PURE__ */ jsx(Badge, { variant: "outline", children: user.role }) }),
              /* @__PURE__ */ jsx(TableCell, { children: user.branch ? /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: user.branch.split(" ").map((w) => w[0]).join("") }) : "-" }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: user.status === "Active" ? "default" : "secondary", children: user.status }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: editingUser === user.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => changeUserRole(user.id), children: "Save" }),
                /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => {
                  setEditingUser(null);
                  setEditRole("");
                }, children: "Cancel" })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => {
                      setEditingUser(user.id);
                      setEditRole(user.role);
                    },
                    children: "Change Role"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => toggleUserStatus(user.id),
                    children: user.status === "Active" ? "Deactivate" : "Activate"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "destructive",
                    onClick: () => deleteUser(user.id),
                    children: "Delete"
                  }
                )
              ] }) }) })
            ] }, user.id)) })
          ] }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "settings", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "System Configuration" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Configure ERP system settings" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Category" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Setting" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Value" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: settings.map((setting) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { children: setting.category }) }),
            /* @__PURE__ */ jsx(TableCell, { children: setting.setting }),
            /* @__PURE__ */ jsx(TableCell, { children: editingSetting === setting.id ? /* @__PURE__ */ jsx(
              Input,
              {
                value: settingValue,
                onChange: (e) => setSettingValue(e.target.value),
                className: "max-w-xs"
              }
            ) : setting.value }),
            /* @__PURE__ */ jsx(TableCell, { children: editingSetting === setting.id ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => updateSetting(setting.id), children: "Save" }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => {
                    setEditingSetting(null);
                    setSettingValue("");
                  },
                  children: "Cancel"
                }
              )
            ] }) : /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => {
                  setEditingSetting(setting.id);
                  setSettingValue(setting.value);
                },
                children: "Edit"
              }
            ) })
          ] }, setting.id)) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "roles", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Role Permissions" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Manage permissions for each user role" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: ["Admin", "Teacher", "Student", "Administrator"].map((role) => /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: role }) }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: [
            role === "Admin" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Badge, { children: "Manage Users" }),
              /* @__PURE__ */ jsx(Badge, { children: "System Settings" }),
              /* @__PURE__ */ jsx(Badge, { children: "View All Data" }),
              /* @__PURE__ */ jsx(Badge, { children: "Manage Roles" }),
              /* @__PURE__ */ jsx(Badge, { children: "System Operations" }),
              /* @__PURE__ */ jsx(Badge, { children: "Create Users" })
            ] }),
            role === "Teacher" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Badge, { children: "Manage Students" }),
              /* @__PURE__ */ jsx(Badge, { children: "Grade Assignments" }),
              /* @__PURE__ */ jsx(Badge, { children: "Mark Attendance" }),
              /* @__PURE__ */ jsx(Badge, { children: "Schedule Classes" }),
              /* @__PURE__ */ jsx(Badge, { children: "Send Messages" }),
              /* @__PURE__ */ jsx(Badge, { children: "View Reports" })
            ] }),
            role === "Student" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Badge, { children: "View Grades" }),
              /* @__PURE__ */ jsx(Badge, { children: "View Attendance" }),
              /* @__PURE__ */ jsx(Badge, { children: "View Schedule" }),
              /* @__PURE__ */ jsx(Badge, { children: "Contact Teachers" }),
              /* @__PURE__ */ jsx(Badge, { children: "View Announcements" })
            ] }),
            role === "Administrator" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Badge, { children: "Manage Resources" }),
              /* @__PURE__ */ jsx(Badge, { children: "Generate Reports" }),
              /* @__PURE__ */ jsx(Badge, { children: "View Analytics" }),
              /* @__PURE__ */ jsx(Badge, { children: "Institutional Operations" }),
              /* @__PURE__ */ jsx(Badge, { children: "Send Announcements" })
            ] })
          ] }) })
        ] }, role)) }) })
      ] }) })
    ] })
  ] });
}
export {
  AdminDashboard
};
