import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { BarChart, Building2, FileText, Package, Megaphone } from 'lucide-react';
import { mockResources, mockStudents, mockGrades, mockAttendance, mockAnnouncements, Resource, Announcement } from '../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { getStoredData, setStoredData } from '../utils/storage';

interface AdministratorDashboardProps {
  username: string;
  userId: string;
}

export function AdministratorDashboard({ username, userId }: AdministratorDashboardProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newResource, setNewResource] = useState({
    name: '',
    type: '',
    quantity: '',
    location: '',
    status: 'Available' as const
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    subject: '',
    message: '',
    targetRoles: [] as string[]
  });

  const students = getStoredData('students', mockStudents);
  const grades = getStoredData('grades', mockGrades);
  const attendance = getStoredData('attendance', mockAttendance);
  const users = getStoredData('users', []);
  const currentUser = users.find((u: any) => u.username === username);

  useEffect(() => {
    setResources(getStoredData('resources', mockResources));
    setAnnouncements(getStoredData('announcements', mockAnnouncements));
  }, []);

  const addResource = () => {
    if (!newResource.name || !newResource.type || !newResource.quantity || !newResource.location) {
      toast.error('Please fill all fields');
      return;
    }

    const resource: Resource = {
      id: `R${String(resources.length + 1).padStart(3, '0')}`,
      name: newResource.name,
      type: newResource.type,
      quantity: parseInt(newResource.quantity),
      location: newResource.location,
      status: newResource.status
    };
    const updatedResources = [...resources, resource];
    setResources(updatedResources);
    setStoredData('resources', updatedResources);
    setNewResource({ name: '', type: '', quantity: '', location: '', status: 'Available' });
    toast.success('Resource added successfully');
  };

  const updateResourceStatus = (resourceId: string, status: 'Available' | 'In Use' | 'Maintenance') => {
    const updatedResources = resources.map(r =>
      r.id === resourceId ? { ...r, status } : r
    );
    setResources(updatedResources);
    setStoredData('resources', updatedResources);
    toast.success('Resource status updated');
  };

  const sendAnnouncement = () => {
    if (!newAnnouncement.subject || !newAnnouncement.message || newAnnouncement.targetRoles.length === 0) {
      toast.error('Please fill all fields and select at least one recipient role');
      return;
    }

    const announcement: Announcement = {
      id: `AN${String(Date.now()).slice(-6)}`,
      from: currentUser?.name || 'Administrator',
      fromId: username,
      subject: newAnnouncement.subject,
      message: newAnnouncement.message,
      date: new Date().toISOString().split('T')[0],
      targetRoles: newAnnouncement.targetRoles
    };

    const allAnnouncements = getStoredData('announcements', mockAnnouncements);
    const updatedAnnouncements = [...allAnnouncements, announcement];
    setStoredData('announcements', updatedAnnouncements);
    setAnnouncements(updatedAnnouncements);
    setNewAnnouncement({ subject: '', message: '', targetRoles: [] });
    toast.success('Announcement sent successfully');
  };

  const toggleRole = (role: string) => {
    setNewAnnouncement(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role]
    }));
  };

  const generateReport = (reportType: string) => {
    let reportContent = '';
    let reportData: any[] = [];

    switch (reportType) {
      case 'attendance':
        reportContent = 'ATTENDANCE REPORT\n' +
          '=================\n' +
          `Generated: ${new Date().toLocaleString()}\n\n`;
        
        const attendanceByBranch: { [key: string]: { present: number; absent: number; late: number; total: number } } = {};
        attendance.forEach((a: any) => {
          if (!attendanceByBranch[a.branch]) {
            attendanceByBranch[a.branch] = { present: 0, absent: 0, late: 0, total: 0 };
          }
          attendanceByBranch[a.branch][a.status.toLowerCase() as 'present' | 'absent' | 'late']++;
          attendanceByBranch[a.branch].total++;
        });

        Object.entries(attendanceByBranch).forEach(([branch, stats]) => {
          const percentage = ((stats.present / stats.total) * 100).toFixed(1);
          reportContent += `${branch}:\n`;
          reportContent += `  Present: ${stats.present}\n`;
          reportContent += `  Absent: ${stats.absent}\n`;
          reportContent += `  Late: ${stats.late}\n`;
          reportContent += `  Attendance Rate: ${percentage}%\n\n`;
        });
        break;

      case 'academic':
        reportContent = 'ACADEMIC PERFORMANCE REPORT\n' +
          '============================\n' +
          `Generated: ${new Date().toLocaleString()}\n\n`;
        
        const gradesBySubject: { [key: string]: number[] } = {};
        grades.forEach((g: any) => {
          if (!gradesBySubject[g.subject]) {
            gradesBySubject[g.subject] = [];
          }
          gradesBySubject[g.subject].push((g.marks / g.maxMarks) * 100);
        });

        Object.entries(gradesBySubject).forEach(([subject, marks]) => {
          const avg = (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(1);
          reportContent += `${subject}:\n`;
          reportContent += `  Average: ${avg}%\n`;
          reportContent += `  Total Assessments: ${marks.length}\n\n`;
        });
        break;

      case 'student':
        reportContent = 'STUDENT ENROLLMENT REPORT\n' +
          '=========================\n' +
          `Generated: ${new Date().toLocaleString()}\n\n`;
        
        const studentsByBranch: { [key: string]: number } = {};
        students.forEach((s: any) => {
          studentsByBranch[s.branch] = (studentsByBranch[s.branch] || 0) + 1;
        });

        reportContent += `Total Students: ${students.length}\n\n`;
        reportContent += 'Students by Branch:\n';
        Object.entries(studentsByBranch).forEach(([branch, count]) => {
          reportContent += `  ${branch}: ${count}\n`;
        });
        break;

      case 'resource':
        reportContent = 'RESOURCE INVENTORY REPORT\n' +
          '=========================\n' +
          `Generated: ${new Date().toLocaleString()}\n\n`;
        
        reportContent += `Total Resources: ${resources.length}\n\n`;
        resources.forEach(r => {
          reportContent += `${r.name} (${r.type}):\n`;
          reportContent += `  Quantity: ${r.quantity}\n`;
          reportContent += `  Location: ${r.location}\n`;
          reportContent += `  Status: ${r.status}\n\n`;
        });
        break;

      case 'teacher':
        reportContent = 'TEACHER REPORT\n' +
          '==============\n' +
          `Generated: ${new Date().toLocaleString()}\n\n`;
        
        const teachers = users.filter((u: any) => u.role === 'Teacher');
        reportContent += `Total Teachers: ${teachers.length}\n\n`;
        teachers.forEach((t: any) => {
          reportContent += `${t.name}\n`;
          reportContent += `  Email: ${t.email}\n`;
          reportContent += `  Status: ${t.status}\n\n`;
        });
        break;

      case 'financial':
        reportContent = 'FINANCIAL REPORT\n' +
          '================\n' +
          `Generated: ${new Date().toLocaleString()}\n\n`;
        
        reportContent += 'This is a sample financial report.\n';
        reportContent += 'In a real system, this would include:\n';
        reportContent += '- Fee collection status\n';
        reportContent += '- Outstanding payments\n';
        reportContent += '- Salary disbursements\n';
        reportContent += '- Operational expenses\n';
        break;
    }

    // Download report as text file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated`);
  };

  // Analytics calculations
  const totalStudents = students.length;
  const totalClasses = Array.from(new Set(students.map((s: any) => s.class))).length;
  const averageAttendance = attendance.length > 0
    ? (attendance.filter((a: any) => a.status === 'Present').length / attendance.length * 100).toFixed(1)
    : 0;
  const averageGrade = grades.length > 0
    ? (grades.reduce((sum: number, g: any) => sum + (g.marks / g.maxMarks * 100), 0) / grades.length).toFixed(1)
    : 0;

  // Class-wise statistics
  const classStats = Array.from(new Set(students.map((s: any) => s.branch))).map((branch: any) => {
    const branchStudents = students.filter((s: any) => s.branch === branch);
    const branchAttendance = attendance.filter((a: any) => a.branch === branch);
    const branchGrades = grades.filter((g: any) => branchStudents.some((s: any) => s.id === g.studentId));
    
    const attendanceRate = branchAttendance.length > 0
      ? (branchAttendance.filter((a: any) => a.status === 'Present').length / branchAttendance.length * 100).toFixed(1)
      : '0';
    
    const avgGrade = branchGrades.length > 0
      ? (branchGrades.reduce((sum: number, g: any) => sum + (g.marks / g.maxMarks * 100), 0) / branchGrades.length).toFixed(1)
      : '0';

    return {
      class: branch,
      students: branchStudents.length,
      attendance: attendanceRate,
      avgGrade: avgGrade
    };
  });

  // Subject-wise performance
  const subjectStats = Array.from(new Set(grades.map((g: any) => g.subject))).map((subject: any) => {
    const subjectGrades = grades.filter((g: any) => g.subject === subject);
    const avgMarks = (subjectGrades.reduce((sum: number, g: any) => sum + (g.marks / g.maxMarks * 100), 0) / subjectGrades.length).toFixed(1);
    
    return {
      subject,
      assignments: subjectGrades.length,
      avgMarks
    };
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Administrator Dashboard</h1>
          <p className="text-gray-500">Oversee institutional operations and generate reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Students</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Branches</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{classStats.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg. Attendance</CardTitle>
            <BarChart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{averageAttendance}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg. Performance</CardTitle>
            <BarChart className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{averageGrade}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
          <TabsTrigger value="resources">Resource Management</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Branch-wise Performance</CardTitle>
                <CardDescription>Academic performance by branch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Branch</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Avg Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classStats.map((stat) => (
                        <TableRow key={stat.class}>
                          <TableCell>
                            <Badge variant="outline">{stat.class.split(' ').map((w: string) => w[0]).join('')}</Badge>
                          </TableCell>
                          <TableCell>{stat.students}</TableCell>
                          <TableCell>{stat.attendance}%</TableCell>
                          <TableCell>
                            <Badge>{stat.avgGrade}%</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
                <CardDescription>Performance across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Assignments</TableHead>
                        <TableHead>Avg. Marks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjectStats.map((stat) => (
                        <TableRow key={stat.subject}>
                          <TableCell>{stat.subject}</TableCell>
                          <TableCell>{stat.assignments}</TableCell>
                          <TableCell>
                            <Badge>{stat.avgMarks}%</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription>Export institutional reports (Downloads as .txt file)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => generateReport('attendance')}
                >
                  <FileText className="h-6 w-6" />
                  <span>Attendance Report</span>
                </Button>
                <Button 
                  className="h-20 flex flex-col gap-2" 
                  variant="outline"
                  onClick={() => generateReport('academic')}
                >
                  <FileText className="h-6 w-6" />
                  <span>Academic Report</span>
                </Button>
                <Button 
                  className="h-20 flex flex-col gap-2" 
                  variant="outline"
                  onClick={() => generateReport('financial')}
                >
                  <FileText className="h-6 w-6" />
                  <span>Financial Report</span>
                </Button>
                <Button 
                  className="h-20 flex flex-col gap-2" 
                  variant="outline"
                  onClick={() => generateReport('student')}
                >
                  <FileText className="h-6 w-6" />
                  <span>Student Report</span>
                </Button>
                <Button 
                  className="h-20 flex flex-col gap-2" 
                  variant="outline"
                  onClick={() => generateReport('teacher')}
                >
                  <FileText className="h-6 w-6" />
                  <span>Teacher Report</span>
                </Button>
                <Button 
                  className="h-20 flex flex-col gap-2" 
                  variant="outline"
                  onClick={() => generateReport('resource')}
                >
                  <FileText className="h-6 w-6" />
                  <span>Resource Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>Key metrics for February 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl">{totalStudents}</div>
                  <div className="text-sm text-gray-500">Enrolled Students</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl">{grades.length}</div>
                  <div className="text-sm text-gray-500">Assignments Graded</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl">{averageAttendance}%</div>
                  <div className="text-sm text-gray-500">Attendance Rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl">{resources.filter(r => r.status === 'Available').length}</div>
                  <div className="text-sm text-gray-500">Resources Available</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Resource</CardTitle>
              <CardDescription>Add equipment and facilities to inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label>Resource Name</Label>
                  <Input
                    placeholder="e.g., Projector"
                    value={newResource.name}
                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input
                    placeholder="e.g., Equipment"
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={newResource.quantity}
                    onChange={(e) => setNewResource({ ...newResource, quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="Room 101"
                    value={newResource.location}
                    onChange={(e) => setNewResource({ ...newResource, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={newResource.status} onValueChange={(value: 'Available' | 'In Use' | 'Maintenance') => setNewResource({ ...newResource, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="In Use">In Use</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={addResource} className="w-full">Add Resource</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resource Inventory</CardTitle>
              <CardDescription>Manage institutional resources and facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell>{resource.id}</TableCell>
                        <TableCell>{resource.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{resource.type}</Badge>
                        </TableCell>
                        <TableCell>{resource.quantity}</TableCell>
                        <TableCell>{resource.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              resource.status === 'Available' ? 'default' :
                              resource.status === 'In Use' ? 'secondary' : 'destructive'
                            }
                          >
                            {resource.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={resource.status}
                            onValueChange={(value: 'Available' | 'In Use' | 'Maintenance') => updateResourceStatus(resource.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Available">Available</SelectItem>
                              <SelectItem value="In Use">In Use</SelectItem>
                              <SelectItem value="Maintenance">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Resources</CardTitle>
                <Package className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{resources.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Available</CardTitle>
                <Package className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{resources.filter(r => r.status === 'Available').length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">In Maintenance</CardTitle>
                <Package className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{resources.filter(r => r.status === 'Maintenance').length}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Announcement</CardTitle>
              <CardDescription>Broadcast important messages to teachers and students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    placeholder="Announcement subject"
                    value={newAnnouncement.subject}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Type your announcement here"
                    value={newAnnouncement.message}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Send To</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="teachers"
                        checked={newAnnouncement.targetRoles.includes('Teacher')}
                        onCheckedChange={() => toggleRole('Teacher')}
                      />
                      <label htmlFor="teachers" className="text-sm cursor-pointer">
                        Teachers
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="students"
                        checked={newAnnouncement.targetRoles.includes('Student')}
                        onCheckedChange={() => toggleRole('Student')}
                      />
                      <label htmlFor="students" className="text-sm cursor-pointer">
                        Students
                      </label>
                    </div>
                  </div>
                </div>
                <Button onClick={sendAnnouncement} className="gap-2">
                  <Megaphone className="w-4 h-4" />
                  Send Announcement
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>Previously sent announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No announcements sent yet</p>
                ) : (
                  announcements.map((announcement) => (
                    <Card key={announcement.id} className="border-l-4 border-yellow-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{announcement.subject}</CardTitle>
                            <CardDescription>
                              Sent to: {announcement.targetRoles.join(', ')} - {announcement.date}
                            </CardDescription>
                          </div>
                          <Badge>
                            {announcement.targetRoles.length} {announcement.targetRoles.length === 1 ? 'Role' : 'Roles'}
                          </Badge>
                        </div>
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

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Institutional Operations</CardTitle>
              <CardDescription>Manage day-to-day institutional operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Administrative Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Process Admissions
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Manage Fee Collection
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Staff Payroll
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Facility Maintenance
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Communication</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Parent Notifications
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Staff Circulars
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Event Management
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Newsletter
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button variant="outline">Approve Leaves</Button>
                      <Button variant="outline">Update Calendar</Button>
                      <Button variant="outline">Manage Events</Button>
                      <Button variant="outline">Review Requests</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">System Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Database Status</span>
                        <Badge>Healthy</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Backup Status</span>
                        <Badge>Up to date</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>System Load</span>
                        <Badge variant="secondary">Normal</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Last Backup</span>
                        <span className="text-sm text-gray-500">2 hours ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}