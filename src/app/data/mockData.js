const engineeringBranches = {
  "Computer Science Engineering": [
    "Data Structures",
    "Algorithms",
    "Database Management Systems",
    "Operating Systems",
    "Computer Networks",
    "Software Engineering",
    "Web Technologies",
    "Artificial Intelligence"
  ],
  "Electronics and Communication Engineering": [
    "Digital Electronics",
    "Signals and Systems",
    "Communication Systems",
    "Microprocessors",
    "VLSI Design",
    "Embedded Systems",
    "Analog Electronics",
    "Control Systems"
  ],
  "Mechanical Engineering": [
    "Thermodynamics",
    "Fluid Mechanics",
    "Machine Design",
    "Manufacturing Technology",
    "Heat Transfer",
    "Automobile Engineering",
    "CAD/CAM",
    "Robotics"
  ],
  "Civil Engineering": [
    "Structural Analysis",
    "Surveying",
    "Concrete Technology",
    "Geotechnical Engineering",
    "Transportation Engineering",
    "Environmental Engineering",
    "Hydraulics",
    "Building Materials"
  ],
  "Electrical Engineering": [
    "Power Systems",
    "Electrical Machines",
    "Control Systems",
    "Power Electronics",
    "Circuit Theory",
    "Electrical Measurements",
    "Renewable Energy",
    "High Voltage Engineering"
  ],
  "Information Technology": [
    "Programming in C",
    "Java Programming",
    "Database Management",
    "Cloud Computing",
    "Cybersecurity",
    "Mobile Application Development",
    "Software Testing",
    "DevOps"
  ]
};
const studentNames = [
  "John Smith",
  "Emma Johnson",
  "Oliver Williams",
  "Sophia Brown",
  "Liam Davis",
  "Ava Wilson",
  "Noah Martinez",
  "Isabella Anderson",
  "Ethan Thomas",
  "Mia Jackson",
  "Lucas White",
  "Charlotte Harris",
  "Mason Clark",
  "Amelia Lewis",
  "Logan Walker",
  "Harper Hall",
  "Alexander Allen",
  "Evelyn Young",
  "Jacob King",
  "Abigail Wright",
  "Michael Scott",
  "Emily Green",
  "Daniel Adams",
  "Elizabeth Baker",
  "Matthew Nelson",
  "Sofia Carter",
  "David Mitchell",
  "Avery Perez",
  "Joseph Roberts",
  "Ella Turner",
  "Samuel Phillips",
  "Scarlett Campbell",
  "Henry Parker",
  "Grace Evans",
  "Owen Edwards",
  "Chloe Collins",
  "Sebastian Stewart",
  "Victoria Morris",
  "Jack Rogers",
  "Lily Reed",
  "Benjamin Cook",
  "Zoey Morgan",
  "Theodore Bell",
  "Nora Murphy",
  "Elijah Bailey",
  "Hannah Rivera",
  "Aiden Cooper",
  "Lillian Richardson",
  "Jackson Cox",
  "Addison Howard",
  "Gabriel Ward",
  "Natalie Torres",
  "Carter Peterson",
  "Aubrey Gray",
  "Wyatt Ramirez",
  "Brooklyn James",
  "Julian Watson",
  "Penelope Brooks",
  "Luke Kelly",
  "Layla Sanders",
  "Anthony Price",
  "Zoe Bennett",
  "Isaac Wood",
  "Leah Barnes",
  "Ryan Ross",
  "Savannah Henderson",
  "Nathan Coleman",
  "Audrey Jenkins",
  "Dylan Perry",
  "Claire Powell",
  "Caleb Long",
  "Paisley Patterson",
  "Joshua Hughes",
  "Bella Flores",
  "Andrew Washington",
  "Skylar Butler",
  "Christopher Simmons",
  "Hannah Foster",
  "Josiah Gonzales",
  "Aria Bryant",
  "Hunter Alexander",
  "Anna Russell",
  "Eli Griffin",
  "Caroline Diaz",
  "Christian Hayes",
  "Genesis Myers",
  "Aaron Ford",
  "Kennedy Hamilton",
  "Thomas Graham",
  "Madelyn Sullivan",
  "Charles Wallace",
  "Kinsley Woods",
  "Jaxon Cole",
  "Naomi West",
  "Isaiah Jordan",
  "Elena Owens",
  "Landon Reynolds",
  "Sarah Fisher",
  "Cameron Ellis",
  "Maya Gibson",
  "Connor Marshall",
  "Ruby Wallace",
  "Jeremiah Holmes",
  "Alice Stevens",
  "Adrian Chapman",
  "Violet Mason",
  "Hudson Hunt",
  "Samantha Hunter",
  "Robert Cole",
  "Ariana Webb"
];
const generateStudents = () => {
  const students = [];
  let studentCounter = 1;
  let nameIndex = 0;
  Object.keys(engineeringBranches).forEach((branch) => {
    const subjects = engineeringBranches[branch];
    for (let i = 0; i < 20; i++) {
      const name = studentNames[nameIndex % studentNames.length];
      const year = Math.floor(i / 5) + 1;
      students.push({
        id: `S${String(studentCounter).padStart(3, "0")}`,
        name,
        email: `${name.toLowerCase().replace(" ", ".")}@college.edu`,
        username: `${name.toLowerCase().replace(" ", "")}${studentCounter}`,
        password: "student123",
        class: `Year ${year}`,
        degree: "B.Tech",
        branch,
        rollNumber: `${branch.split(" ").map((w) => w[0]).join("")}${year}${String(i + 1).padStart(2, "0")}`,
        dateOfBirth: `200${Math.floor(Math.random() * 4) + 1}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
        guardianName: `Guardian of ${name}`,
        guardianContact: `+1${String(Math.floor(Math.random() * 9e9) + 1e9)}`,
        address: `${studentCounter} College St, City`,
        subjects
      });
      studentCounter++;
      nameIndex++;
    }
  });
  return students;
};
const mockStudents = generateStudents();
const teacherNames = [
  "Dr. Sarah Miller",
  "Prof. John Anderson",
  "Dr. Emily Taylor",
  "Prof. Robert Clark",
  "Dr. Michael Brown",
  "Prof. Jennifer Wilson",
  "Dr. David Moore",
  "Prof. Linda Garcia",
  "Dr. James Rodriguez",
  "Prof. Patricia Martinez",
  "Dr. Richard Lee",
  "Prof. Mary Lopez",
  "Dr. Thomas White",
  "Prof. Barbara Hall",
  "Dr. Christopher Allen",
  "Prof. Susan Wright",
  "Dr. Daniel King",
  "Prof. Karen Scott",
  "Dr. Matthew Green",
  "Prof. Nancy Adams"
];
const mockUsers = [
  { id: "U001", name: "Admin User", email: "admin@college.edu", username: "admin", password: "admin123", role: "Admin", status: "Active" },
  { id: "U002", name: "Principal Johnson", email: "principal@college.edu", username: "principal", password: "principal123", role: "Administrator", status: "Active" },
  ...teacherNames.map((name, index) => ({
    id: `U${String(index + 3).padStart(3, "0")}`,
    name,
    email: `${name.toLowerCase().replace(/[^a-z]/g, "")}@college.edu`,
    username: name.toLowerCase().replace(/[^a-z]/g, ""),
    password: "teacher123",
    role: "Teacher",
    status: "Active"
  })),
  ...mockStudents.map((student, index) => ({
    id: `U${String(index + 100).padStart(3, "0")}`,
    name: student.name,
    email: student.email,
    username: student.username,
    password: student.password,
    role: "Student",
    degree: student.degree,
    branch: student.branch,
    status: "Active"
  }))
];
const mockAttendance = mockStudents.slice(0, 30).map((student, index) => ({
  id: `A${String(index + 1).padStart(3, "0")}`,
  studentId: student.id,
  studentName: student.name,
  date: "2026-02-21",
  status: ["Present", "Present", "Present", "Absent", "Late"][Math.floor(Math.random() * 5)],
  class: student.class,
  degree: student.degree,
  branch: student.branch
}));
const mockGrades = mockStudents.slice(0, 20).flatMap(
  (student, studentIndex) => student.subjects.slice(0, 2).map((subject, subjectIndex) => {
    const marks = Math.floor(Math.random() * 40) + 60;
    const maxMarks = 100;
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
    return {
      id: `G${String(studentIndex * 10 + subjectIndex + 1).padStart(3, "0")}`,
      studentId: student.id,
      studentName: student.name,
      subject,
      assignment: ["Midterm Exam", "Assignment 1", "Quiz 1", "Lab Report"][Math.floor(Math.random() * 4)],
      marks,
      maxMarks,
      grade,
      date: `2026-02-${String(Math.floor(Math.random() * 20) + 1).padStart(2, "0")}`
    };
  })
);
const mockSchedules = Object.keys(engineeringBranches).flatMap((branch, branchIndex) => {
  const subjects = engineeringBranches[branch];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return subjects.slice(0, 5).map((subject, index) => ({
    id: `SC${String(branchIndex * 10 + index + 1).padStart(3, "0")}`,
    class: branch,
    subject,
    teacher: teacherNames[Math.floor(Math.random() * teacherNames.length)],
    day: days[index % 5],
    time: `${String(9 + index).padStart(2, "0")}:00 - ${String(10 + index).padStart(2, "0")}:00`,
    room: `Room ${101 + branchIndex * 10 + index}`
  }));
});
const mockResources = [
  { id: "R001", name: "Projector", type: "Equipment", quantity: 10, location: "Room 101", status: "Available" },
  { id: "R002", name: "Laptop", type: "Equipment", quantity: 25, location: "Computer Lab", status: "Available" },
  { id: "R003", name: "Chemistry Lab Kit", type: "Lab Equipment", quantity: 5, location: "Lab 1", status: "In Use" },
  { id: "R004", name: "Sports Equipment", type: "Physical", quantity: 50, location: "Gym", status: "Available" },
  { id: "R005", name: "Whiteboard", type: "Classroom", quantity: 15, location: "Various Rooms", status: "Available" },
  { id: "R006", name: "Microscope", type: "Lab Equipment", quantity: 8, location: "Lab 2", status: "Maintenance" },
  { id: "R007", name: "Oscilloscope", type: "Lab Equipment", quantity: 12, location: "Electronics Lab", status: "Available" },
  { id: "R008", name: "3D Printer", type: "Equipment", quantity: 3, location: "Mechanical Workshop", status: "In Use" }
];
const mockMessages = [
  {
    id: "M001",
    from: "John Smith",
    fromId: "S001",
    to: "Dr. Sarah Miller",
    toId: "drsarahmiller",
    subject: "Assignment Doubt",
    message: "I have some questions regarding the Data Structures assignment.",
    date: "2026-02-20",
    read: false,
    type: "direct"
  },
  {
    id: "M002",
    from: "Emma Johnson",
    fromId: "S002",
    to: "Prof. John Anderson",
    toId: "profjohnanderson",
    subject: "Lab Report Submission",
    message: "Can I get an extension for the lab report submission?",
    date: "2026-02-19",
    read: true,
    type: "direct"
  }
];
const mockAnnouncements = [
  {
    id: "AN001",
    from: "Principal Johnson",
    fromId: "principal",
    subject: "Mid-Semester Break",
    message: "The college will be closed from March 1st to March 7th for mid-semester break.",
    date: "2026-02-15",
    targetRoles: ["Teacher", "Student"]
  }
];
const mockSettings = [
  { id: "SET001", category: "Academic", setting: "Academic Year", value: "2025-2026" },
  { id: "SET002", category: "Academic", setting: "Grading System", value: "Letter Grades (A-F)" },
  { id: "SET003", category: "Academic", setting: "Attendance Threshold", value: "75%" },
  { id: "SET004", category: "System", setting: "Max Students Per Class", value: "30" },
  { id: "SET005", category: "System", setting: "College Name", value: "Springfield Engineering College" },
  { id: "SET006", category: "System", setting: "College Email Domain", value: "@college.edu" },
  { id: "SET007", category: "Communication", setting: "Enable Email Notifications", value: "Yes" },
  { id: "SET008", category: "Communication", setting: "Enable SMS Alerts", value: "No" }
];
const getStoredData = (key, defaultData) => {
  if (typeof window === "undefined") return defaultData;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultData;
};
const setStoredData = (key, data) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
};
export {
  engineeringBranches,
  getStoredData,
  mockAnnouncements,
  mockAttendance,
  mockGrades,
  mockMessages,
  mockResources,
  mockSchedules,
  mockSettings,
  mockStudents,
  mockUsers,
  setStoredData
};
