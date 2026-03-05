import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { BookOpen, Calendar, Users, Mail } from "lucide-react";
import { mockStudents, mockAttendance, mockGrades, mockSchedules, mockMessages, engineeringBranches } from "../data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { getStoredData, setStoredData } from "../utils/storage";
function TeacherDashboard({ username }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newGrade, setNewGrade] = useState({
    studentId: "",
    subject: "",
    assignment: "",
    marks: "",
    maxMarks: "100"
  });
  const [newSchedule, setNewSchedule] = useState({
    class: "",
    subject: "",
    teacher: "Teacher",
    day: "",
    time: "",
    room: ""
  });
  const [selectedBranch, setSelectedBranch] = useState("");
  const [attendanceDate] = useState("2026-02-21");
  useEffect(() => {
    setStudents(getStoredData("students", mockStudents));
    setAttendance(getStoredData("attendance", mockAttendance));
    setGrades(getStoredData("grades", mockGrades));
    setSchedules(getStoredData("schedules", mockSchedules));
    const allMessages = getStoredData("messages", mockMessages);
    setMessages(allMessages.filter((m) => m.toId === username));
  }, [username]);
  const addGrade = () => {
    if (newGrade.studentId && newGrade.subject && newGrade.assignment && newGrade.marks) {
      const student = students.find((s) => s.id === newGrade.studentId);
      const marks = parseInt(newGrade.marks);
      const maxMarks = parseInt(newGrade.maxMarks);
      const percentage = marks / maxMarks * 100;
      let grade = "F";
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 85) grade = "A";
      else if (percentage >= 80) grade = "A-";
      else if (percentage >= 75) grade = "B+";
      else if (percentage >= 70) grade = "B";
      else if (percentage >= 65) grade = "B-";
      else if (percentage >= 60) grade = "C";
      else if (percentage >= 50) grade = "D";
      const gradeEntry = {
        id: `G${String(grades.length + 1).padStart(3, "0")}`,
        studentId: newGrade.studentId,
        studentName: student?.name || "",
        subject: newGrade.subject,
        assignment: newGrade.assignment,
        marks,
        maxMarks,
        grade,
        date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      };
      const updatedGrades = [...grades, gradeEntry];
      setGrades(updatedGrades);
      setStoredData("grades", updatedGrades);
      setNewGrade({ studentId: "", subject: "", assignment: "", marks: "", maxMarks: "100" });
      toast.success("Grade added successfully");
    } else {
      toast.error("Please fill all fields");
    }
  };
  const addSchedule = () => {
    if (newSchedule.class && newSchedule.subject && newSchedule.day && newSchedule.time && newSchedule.room) {
      const schedule = {
        id: `SC${String(schedules.length + 1).padStart(3, "0")}`,
        ...newSchedule
      };
      const updatedSchedules = [...schedules, schedule];
      setSchedules(updatedSchedules);
      setStoredData("schedules", updatedSchedules);
      setNewSchedule({ class: "", subject: "", teacher: "Teacher", day: "", time: "", room: "" });
      toast.success("Schedule added successfully");
    } else {
      toast.error("Please fill all fields");
    }
  };
  const markAttendance = (studentId, status) => {
    const student = students.find((s) => s.id === studentId);
    const existingIndex = attendance.findIndex(
      (a) => a.studentId === studentId && a.date === attendanceDate
    );
    let updatedAttendance;
    if (existingIndex >= 0) {
      updatedAttendance = [...attendance];
      updatedAttendance[existingIndex] = { ...updatedAttendance[existingIndex], status };
    } else {
      const newAttendance = {
        id: `A${String(attendance.length + 1).padStart(3, "0")}`,
        studentId,
        studentName: student?.name || "",
        date: attendanceDate,
        status,
        class: student?.class || "",
        degree: student?.degree || "",
        branch: student?.branch || ""
      };
      updatedAttendance = [...attendance, newAttendance];
    }
    setAttendance(updatedAttendance);
    setStoredData("attendance", updatedAttendance);
    toast.success("Attendance marked");
  };
  const getAttendanceStatus = (studentId) => {
    return attendance.find((a) => a.studentId === studentId && a.date === attendanceDate)?.status;
  };
  const markAsRead = (messageId) => {
    const allMessages = getStoredData("messages", mockMessages);
    const updatedMessages = allMessages.map(
      (m) => m.id === messageId ? { ...m, read: true } : m
    );
    setStoredData("messages", updatedMessages);
    setMessages(updatedMessages.filter((m) => m.toId === username));
    toast.success("Message marked as read");
  };
  const filteredStudents = selectedBranch ? students.filter((s) => s.branch === selectedBranch) : students;
  const unreadMessagesCount = messages.filter((m) => !m.read).length;
  return /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl", children: "Teacher Dashboard" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Manage students, grades, and class schedules" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Total Students" }),
          /* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-gray-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: students.length }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Assignments Graded" }),
          /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4 text-blue-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: grades.length }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Classes Scheduled" }),
          /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-green-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: schedules.length }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Unread Messages" }),
          /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-orange-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: unreadMessagesCount }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "students", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "students", children: "Student Records" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "grades", children: "Grade Management" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "attendance", children: "Attendance" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "schedule", children: "Class Schedule" }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "messages", children: [
          "Messages ",
          unreadMessagesCount > 0 && /* @__PURE__ */ jsx(Badge, { className: "ml-2", children: unreadMessagesCount })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "students", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Student Records" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "View and manage student information" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx(Label, { children: "Filter by Branch" }),
            /* @__PURE__ */ jsxs(Select, { value: selectedBranch || "all", onValueChange: (value) => setSelectedBranch(value === "all" ? "" : value), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "max-w-sm", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "All branches" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Branches" }),
                Object.keys(engineeringBranches).map((branch) => /* @__PURE__ */ jsx(SelectItem, { value: branch, children: branch }, branch))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Roll No." }),
              /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Branch" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Year" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Email" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Guardian" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: filteredStudents.map((student) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { children: student.rollNumber }),
              /* @__PURE__ */ jsx(TableCell, { children: student.name }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: student.branch.split(" ").map((w) => w[0]).join("") }) }),
              /* @__PURE__ */ jsx(TableCell, { children: student.class }),
              /* @__PURE__ */ jsx(TableCell, { children: student.email }),
              /* @__PURE__ */ jsx(TableCell, { children: student.guardianName })
            ] }, student.id)) })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "grades", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Add New Grade" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Record assignment and exam grades" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-6 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Student" }),
              /* @__PURE__ */ jsxs(Select, { value: newGrade.studentId, onValueChange: (value) => setNewGrade({ ...newGrade, studentId: value }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select student" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: students.map((student) => /* @__PURE__ */ jsxs(SelectItem, { value: student.id, children: [
                  student.name,
                  " (",
                  student.rollNumber,
                  ")"
                ] }, student.id)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Subject" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "e.g., Mathematics",
                  value: newGrade.subject,
                  onChange: (e) => setNewGrade({ ...newGrade, subject: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Assignment" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "e.g., Midterm Exam",
                  value: newGrade.assignment,
                  onChange: (e) => setNewGrade({ ...newGrade, assignment: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Marks" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  placeholder: "85",
                  value: newGrade.marks,
                  onChange: (e) => setNewGrade({ ...newGrade, marks: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Max Marks" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  placeholder: "100",
                  value: newGrade.maxMarks,
                  onChange: (e) => setNewGrade({ ...newGrade, maxMarks: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsx(Button, { onClick: addGrade, className: "w-full", children: "Add Grade" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Grade Records" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "All graded assignments and exams" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Student" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Subject" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Assignment" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Marks" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Grade" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: grades.map((grade) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { children: grade.date }),
              /* @__PURE__ */ jsx(TableCell, { children: grade.studentName }),
              /* @__PURE__ */ jsx(TableCell, { children: grade.subject }),
              /* @__PURE__ */ jsx(TableCell, { children: grade.assignment }),
              /* @__PURE__ */ jsxs(TableCell, { children: [
                grade.marks,
                "/",
                grade.maxMarks
              ] }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { children: grade.grade }) })
            ] }, grade.id)) })
          ] }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "attendance", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { children: [
            "Mark Attendance - ",
            attendanceDate
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Record student attendance for today" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx(Label, { children: "Filter by Branch/Degree" }),
            /* @__PURE__ */ jsxs(Select, { value: selectedBranch || "all", onValueChange: (value) => setSelectedBranch(value === "all" ? "" : value), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "max-w-sm", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "All branches" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Branches" }),
                Object.keys(engineeringBranches).map((branch) => /* @__PURE__ */ jsx(SelectItem, { value: branch, children: branch }, branch))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Roll No." }),
              /* @__PURE__ */ jsx(TableHead, { children: "Student Name" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Branch" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Year" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: filteredStudents.map((student) => {
              const status = getAttendanceStatus(student.id);
              return /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableCell, { children: student.rollNumber }),
                /* @__PURE__ */ jsx(TableCell, { children: student.name }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: student.branch.split(" ").map((w) => w[0]).join("") }) }),
                /* @__PURE__ */ jsx(TableCell, { children: student.class }),
                /* @__PURE__ */ jsx(TableCell, { children: status ? /* @__PURE__ */ jsx(
                  Badge,
                  {
                    variant: status === "Present" ? "default" : status === "Late" ? "secondary" : "destructive",
                    children: status
                  }
                ) : /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "Not marked" }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      size: "sm",
                      variant: status === "Present" ? "default" : "outline",
                      onClick: () => markAttendance(student.id, "Present"),
                      children: "Present"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      size: "sm",
                      variant: status === "Absent" ? "destructive" : "outline",
                      onClick: () => markAttendance(student.id, "Absent"),
                      children: "Absent"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      size: "sm",
                      variant: status === "Late" ? "secondary" : "outline",
                      onClick: () => markAttendance(student.id, "Late"),
                      children: "Late"
                    }
                  )
                ] }) })
              ] }, student.id);
            }) })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "schedule", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Add New Class Schedule" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Schedule a new class session" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-6 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Class/Branch" }),
              /* @__PURE__ */ jsxs(Select, { value: newSchedule.class, onValueChange: (value) => setNewSchedule({ ...newSchedule, class: value }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select branch" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: Object.keys(engineeringBranches).map((branch) => /* @__PURE__ */ jsx(SelectItem, { value: branch, children: branch }, branch)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Subject" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "e.g., Mathematics",
                  value: newSchedule.subject,
                  onChange: (e) => setNewSchedule({ ...newSchedule, subject: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Day" }),
              /* @__PURE__ */ jsxs(Select, { value: newSchedule.day, onValueChange: (value) => setNewSchedule({ ...newSchedule, day: value }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select day" }) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "Monday", children: "Monday" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "Tuesday", children: "Tuesday" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "Wednesday", children: "Wednesday" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "Thursday", children: "Thursday" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "Friday", children: "Friday" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Time" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "09:00 - 10:00",
                  value: newSchedule.time,
                  onChange: (e) => setNewSchedule({ ...newSchedule, time: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Room" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Room 101",
                  value: newSchedule.room,
                  onChange: (e) => setNewSchedule({ ...newSchedule, room: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsx(Button, { onClick: addSchedule, className: "w-full", children: "Add Schedule" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Class Schedule" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "All scheduled classes" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Class" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Subject" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Teacher" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Day" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Time" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Room" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: schedules.map((schedule) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: schedule.class.split(" ").map((w) => w[0]).join("") }) }),
              /* @__PURE__ */ jsx(TableCell, { children: schedule.subject }),
              /* @__PURE__ */ jsx(TableCell, { children: schedule.teacher }),
              /* @__PURE__ */ jsx(TableCell, { children: schedule.day }),
              /* @__PURE__ */ jsx(TableCell, { children: schedule.time }),
              /* @__PURE__ */ jsx(TableCell, { children: schedule.room })
            ] }, schedule.id)) })
          ] }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "messages", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Student Messages" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Messages from students" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: messages.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500 py-8", children: "No messages yet" }) : messages.map((message) => /* @__PURE__ */ jsxs(Card, { className: !message.read ? "border-l-4 border-blue-500" : "", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: message.subject }),
              /* @__PURE__ */ jsxs(CardDescription, { children: [
                "From: ",
                message.from,
                " - ",
                message.date
              ] })
            ] }),
            !message.read && /* @__PURE__ */ jsx(Badge, { children: "New" })
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm mb-3", children: message.message }),
            !message.read && /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => markAsRead(message.id),
                children: "Mark as Read"
              }
            )
          ] })
        ] }, message.id)) }) })
      ] }) })
    ] })
  ] });
}
export {
  TeacherDashboard
};
