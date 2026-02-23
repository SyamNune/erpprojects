import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { BookOpen, Calendar, ClipboardCheck, Users, Mail } from 'lucide-react';
import { mockStudents, mockAttendance, mockGrades, mockSchedules, mockMessages, Student, Attendance, Grade, Schedule, Message, engineeringBranches } from '../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { getStoredData, setStoredData } from '../utils/storage';

interface TeacherDashboardProps {
  username: string;
}

export function TeacherDashboard({ username }: TeacherDashboardProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [newGrade, setNewGrade] = useState({
    studentId: '',
    subject: '',
    assignment: '',
    marks: '',
    maxMarks: '100'
  });

  const [newSchedule, setNewSchedule] = useState({
    class: '',
    subject: '',
    teacher: 'Teacher',
    day: '',
    time: '',
    room: ''
  });

  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [attendanceDate] = useState('2026-02-21');

  useEffect(() => {
    setStudents(getStoredData('students', mockStudents));
    setAttendance(getStoredData('attendance', mockAttendance));
    setGrades(getStoredData('grades', mockGrades));
    setSchedules(getStoredData('schedules', mockSchedules));
    
    const allMessages = getStoredData('messages', mockMessages);
    setMessages(allMessages.filter((m: Message) => m.toId === username));
  }, [username]);

  const addGrade = () => {
    if (newGrade.studentId && newGrade.subject && newGrade.assignment && newGrade.marks) {
      const student = students.find(s => s.id === newGrade.studentId);
      const marks = parseInt(newGrade.marks);
      const maxMarks = parseInt(newGrade.maxMarks);
      const percentage = (marks / maxMarks) * 100;
      
      let grade = 'F';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 85) grade = 'A';
      else if (percentage >= 80) grade = 'A-';
      else if (percentage >= 75) grade = 'B+';
      else if (percentage >= 70) grade = 'B';
      else if (percentage >= 65) grade = 'B-';
      else if (percentage >= 60) grade = 'C';
      else if (percentage >= 50) grade = 'D';

      const gradeEntry: Grade = {
        id: `G${String(grades.length + 1).padStart(3, '0')}`,
        studentId: newGrade.studentId,
        studentName: student?.name || '',
        subject: newGrade.subject,
        assignment: newGrade.assignment,
        marks,
        maxMarks,
        grade,
        date: new Date().toISOString().split('T')[0]
      };
      
      const updatedGrades = [...grades, gradeEntry];
      setGrades(updatedGrades);
      setStoredData('grades', updatedGrades);
      setNewGrade({ studentId: '', subject: '', assignment: '', marks: '', maxMarks: '100' });
      toast.success('Grade added successfully');
    } else {
      toast.error('Please fill all fields');
    }
  };

  const addSchedule = () => {
    if (newSchedule.class && newSchedule.subject && newSchedule.day && newSchedule.time && newSchedule.room) {
      const schedule: Schedule = {
        id: `SC${String(schedules.length + 1).padStart(3, '0')}`,
        ...newSchedule
      };
      const updatedSchedules = [...schedules, schedule];
      setSchedules(updatedSchedules);
      setStoredData('schedules', updatedSchedules);
      setNewSchedule({ class: '', subject: '', teacher: 'Teacher', day: '', time: '', room: '' });
      toast.success('Schedule added successfully');
    } else {
      toast.error('Please fill all fields');
    }
  };

  const markAttendance = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    const student = students.find(s => s.id === studentId);
    const existingIndex = attendance.findIndex(
      a => a.studentId === studentId && a.date === attendanceDate
    );

    let updatedAttendance;
    if (existingIndex >= 0) {
      updatedAttendance = [...attendance];
      updatedAttendance[existingIndex] = { ...updatedAttendance[existingIndex], status };
    } else {
      const newAttendance: Attendance = {
        id: `A${String(attendance.length + 1).padStart(3, '0')}`,
        studentId,
        studentName: student?.name || '',
        date: attendanceDate,
        status,
        class: student?.class || '',
        degree: student?.degree || '',
        branch: student?.branch || ''
      };
      updatedAttendance = [...attendance, newAttendance];
    }
    
    setAttendance(updatedAttendance);
    setStoredData('attendance', updatedAttendance);
    toast.success('Attendance marked');
  };

  const getAttendanceStatus = (studentId: string) => {
    return attendance.find(a => a.studentId === studentId && a.date === attendanceDate)?.status;
  };

  const markAsRead = (messageId: string) => {
    const allMessages = getStoredData('messages', mockMessages);
    const updatedMessages = allMessages.map((m: Message) =>
      m.id === messageId ? { ...m, read: true } : m
    );
    setStoredData('messages', updatedMessages);
    setMessages(updatedMessages.filter((m: Message) => m.toId === username));
    toast.success('Message marked as read');
  };

  const filteredStudents = selectedBranch 
    ? students.filter(s => s.branch === selectedBranch)
    : students;

  const unreadMessagesCount = messages.filter(m => !m.read).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Teacher Dashboard</h1>
          <p className="text-gray-500">Manage students, grades, and class schedules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Students</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Assignments Graded</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{grades.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Classes Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{schedules.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Unread Messages</CardTitle>
            <Mail className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{unreadMessagesCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Student Records</TabsTrigger>
          <TabsTrigger value="grades">Grade Management</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="schedule">Class Schedule</TabsTrigger>
          <TabsTrigger value="messages">
            Messages {unreadMessagesCount > 0 && <Badge className="ml-2">{unreadMessagesCount}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Records</CardTitle>
              <CardDescription>View and manage student information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label>Filter by Branch</Label>
                <Select value={selectedBranch || "all"} onValueChange={(value) => setSelectedBranch(value === "all" ? "" : value)}>
                  <SelectTrigger className="max-w-sm">
                    <SelectValue placeholder="All branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {Object.keys(engineeringBranches).map(branch => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Guardian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{student.branch.split(' ').map(w => w[0]).join('')}</Badge>
                        </TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.guardianName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Grade</CardTitle>
              <CardDescription>Record assignment and exam grades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label>Student</Label>
                  <Select value={newGrade.studentId} onValueChange={(value) => setNewGrade({ ...newGrade, studentId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} ({student.rollNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    placeholder="e.g., Mathematics"
                    value={newGrade.subject}
                    onChange={(e) => setNewGrade({ ...newGrade, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assignment</Label>
                  <Input
                    placeholder="e.g., Midterm Exam"
                    value={newGrade.assignment}
                    onChange={(e) => setNewGrade({ ...newGrade, assignment: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Marks</Label>
                  <Input
                    type="number"
                    placeholder="85"
                    value={newGrade.marks}
                    onChange={(e) => setNewGrade({ ...newGrade, marks: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Marks</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={newGrade.maxMarks}
                    onChange={(e) => setNewGrade({ ...newGrade, maxMarks: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addGrade} className="w-full">Add Grade</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grade Records</CardTitle>
              <CardDescription>All graded assignments and exams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell>{grade.date}</TableCell>
                        <TableCell>{grade.studentName}</TableCell>
                        <TableCell>{grade.subject}</TableCell>
                        <TableCell>{grade.assignment}</TableCell>
                        <TableCell>{grade.marks}/{grade.maxMarks}</TableCell>
                        <TableCell>
                          <Badge>{grade.grade}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mark Attendance - {attendanceDate}</CardTitle>
              <CardDescription>Record student attendance for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label>Filter by Branch/Degree</Label>
                <Select value={selectedBranch || "all"} onValueChange={(value) => setSelectedBranch(value === "all" ? "" : value)}>
                  <SelectTrigger className="max-w-sm">
                    <SelectValue placeholder="All branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {Object.keys(engineeringBranches).map(branch => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const status = getAttendanceStatus(student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{student.branch.split(' ').map(w => w[0]).join('')}</Badge>
                          </TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>
                            {status ? (
                              <Badge
                                variant={
                                  status === 'Present' ? 'default' :
                                  status === 'Late' ? 'secondary' : 'destructive'
                                }
                              >
                                {status}
                              </Badge>
                            ) : (
                              <span className="text-gray-400">Not marked</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={status === 'Present' ? 'default' : 'outline'}
                                onClick={() => markAttendance(student.id, 'Present')}
                              >
                                Present
                              </Button>
                              <Button
                                size="sm"
                                variant={status === 'Absent' ? 'destructive' : 'outline'}
                                onClick={() => markAttendance(student.id, 'Absent')}
                              >
                                Absent
                              </Button>
                              <Button
                                size="sm"
                                variant={status === 'Late' ? 'secondary' : 'outline'}
                                onClick={() => markAttendance(student.id, 'Late')}
                              >
                                Late
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Class Schedule</CardTitle>
              <CardDescription>Schedule a new class session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label>Class/Branch</Label>
                  <Select value={newSchedule.class} onValueChange={(value) => setNewSchedule({ ...newSchedule, class: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(engineeringBranches).map(branch => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    placeholder="e.g., Mathematics"
                    value={newSchedule.subject}
                    onChange={(e) => setNewSchedule({ ...newSchedule, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Select value={newSchedule.day} onValueChange={(value) => setNewSchedule({ ...newSchedule, day: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Tuesday">Tuesday</SelectItem>
                      <SelectItem value="Wednesday">Wednesday</SelectItem>
                      <SelectItem value="Thursday">Thursday</SelectItem>
                      <SelectItem value="Friday">Friday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    placeholder="09:00 - 10:00"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Room</Label>
                  <Input
                    placeholder="Room 101"
                    value={newSchedule.room}
                    onChange={(e) => setNewSchedule({ ...newSchedule, room: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addSchedule} className="w-full">Add Schedule</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
              <CardDescription>All scheduled classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Room</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          <Badge variant="outline">{schedule.class.split(' ').map(w => w[0]).join('')}</Badge>
                        </TableCell>
                        <TableCell>{schedule.subject}</TableCell>
                        <TableCell>{schedule.teacher}</TableCell>
                        <TableCell>{schedule.day}</TableCell>
                        <TableCell>{schedule.time}</TableCell>
                        <TableCell>{schedule.room}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Messages</CardTitle>
              <CardDescription>Messages from students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No messages yet</p>
                ) : (
                  messages.map((message) => (
                    <Card key={message.id} className={!message.read ? 'border-l-4 border-blue-500' : ''}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{message.subject}</CardTitle>
                            <CardDescription>From: {message.from} - {message.date}</CardDescription>
                          </div>
                          {!message.read && <Badge>New</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">{message.message}</p>
                        {!message.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(message.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}