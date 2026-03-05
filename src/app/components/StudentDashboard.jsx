import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BookOpen, Calendar, ClipboardCheck, Mail } from "lucide-react";
import { mockAttendance, mockGrades, mockSchedules, mockMessages, mockUsers, mockAnnouncements } from "../data/mockData";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { getStoredData, setStoredData } from "../utils/storage";
function StudentDashboard({ userId, username }) {
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newMessage, setNewMessage] = useState({
    teacherId: "",
    teacherName: "",
    subject: "",
    message: ""
  });
  const students = getStoredData("students", []);
  const currentStudent = students.find((s) => s.username === username);
  const studentId = currentStudent?.id || "S001";
  const studentName = currentStudent?.name || "Student";
  const studentClass = currentStudent?.class || "Year 1";
  const studentBranch = currentStudent?.branch || "Computer Science Engineering";
  const grades = getStoredData("grades", mockGrades);
  const attendance = getStoredData("attendance", mockAttendance);
  const schedules = getStoredData("schedules", mockSchedules);
  const users = getStoredData("users", mockUsers);
  const studentGrades = grades.filter((g) => g.studentId === studentId);
  const studentAttendance = attendance.filter((a) => a.studentId === studentId);
  const studentSchedule = schedules.filter((s) => s.class === studentBranch);
  const teachers = users.filter((u) => u.role === "Teacher");
  useEffect(() => {
    const allMessages = getStoredData("messages", mockMessages);
    setMessages(allMessages.filter((m) => m.toId === username || m.fromId === username));
    const allAnnouncements = getStoredData("announcements", mockAnnouncements);
    setAnnouncements(allAnnouncements.filter((a) => a.targetRoles.includes("Student")));
  }, [username]);
  const attendancePercentage = studentAttendance.length > 0 ? (studentAttendance.filter((a) => a.status === "Present").length / studentAttendance.length * 100).toFixed(1) : 0;
  const averageGrade = studentGrades.length > 0 ? (studentGrades.reduce((sum, g) => sum + g.marks / g.maxMarks * 100, 0) / studentGrades.length).toFixed(1) : 0;
  const sendMessage = () => {
    if (newMessage.teacherId && newMessage.subject && newMessage.message) {
      const message = {
        id: `M${String(Date.now()).slice(-6)}`,
        from: studentName,
        fromId: username,
        to: newMessage.teacherName,
        toId: newMessage.teacherId,
        subject: newMessage.subject,
        message: newMessage.message,
        date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        read: false,
        type: "direct"
      };
      const allMessages = getStoredData("messages", mockMessages);
      const updatedMessages = [...allMessages, message];
      setStoredData("messages", updatedMessages);
      setMessages(updatedMessages.filter((m) => m.toId === username || m.fromId === username));
      setNewMessage({ teacherId: "", teacherName: "", subject: "", message: "" });
      toast.success("Message sent successfully");
    } else {
      toast.error("Please fill all fields");
    }
  };
  const markAsRead = (messageId) => {
    const allMessages = getStoredData("messages", mockMessages);
    const updatedMessages = allMessages.map(
      (m) => m.id === messageId ? { ...m, read: true } : m
    );
    setStoredData("messages", updatedMessages);
    setMessages(updatedMessages.filter((m) => m.toId === username || m.fromId === username));
    toast.success("Message marked as read");
  };
  const inboxMessages = messages.filter((m) => m.toId === username);
  const sentMessages = messages.filter((m) => m.fromId === username);
  return /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl", children: "Student Dashboard" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-500", children: [
        "Welcome, ",
        studentName,
        " - ",
        studentBranch
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Average Grade" }),
          /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4 text-blue-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-2xl", children: [
          averageGrade,
          "%"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Attendance" }),
          /* @__PURE__ */ jsx(ClipboardCheck, { className: "h-4 w-4 text-green-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-2xl", children: [
          attendancePercentage,
          "%"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Classes This Week" }),
          /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-purple-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: studentSchedule.length }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Unread Messages" }),
          /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-orange-500" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl", children: inboxMessages.filter((m) => !m.read).length }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "grades", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "grades", children: "Academic Records" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "attendance", children: "Attendance" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "schedule", children: "Class Schedule" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "messages", children: "Messages" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "announcements", children: "Announcements" })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "grades", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Academic Performance" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Your grades and assignment scores" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Subject" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Assignment" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Marks" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Percentage" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Grade" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: studentGrades.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "text-center text-gray-500", children: "No grades available yet" }) }) : studentGrades.map((grade) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { children: grade.date }),
              /* @__PURE__ */ jsx(TableCell, { children: grade.subject }),
              /* @__PURE__ */ jsx(TableCell, { children: grade.assignment }),
              /* @__PURE__ */ jsxs(TableCell, { children: [
                grade.marks,
                "/",
                grade.maxMarks
              ] }),
              /* @__PURE__ */ jsxs(TableCell, { children: [
                (grade.marks / grade.maxMarks * 100).toFixed(1),
                "%"
              ] }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { children: grade.grade }) })
            ] }, grade.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Subject-wise Performance" }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: studentGrades.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500", children: "No data available" }) : Array.from(new Set(studentGrades.map((g) => g.subject))).map((subject) => {
              const subjectGrades = studentGrades.filter((g) => g.subject === subject);
              const avg = (subjectGrades.reduce((sum, g) => sum + g.marks / g.maxMarks * 100, 0) / subjectGrades.length).toFixed(1);
              return /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("span", { children: subject }),
                /* @__PURE__ */ jsxs(Badge, { children: [
                  avg,
                  "%"
                ] })
              ] }, subject);
            }) }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Recent Achievements" }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: studentGrades.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500", children: "No achievements yet" }) : studentGrades.filter((g) => g.marks / g.maxMarks * 100 >= 85).slice(0, 3).map((grade) => /* @__PURE__ */ jsxs("div", { className: "border-l-4 border-green-500 pl-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm", children: grade.subject }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
                grade.assignment,
                " - Grade ",
                grade.grade
              ] })
            ] }, grade.id)) }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "attendance", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Attendance Record" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Your attendance history" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-3xl", children: [
                attendancePercentage,
                "%"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "Overall Attendance" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "Present: ",
                  studentAttendance.filter((a) => a.status === "Present").length
                ] }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Absent: ",
                  studentAttendance.filter((a) => a.status === "Absent").length
                ] }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Late: ",
                  studentAttendance.filter((a) => a.status === "Late").length
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "bg-green-500 h-2 rounded-full",
                  style: { width: `${attendancePercentage}%` }
                }
              ) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Branch" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: studentAttendance.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 3, className: "text-center text-gray-500", children: "No attendance records yet" }) }) : studentAttendance.map((attendance2) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { children: attendance2.date }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: attendance2.branch?.split(" ").map((w) => w[0]).join("") || attendance2.class }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: attendance2.status === "Present" ? "default" : attendance2.status === "Late" ? "secondary" : "destructive",
                  children: attendance2.status
                }
              ) })
            ] }, attendance2.id)) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "schedule", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Class Schedule" }),
          /* @__PURE__ */ jsxs(CardDescription, { children: [
            "Your weekly class timetable for ",
            studentBranch
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Day" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Subject" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Teacher" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Time" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Room" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: studentSchedule.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 5, className: "text-center text-gray-500", children: "No schedule available" }) }) : studentSchedule.map((schedule) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: schedule.day }) }),
            /* @__PURE__ */ jsx(TableCell, { children: schedule.subject }),
            /* @__PURE__ */ jsx(TableCell, { children: schedule.teacher }),
            /* @__PURE__ */ jsx(TableCell, { children: schedule.time }),
            /* @__PURE__ */ jsx(TableCell, { children: schedule.room })
          ] }, schedule.id)) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "messages", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Send Message to Teacher" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Contact your teachers" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Select Teacher" }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  value: newMessage.teacherId,
                  onValueChange: (value) => {
                    const teacher = teachers.find((t) => t.username === value);
                    setNewMessage({
                      ...newMessage,
                      teacherId: value,
                      teacherName: teacher?.name || ""
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select teacher" }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: teachers.map((teacher) => /* @__PURE__ */ jsx(SelectItem, { value: teacher.username, children: teacher.name }, teacher.id)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Subject" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Message subject",
                  value: newMessage.subject,
                  onChange: (e) => setNewMessage({ ...newMessage, subject: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Message" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  placeholder: "Type your message here",
                  value: newMessage.message,
                  onChange: (e) => setNewMessage({ ...newMessage, message: e.target.value }),
                  rows: 4
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Button, { onClick: sendMessage, children: "Send Message" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Tabs, { defaultValue: "inbox", className: "space-y-4", children: [
          /* @__PURE__ */ jsxs(TabsList, { children: [
            /* @__PURE__ */ jsxs(TabsTrigger, { value: "inbox", children: [
              "Inbox ",
              inboxMessages.filter((m) => !m.read).length > 0 && /* @__PURE__ */ jsx(Badge, { className: "ml-2", children: inboxMessages.filter((m) => !m.read).length })
            ] }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "sent", children: "Sent" })
          ] }),
          /* @__PURE__ */ jsx(TabsContent, { value: "inbox", children: /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Inbox" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Messages from teachers" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: inboxMessages.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500 py-8", children: "No messages yet" }) : inboxMessages.map((message) => /* @__PURE__ */ jsxs(Card, { className: !message.read ? "border-l-4 border-blue-500" : "", children: [
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
                /* @__PURE__ */ jsx("p", { className: "text-sm", children: message.message }),
                !message.read && /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "mt-3",
                    onClick: () => markAsRead(message.id),
                    children: "Mark as Read"
                  }
                )
              ] })
            ] }, message.id)) }) })
          ] }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "sent", children: /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Sent Messages" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Messages you've sent to teachers" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: sentMessages.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500 py-8", children: "No sent messages" }) : sentMessages.map((message) => /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: message.subject }),
                /* @__PURE__ */ jsxs(CardDescription, { children: [
                  "To: ",
                  message.to,
                  " - ",
                  message.date
                ] })
              ] }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-sm", children: message.message }) })
            ] }, message.id)) }) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "announcements", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Announcements" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Important announcements from administration" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: announcements.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500 py-8", children: "No announcements" }) : announcements.map((announcement) => /* @__PURE__ */ jsxs(Card, { className: "border-l-4 border-yellow-500", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: announcement.subject }),
            /* @__PURE__ */ jsxs(CardDescription, { children: [
              "From: ",
              announcement.from,
              " - ",
              announcement.date
            ] })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-sm", children: announcement.message }) })
        ] }, announcement.id)) }) })
      ] }) })
    ] })
  ] });
}
export {
  StudentDashboard
};
