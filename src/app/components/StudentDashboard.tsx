import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BookOpen, Calendar, ClipboardCheck, Mail } from 'lucide-react';
import { mockAttendance, mockGrades, mockSchedules, mockMessages, mockUsers, mockAnnouncements, Message, Announcement } from '../data/mockData';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { getStoredData, setStoredData } from '../utils/storage';

interface StudentDashboardProps {
  userId: string;
  username: string;
}

export function StudentDashboard({ userId, username }: StudentDashboardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newMessage, setNewMessage] = useState({
    teacherId: '',
    teacherName: '',
    subject: '',
    message: ''
  });

  const students = getStoredData('students', []);
  const currentStudent = students.find((s: any) => s.username === username);
  const studentId = currentStudent?.id || 'S001';
  const studentName = currentStudent?.name || 'Student';
  const studentClass = currentStudent?.class || 'Year 1';
  const studentBranch = currentStudent?.branch || 'Computer Science Engineering';

  const grades = getStoredData('grades', mockGrades);
  const attendance = getStoredData('attendance', mockAttendance);
  const schedules = getStoredData('schedules', mockSchedules);
  const users = getStoredData('users', mockUsers);

  const studentGrades = grades.filter((g: any) => g.studentId === studentId);
  const studentAttendance = attendance.filter((a: any) => a.studentId === studentId);
  const studentSchedule = schedules.filter((s: any) => s.class === studentBranch);

  const teachers = users.filter((u: any) => u.role === 'Teacher');

  useEffect(() => {
    const allMessages = getStoredData('messages', mockMessages);
    setMessages(allMessages.filter((m: Message) => m.toId === username || m.fromId === username));
    
    const allAnnouncements = getStoredData('announcements', mockAnnouncements);
    setAnnouncements(allAnnouncements.filter((a: Announcement) => a.targetRoles.includes('Student')));
  }, [username]);

  const attendancePercentage = studentAttendance.length > 0
    ? (studentAttendance.filter((a: any) => a.status === 'Present').length / studentAttendance.length * 100).toFixed(1)
    : 0;

  const averageGrade = studentGrades.length > 0
    ? (studentGrades.reduce((sum: number, g: any) => sum + (g.marks / g.maxMarks * 100), 0) / studentGrades.length).toFixed(1)
    : 0;

  const sendMessage = () => {
    if (newMessage.teacherId && newMessage.subject && newMessage.message) {
      const message: Message = {
        id: `M${String(Date.now()).slice(-6)}`,
        from: studentName,
        fromId: username,
        to: newMessage.teacherName,
        toId: newMessage.teacherId,
        subject: newMessage.subject,
        message: newMessage.message,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'direct'
      };
      
      const allMessages = getStoredData('messages', mockMessages);
      const updatedMessages = [...allMessages, message];
      setStoredData('messages', updatedMessages);
      setMessages(updatedMessages.filter((m: Message) => m.toId === username || m.fromId === username));
      setNewMessage({ teacherId: '', teacherName: '', subject: '', message: '' });
      toast.success('Message sent successfully');
    } else {
      toast.error('Please fill all fields');
    }
  };

  const markAsRead = (messageId: string) => {
    const allMessages = getStoredData('messages', mockMessages);
    const updatedMessages = allMessages.map((m: Message) =>
      m.id === messageId ? { ...m, read: true } : m
    );
    setStoredData('messages', updatedMessages);
    setMessages(updatedMessages.filter((m: Message) => m.toId === username || m.fromId === username));
    toast.success('Message marked as read');
  };

  const inboxMessages = messages.filter(m => m.toId === username);
  const sentMessages = messages.filter(m => m.fromId === username);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Student Dashboard</h1>
          <p className="text-gray-500">Welcome, {studentName} - {studentBranch}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Average Grade</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{averageGrade}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Attendance</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{attendancePercentage}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Classes This Week</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{studentSchedule.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Unread Messages</CardTitle>
            <Mail className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{inboxMessages.filter((m: Message) => !m.read).length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="grades" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grades">Academic Records</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="schedule">Class Schedule</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>Your grades and assignment scores</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentGrades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        No grades available yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    studentGrades.map((grade: any) => (
                      <TableRow key={grade.id}>
                        <TableCell>{grade.date}</TableCell>
                        <TableCell>{grade.subject}</TableCell>
                        <TableCell>{grade.assignment}</TableCell>
                        <TableCell>{grade.marks}/{grade.maxMarks}</TableCell>
                        <TableCell>{((grade.marks / grade.maxMarks) * 100).toFixed(1)}%</TableCell>
                        <TableCell>
                          <Badge>{grade.grade}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentGrades.length === 0 ? (
                    <p className="text-center text-gray-500">No data available</p>
                  ) : (
                    Array.from(new Set(studentGrades.map((g: any) => g.subject))).map((subject: any) => {
                      const subjectGrades = studentGrades.filter((g: any) => g.subject === subject);
                      const avg = (subjectGrades.reduce((sum: number, g: any) => sum + (g.marks / g.maxMarks * 100), 0) / subjectGrades.length).toFixed(1);
                      return (
                        <div key={subject} className="flex justify-between items-center">
                          <span>{subject}</span>
                          <Badge>{avg}%</Badge>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentGrades.length === 0 ? (
                    <p className="text-center text-gray-500">No achievements yet</p>
                  ) : (
                    studentGrades
                      .filter((g: any) => (g.marks / g.maxMarks * 100) >= 85)
                      .slice(0, 3)
                      .map((grade: any) => (
                        <div key={grade.id} className="border-l-4 border-green-500 pl-3">
                          <div className="text-sm">{grade.subject}</div>
                          <div className="text-xs text-gray-500">{grade.assignment} - Grade {grade.grade}</div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Record</CardTitle>
              <CardDescription>Your attendance history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl">{attendancePercentage}%</div>
                    <div className="text-sm text-gray-500">Overall Attendance</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Present: {studentAttendance.filter((a: any) => a.status === 'Present').length}</span>
                      <span>Absent: {studentAttendance.filter((a: any) => a.status === 'Absent').length}</span>
                      <span>Late: {studentAttendance.filter((a: any) => a.status === 'Late').length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${attendancePercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentAttendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500">
                        No attendance records yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    studentAttendance.map((attendance: any) => (
                      <TableRow key={attendance.id}>
                        <TableCell>{attendance.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{attendance.branch?.split(' ').map((w: string) => w[0]).join('') || attendance.class}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              attendance.status === 'Present' ? 'default' :
                              attendance.status === 'Late' ? 'secondary' : 'destructive'
                            }
                          >
                            {attendance.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
              <CardDescription>Your weekly class timetable for {studentBranch}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Room</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentSchedule.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        No schedule available
                      </TableCell>
                    </TableRow>
                  ) : (
                    studentSchedule.map((schedule: any) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          <Badge variant="outline">{schedule.day}</Badge>
                        </TableCell>
                        <TableCell>{schedule.subject}</TableCell>
                        <TableCell>{schedule.teacher}</TableCell>
                        <TableCell>{schedule.time}</TableCell>
                        <TableCell>{schedule.room}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Message to Teacher</CardTitle>
              <CardDescription>Contact your teachers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Teacher</Label>
                  <Select 
                    value={newMessage.teacherId} 
                    onValueChange={(value) => {
                      const teacher = teachers.find((t: any) => t.username === value);
                      setNewMessage({ 
                        ...newMessage, 
                        teacherId: value,
                        teacherName: teacher?.name || ''
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher: any) => (
                        <SelectItem key={teacher.id} value={teacher.username}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    placeholder="Message subject"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Type your message here"
                    value={newMessage.message}
                    onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                    rows={4}
                  />
                </div>
                <Button onClick={sendMessage}>Send Message</Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="inbox" className="space-y-4">
            <TabsList>
              <TabsTrigger value="inbox">
                Inbox {inboxMessages.filter((m: Message) => !m.read).length > 0 && 
                  <Badge className="ml-2">{inboxMessages.filter((m: Message) => !m.read).length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
            </TabsList>

            <TabsContent value="inbox">
              <Card>
                <CardHeader>
                  <CardTitle>Inbox</CardTitle>
                  <CardDescription>Messages from teachers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inboxMessages.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No messages yet</p>
                    ) : (
                      inboxMessages.map((message: Message) => (
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
                            <p className="text-sm">{message.message}</p>
                            {!message.read && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-3"
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

            <TabsContent value="sent">
              <Card>
                <CardHeader>
                  <CardTitle>Sent Messages</CardTitle>
                  <CardDescription>Messages you've sent to teachers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sentMessages.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No sent messages</p>
                    ) : (
                      sentMessages.map((message: Message) => (
                        <Card key={message.id}>
                          <CardHeader>
                            <CardTitle className="text-base">{message.subject}</CardTitle>
                            <CardDescription>To: {message.to} - {message.date}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{message.message}</p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Important announcements from administration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No announcements</p>
                ) : (
                  announcements.map((announcement: Announcement) => (
                    <Card key={announcement.id} className="border-l-4 border-yellow-500">
                      <CardHeader>
                        <CardTitle className="text-base">{announcement.subject}</CardTitle>
                        <CardDescription>From: {announcement.from} - {announcement.date}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{announcement.message}</p>
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