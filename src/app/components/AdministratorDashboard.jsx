import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { BarChart, Building2, FileText, Package, Megaphone } from "lucide-react";
import { mockResources, mockStudents, mockGrades, mockAttendance, mockAnnouncements } from "../data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import { getStoredData, setStoredData } from "../utils/storage";
function AdministratorDashboard({ username, userId }) {
  const [resources, setResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newResource, setNewResource] = useState({
    name: "",
    type: "",
    quantity: "",
    location: "",
    status: "Available"
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    subject: "",
    message: "",
    targetRoles: []
  });
  const students = getStoredData("students", mockStudents);
  const grades = getStoredData("grades", mockGrades);
  const attendance = getStoredData("attendance", mockAttendance);
  const users = getStoredData("users", []);
  const currentUser = users.find((u) => u.username === username);
  useEffect(() => {
    setResources(getStoredData("resources", mockResources));
    setAnnouncements(getStoredData("announcements", mockAnnouncements));
  }, []);
  const addResource = () => {
    if (!newResource.name || !newResource.type || !newResource.quantity || !newResource.location) {
      toast.error("Please fill all fields");
      return;
    }
    const resource = {
      id: `R${String(resources.length + 1).padStart(3, "0")}`,
      name: newResource.name,
      type: newResource.type,
      quantity: parseInt(newResource.quantity),
      location: newResource.location,
      status: newResource.status
    };
    const updatedResources = [...resources, resource];
    setResources(updatedResources);
    setStoredData("resources", updatedResources);
    setNewResource({ name: "", type: "", quantity: "", location: "", status: "Available" });
    toast.success("Resource added successfully");
  };
  const updateResourceStatus = (resourceId, status) => {
    const updatedResources = resources.map(
      (r) => r.id === resourceId ? { ...r, status } : r
    );
    setResources(updatedResources);
    setStoredData("resources", updatedResources);
    toast.success("Resource status updated");
  };
  const sendAnnouncement = () => {
    if (!newAnnouncement.subject || !newAnnouncement.message || newAnnouncement.targetRoles.length === 0) {
      toast.error("Please fill all fields and select at least one recipient role");
      return;
    }
    const announcement = {
      id: `AN${String(Date.now()).slice(-6)}`,
      from: currentUser?.name || "Administrator",
      fromId: username,
      subject: newAnnouncement.subject,
      message: newAnnouncement.message,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      targetRoles: newAnnouncement.targetRoles
    };
    const allAnnouncements = getStoredData("announcements", mockAnnouncements);
    const updatedAnnouncements = [...allAnnouncements, announcement];
    setStoredData("announcements", updatedAnnouncements);
    setAnnouncements(updatedAnnouncements);
    setNewAnnouncement({ subject: "", message: "", targetRoles: [] });
    toast.success("Announcement sent successfully");
  };
  const toggleRole = (role) => {
    setNewAnnouncement((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role) ? prev.targetRoles.filter((r) => r !== role) : [...prev.targetRoles, role]
    }));
  };
  const generateReport = (reportType) => {
    let reportContent = "";
    let reportData = [];
    switch (reportType) {
      case "attendance":
        reportContent = `ATTENDANCE REPORT
=================
Generated: ${(/* @__PURE__ */ new Date()).toLocaleString()}

`;
        const attendanceByBranch = {};
        attendance.forEach((a2) => {
          if (!attendanceByBranch[a2.branch]) {
            attendanceByBranch[a2.branch] = { present: 0, absent: 0, late: 0, total: 0 };
          }
          attendanceByBranch[a2.branch][a2.status.toLowerCase()]++;
          attendanceByBranch[a2.branch].total++;
        });
        Object.entries(attendanceByBranch).forEach(([branch, stats]) => {
          const percentage = (stats.present / stats.total * 100).toFixed(1);
          reportContent += `${branch}:
`;
          reportContent += `  Present: ${stats.present}
`;
          reportContent += `  Absent: ${stats.absent}
`;
          reportContent += `  Late: ${stats.late}
`;
          reportContent += `  Attendance Rate: ${percentage}%

`;
        });
        break;
      case "academic":
        reportContent = `ACADEMIC PERFORMANCE REPORT
============================
Generated: ${(/* @__PURE__ */ new Date()).toLocaleString()}

`;
        const gradesBySubject = {};
        grades.forEach((g) => {
          if (!gradesBySubject[g.subject]) {
            gradesBySubject[g.subject] = [];
          }
          gradesBySubject[g.subject].push(g.marks / g.maxMarks * 100);
        });
        Object.entries(gradesBySubject).forEach(([subject, marks]) => {
          const avg = (marks.reduce((a2, b) => a2 + b, 0) / marks.length).toFixed(1);
          reportContent += `${subject}:
`;
          reportContent += `  Average: ${avg}%
`;
          reportContent += `  Total Assessments: ${marks.length}

`;
        });
        break;
      case "student":
        reportContent = `STUDENT ENROLLMENT REPORT
=========================
Generated: ${(/* @__PURE__ */ new Date()).toLocaleString()}

`;
        const studentsByBranch = {};
        students.forEach((s) => {
          studentsByBranch[s.branch] = (studentsByBranch[s.branch] || 0) + 1;
        });
        reportContent += `Total Students: ${students.length}

`;
        reportContent += "Students by Branch:\n";
        Object.entries(studentsByBranch).forEach(([branch, count]) => {
          reportContent += `  ${branch}: ${count}
`;
        });
        break;
      case "resource":
        reportContent = `RESOURCE INVENTORY REPORT
=========================
Generated: ${(/* @__PURE__ */ new Date()).toLocaleString()}

`;
        reportContent += `Total Resources: ${resources.length}

`;
        resources.forEach((r) => {
          reportContent += `${r.name} (${r.type}):
`;
          reportContent += `  Quantity: ${r.quantity}
`;
          reportContent += `  Location: ${r.location}
`;
          reportContent += `  Status: ${r.status}

`;
        });
        break;
      case "teacher":
        reportContent = `TEACHER REPORT
==============
Generated: ${(/* @__PURE__ */ new Date()).toLocaleString()}

`;
        const teachers = users.filter((u) => u.role === "Teacher");
        reportContent += `Total Teachers: ${teachers.length}

`;
        teachers.forEach((t) => {
          reportContent += `${t.name}
`;
          reportContent += `  Email: ${t.email}
`;
          reportContent += `  Status: ${t.status}

`;
        });
        break;
      case "financial":
        reportContent = `FINANCIAL REPORT
================
Generated: ${(/* @__PURE__ */ new Date()).toLocaleString()}

`;
        reportContent += "This is a sample financial report.\n";
        reportContent += "In a real system, this would include:\n";
        reportContent += "- Fee collection status\n";
        reportContent += "- Outstanding payments\n";
        reportContent += "- Salary disbursements\n";
        reportContent += "- Operational expenses\n";
        break;
    }
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}_report_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated`);
  };
  const totalStudents = students.length;
  const totalClasses = Array.from(new Set(students.map((s) => s.class))).length;
  const averageAttendance = attendance.length > 0 ? (attendance.filter((a) => a.status === "Present").length / attendance.length * 100).toFixed(1) : 0;
  const averageGrade = grades.length > 0 ? (grades.reduce((sum, g) => sum + g.marks / g.maxMarks * 100, 0) / grades.length).toFixed(1) : 0;
  const classStats = Array.from(new Set(students.map((s) => s.branch))).map((branch) => {
    const branchStudents = students.filter((s) => s.branch === branch);
    const branchAttendance = attendance.filter((a) => a.branch === branch);
    const branchGrades = grades.filter((g) => branchStudents.some((s) => s.id === g.studentId));
    const attendanceRate = branchAttendance.length > 0 ? (branchAttendance.filter((a) => a.status === "Present").length / branchAttendance.length * 100).toFixed(1) : "0";
    const avgGrade = branchGrades.length > 0 ? (branchGrades.reduce((sum, g) => sum + g.marks / g.maxMarks * 100, 0) / branchGrades.length).toFixed(1) : "0";
    return {
      class: branch,
      students: branchStudents.length,
      attendance: attendanceRate,
      avgGrade
    };
  });
  const subjectStats = Array.from(new Set(grades.map((g) => g.subject))).map((subject) => {
    const subjectGrades = grades.filter((g) => g.subject === subject);
    const avgMarks = (subjectGrades.reduce((sum, g) => sum + g.marks / g.maxMarks * 100, 0) / subjectGrades.length).toFixed(1);
    return {
      subject,
      assignments: subjectGrades.length,
      avgMarks
    };
  });
  return /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl", children: "Administrator Dashboard" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Oversee institutional operations and generate reports" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Total Students" }),
          /* @__PURE__ */ jsx(Building2, { className: "h-4 w-4 text-blue-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: totalStudents }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Total Branches" }),
          /* @__PURE__ */ jsx(Building2, { className: "h-4 w-4 text-green-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: classStats.length }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Avg. Attendance" }),
          /* @__PURE__ */ jsx(BarChart, { className: "h-4 w-4 text-purple-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-2xl", children: [
          averageAttendance,
          "%"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Avg. Performance" }),
          /* @__PURE__ */ jsx(BarChart, { className: "h-4 w-4 text-orange-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-2xl", children: [
          averageGrade,
          "%"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "analytics", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "analytics", children: "Analytics & Reports" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "resources", children: "Resource Management" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "announcements", children: "Announcements" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "operations", children: "Operations" })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "analytics", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Branch-wise Performance" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Academic performance by branch" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
              /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableHead, { children: "Branch" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Students" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Attendance" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Avg Grade" })
              ] }) }),
              /* @__PURE__ */ jsx(TableBody, { children: classStats.map((stat) => /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: stat.class.split(" ").map((w) => w[0]).join("") }) }),
                /* @__PURE__ */ jsx(TableCell, { children: stat.students }),
                /* @__PURE__ */ jsxs(TableCell, { children: [
                  stat.attendance,
                  "%"
                ] }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Badge, { children: [
                  stat.avgGrade,
                  "%"
                ] }) })
              ] }, stat.class)) })
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Subject-wise Performance" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Performance across different subjects" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
              /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableHead, { children: "Subject" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Assignments" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Avg. Marks" })
              ] }) }),
              /* @__PURE__ */ jsx(TableBody, { children: subjectStats.map((stat) => /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableCell, { children: stat.subject }),
                /* @__PURE__ */ jsx(TableCell, { children: stat.assignments }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Badge, { children: [
                  stat.avgMarks,
                  "%"
                ] }) })
              ] }, stat.subject)) })
            ] }) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Generate Reports" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Export institutional reports (Downloads as .txt file)" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                className: "h-20 flex flex-col gap-2",
                onClick: () => generateReport("attendance"),
                children: [
                  /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6" }),
                  /* @__PURE__ */ jsx("span", { children: "Attendance Report" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                className: "h-20 flex flex-col gap-2",
                variant: "outline",
                onClick: () => generateReport("academic"),
                children: [
                  /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6" }),
                  /* @__PURE__ */ jsx("span", { children: "Academic Report" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                className: "h-20 flex flex-col gap-2",
                variant: "outline",
                onClick: () => generateReport("financial"),
                children: [
                  /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6" }),
                  /* @__PURE__ */ jsx("span", { children: "Financial Report" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                className: "h-20 flex flex-col gap-2",
                variant: "outline",
                onClick: () => generateReport("student"),
                children: [
                  /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6" }),
                  /* @__PURE__ */ jsx("span", { children: "Student Report" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                className: "h-20 flex flex-col gap-2",
                variant: "outline",
                onClick: () => generateReport("teacher"),
                children: [
                  /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6" }),
                  /* @__PURE__ */ jsx("span", { children: "Teacher Report" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                className: "h-20 flex flex-col gap-2",
                variant: "outline",
                onClick: () => generateReport("resource"),
                children: [
                  /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6" }),
                  /* @__PURE__ */ jsx("span", { children: "Resource Report" })
                ]
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Monthly Overview" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Key metrics for February 2026" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center p-4 border rounded-lg", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl", children: totalStudents }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "Enrolled Students" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center p-4 border rounded-lg", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl", children: grades.length }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "Assignments Graded" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center p-4 border rounded-lg", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-2xl", children: [
                averageAttendance,
                "%"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "Attendance Rate" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center p-4 border rounded-lg", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl", children: resources.filter((r) => r.status === "Available").length }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "Resources Available" })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "resources", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Add New Resource" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Add equipment and facilities to inventory" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-6 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Resource Name" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "e.g., Projector",
                  value: newResource.name,
                  onChange: (e) => setNewResource({ ...newResource, name: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Type" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "e.g., Equipment",
                  value: newResource.type,
                  onChange: (e) => setNewResource({ ...newResource, type: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Quantity" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  placeholder: "10",
                  value: newResource.quantity,
                  onChange: (e) => setNewResource({ ...newResource, quantity: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Location" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Room 101",
                  value: newResource.location,
                  onChange: (e) => setNewResource({ ...newResource, location: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Status" }),
              /* @__PURE__ */ jsxs(Select, { value: newResource.status, onValueChange: (value) => setNewResource({ ...newResource, status: value }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "Available", children: "Available" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "In Use", children: "In Use" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "Maintenance", children: "Maintenance" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsx(Button, { onClick: addResource, className: "w-full", children: "Add Resource" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Resource Inventory" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Manage institutional resources and facilities" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "ID" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Type" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Quantity" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Location" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: resources.map((resource) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { children: resource.id }),
              /* @__PURE__ */ jsx(TableCell, { children: resource.name }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: resource.type }) }),
              /* @__PURE__ */ jsx(TableCell, { children: resource.quantity }),
              /* @__PURE__ */ jsx(TableCell, { children: resource.location }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: resource.status === "Available" ? "default" : resource.status === "In Use" ? "secondary" : "destructive",
                  children: resource.status
                }
              ) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(
                Select,
                {
                  value: resource.status,
                  onValueChange: (value) => updateResourceStatus(resource.id, value),
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { className: "w-32", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsx(SelectItem, { value: "Available", children: "Available" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "In Use", children: "In Use" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "Maintenance", children: "Maintenance" })
                    ] })
                  ]
                }
              ) })
            ] }, resource.id)) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Total Resources" }),
              /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-gray-500" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: resources.length }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Available" }),
              /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-green-500" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: resources.filter((r) => r.status === "Available").length }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "In Maintenance" }),
              /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-red-500" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: resources.filter((r) => r.status === "Maintenance").length }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "announcements", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Send Announcement" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Broadcast important messages to teachers and students" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Subject" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Announcement subject",
                  value: newAnnouncement.subject,
                  onChange: (e) => setNewAnnouncement({ ...newAnnouncement, subject: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Message" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  placeholder: "Type your announcement here",
                  value: newAnnouncement.message,
                  onChange: (e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value }),
                  rows: 4
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Send To" }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx(
                    Checkbox,
                    {
                      id: "teachers",
                      checked: newAnnouncement.targetRoles.includes("Teacher"),
                      onCheckedChange: () => toggleRole("Teacher")
                    }
                  ),
                  /* @__PURE__ */ jsx("label", { htmlFor: "teachers", className: "text-sm cursor-pointer", children: "Teachers" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx(
                    Checkbox,
                    {
                      id: "students",
                      checked: newAnnouncement.targetRoles.includes("Student"),
                      onCheckedChange: () => toggleRole("Student")
                    }
                  ),
                  /* @__PURE__ */ jsx("label", { htmlFor: "students", className: "text-sm cursor-pointer", children: "Students" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Button, { onClick: sendAnnouncement, className: "gap-2", children: [
              /* @__PURE__ */ jsx(Megaphone, { className: "w-4 h-4" }),
              "Send Announcement"
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Recent Announcements" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Previously sent announcements" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: announcements.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500 py-8", children: "No announcements sent yet" }) : announcements.map((announcement) => /* @__PURE__ */ jsxs(Card, { className: "border-l-4 border-yellow-500", children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: announcement.subject }),
                /* @__PURE__ */ jsxs(CardDescription, { children: [
                  "Sent to: ",
                  announcement.targetRoles.join(", "),
                  " - ",
                  announcement.date
                ] })
              ] }),
              /* @__PURE__ */ jsxs(Badge, { children: [
                announcement.targetRoles.length,
                " ",
                announcement.targetRoles.length === 1 ? "Role" : "Roles"
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-sm", children: announcement.message }) })
          ] }, announcement.id)) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "operations", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Institutional Operations" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Manage day-to-day institutional operations" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Administrative Tasks" }) }),
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full justify-start", children: "Process Admissions" }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full justify-start", children: "Manage Fee Collection" }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full justify-start", children: "Staff Payroll" }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full justify-start", children: "Facility Maintenance" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Communication" }) }),
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full justify-start", children: "Parent Notifications" }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full justify-start", children: "Staff Circulars" }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full justify-start", children: "Event Management" }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full justify-start", children: "Newsletter" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Quick Actions" }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", children: "Approve Leaves" }),
              /* @__PURE__ */ jsx(Button, { variant: "outline", children: "Update Calendar" }),
              /* @__PURE__ */ jsx(Button, { variant: "outline", children: "Manage Events" }),
              /* @__PURE__ */ jsx(Button, { variant: "outline", children: "Review Requests" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "System Health" }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("span", { children: "Database Status" }),
                /* @__PURE__ */ jsx(Badge, { children: "Healthy" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("span", { children: "Backup Status" }),
                /* @__PURE__ */ jsx(Badge, { children: "Up to date" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("span", { children: "System Load" }),
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Normal" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("span", { children: "Last Backup" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "2 hours ago" })
              ] })
            ] }) })
          ] })
        ] }) })
      ] }) })
    ] })
  ] });
}
export {
  AdministratorDashboard
};
