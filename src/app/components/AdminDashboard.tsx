import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Settings, Users, Shield, Activity } from 'lucide-react';
import { mockUsers, mockSettings, mockStudents, User, SystemSetting, Student, engineeringBranches } from '../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { getStoredData, setStoredData } from '../utils/storage';

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    username: '', 
    password: '', 
    role: '', 
    degree: '', 
    branch: '', 
    status: 'Active' as const 
  });
  const [editingSetting, setEditingSetting] = useState<string | null>(null);
  const [settingValue, setSettingValue] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');

  useEffect(() => {
    setUsers(getStoredData('users', mockUsers));
    setStudents(getStoredData('students', mockStudents));
    setSettings(getStoredData('settings', mockSettings));
  }, []);

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.username || !newUser.password || !newUser.role) {
      toast.error('Please fill all required fields');
      return;
    }

    // Check if username already exists
    if (users.some(u => u.username === newUser.username)) {
      toast.error('Username already exists');
      return;
    }

    // Check if student role needs degree and branch
    if (newUser.role === 'Student' && (!newUser.degree || !newUser.branch)) {
      toast.error('Please select degree and branch for student');
      return;
    }

    const userId = `U${String(users.length + 1).padStart(3, '0')}`;
    const user: User = {
      id: userId,
      ...newUser
    };
    
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    setStoredData('users', updatedUsers);

    // If student, also add to students list
    if (newUser.role === 'Student' && newUser.branch) {
      const studentId = `S${String(students.length + 1).padStart(3, '0')}`;
      const year = Math.ceil(Math.random() * 4);
      const subjects = engineeringBranches[newUser.branch as keyof typeof engineeringBranches] || [];
      
      const student: Student = {
        id: studentId,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
        class: `Year ${year}`,
        degree: newUser.degree,
        branch: newUser.branch,
        rollNumber: `${newUser.branch.split(' ').map(w => w[0]).join('')}${year}${String(students.length + 1).padStart(2, '0')}`,
        dateOfBirth: '2000-01-01',
        guardianName: `Guardian of ${newUser.name}`,
        guardianContact: '+1234567890',
        address: 'Address',
        subjects: subjects
      };
      
      const updatedStudents = [...students, student];
      setStudents(updatedStudents);
      setStoredData('students', updatedStudents);
    }

    setNewUser({ name: '', email: '', username: '', password: '', role: '', degree: '', branch: '', status: 'Active' });
    toast.success('User created successfully');
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' as const } 
        : user
    );
    setUsers(updatedUsers);
    setStoredData('users', updatedUsers);
    toast.success('User status updated');
  };

  const changeUserRole = (userId: string) => {
    if (!editRole) {
      toast.error('Please select a role');
      return;
    }

    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, role: editRole } : user
    );
    setUsers(updatedUsers);
    setStoredData('users', updatedUsers);
    setEditingUser(null);
    setEditRole('');
    toast.success('User role updated');
  };

  const updateSetting = (settingId: string) => {
    const updatedSettings = settings.map(setting =>
      setting.id === settingId ? { ...setting, value: settingValue } : setting
    );
    setSettings(updatedSettings);
    setStoredData('settings', updatedSettings);
    setEditingSetting(null);
    setSettingValue('');
    toast.success('Setting updated');
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    setStoredData('users', updatedUsers);
    toast.success('User deleted');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Admin Dashboard</h1>
          <p className="text-gray-500">Configure system settings and manage user roles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{users.filter(u => u.status === 'Active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Security Status</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">Secure</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="roles">Role Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
              <CardDescription>Add a new user account with credentials and role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="John Doe"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    placeholder="john.doe@college.edu"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Username *</Label>
                  <Input
                    placeholder="johndoe"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    placeholder="password123"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={newUser.status} onValueChange={(value: 'Active' | 'Inactive') => setNewUser({ ...newUser, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {newUser.role === 'Student' && (
                  <>
                    <div className="space-y-2">
                      <Label>Degree *</Label>
                      <Select value={newUser.degree} onValueChange={(value) => setNewUser({ ...newUser, degree: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B.Tech">B.Tech</SelectItem>
                          <SelectItem value="M.Tech">M.Tech</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Branch *</Label>
                      <Select value={newUser.branch} onValueChange={(value) => setNewUser({ ...newUser, branch: value })}>
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
                  </>
                )}
              </div>
              <div className="mt-4">
                <Button onClick={addUser}>Create User</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User List</CardTitle>
              <CardDescription>Manage all system users and their access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell className="font-mono text-sm">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {editingUser === user.id ? (
                            <Select value={editRole} onValueChange={setEditRole}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Teacher">Teacher</SelectItem>
                                <SelectItem value="Student">Student</SelectItem>
                                <SelectItem value="Administrator">Administrator</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant="outline">{user.role}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.branch ? <Badge variant="secondary">{user.branch.split(' ').map(w => w[0]).join('')}</Badge> : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {editingUser === user.id ? (
                              <>
                                <Button size="sm" onClick={() => changeUserRole(user.id)}>
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => {
                                  setEditingUser(null);
                                  setEditRole('');
                                }}>
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingUser(user.id);
                                    setEditRole(user.role);
                                  }}
                                >
                                  Change Role
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleUserStatus(user.id)}
                                >
                                  {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteUser(user.id)}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Configure ERP system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Setting</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell>
                        <Badge>{setting.category}</Badge>
                      </TableCell>
                      <TableCell>{setting.setting}</TableCell>
                      <TableCell>
                        {editingSetting === setting.id ? (
                          <Input
                            value={settingValue}
                            onChange={(e) => setSettingValue(e.target.value)}
                            className="max-w-xs"
                          />
                        ) : (
                          setting.value
                        )}
                      </TableCell>
                      <TableCell>
                        {editingSetting === setting.id ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => updateSetting(setting.id)}>
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingSetting(null);
                                setSettingValue('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingSetting(setting.id);
                              setSettingValue(setting.value);
                            }}
                          >
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Manage permissions for each user role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Admin', 'Teacher', 'Student', 'Administrator'].map((role) => (
                  <Card key={role}>
                    <CardHeader>
                      <CardTitle className="text-lg">{role}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {role === 'Admin' && (
                          <>
                            <Badge>Manage Users</Badge>
                            <Badge>System Settings</Badge>
                            <Badge>View All Data</Badge>
                            <Badge>Manage Roles</Badge>
                            <Badge>System Operations</Badge>
                            <Badge>Create Users</Badge>
                          </>
                        )}
                        {role === 'Teacher' && (
                          <>
                            <Badge>Manage Students</Badge>
                            <Badge>Grade Assignments</Badge>
                            <Badge>Mark Attendance</Badge>
                            <Badge>Schedule Classes</Badge>
                            <Badge>Send Messages</Badge>
                            <Badge>View Reports</Badge>
                          </>
                        )}
                        {role === 'Student' && (
                          <>
                            <Badge>View Grades</Badge>
                            <Badge>View Attendance</Badge>
                            <Badge>View Schedule</Badge>
                            <Badge>Contact Teachers</Badge>
                            <Badge>View Announcements</Badge>
                          </>
                        )}
                        {role === 'Administrator' && (
                          <>
                            <Badge>Manage Resources</Badge>
                            <Badge>Generate Reports</Badge>
                            <Badge>View Analytics</Badge>
                            <Badge>Institutional Operations</Badge>
                            <Badge>Send Announcements</Badge>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}