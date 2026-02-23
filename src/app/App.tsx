import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { AdministratorDashboard } from './components/AdministratorDashboard';
import { Button } from './components/ui/button';
import { LogOut, GraduationCap } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { initializeStorage } from './utils/storage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    // Initialize storage on first load
    initializeStorage();
  }, []);

  const handleLogin = (role: string, id: string, uname: string) => {
    setUserRole(role);
    setUserId(id);
    setUsername(uname);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setUserId('');
    setUsername('');
  };

  if (!isLoggedIn) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-400 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl">Educational ERP System</h1>
              <p className="text-sm text-gray-500">
                {userRole === 'admin' && 'Admin Portal'}
                {userRole === 'teacher' && 'Teacher Portal'}
                {userRole === 'student' && 'Student Portal'}
                {userRole === 'administrator' && 'Administrator Portal'}
              </p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main>
        {userRole === 'admin' && <AdminDashboard />}
        {userRole === 'teacher' && <TeacherDashboard username={username} />}
        {userRole === 'student' && <StudentDashboard userId={userId} username={username} />}
        {userRole === 'administrator' && <AdministratorDashboard username={username} userId={userId} />}
      </main>
      
      <Toaster />
    </div>
  );
}
