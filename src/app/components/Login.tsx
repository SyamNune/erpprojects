import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { GraduationCap } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import { getStoredData } from '../utils/storage';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (role: string, userId: string, username: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }

    const users = getStoredData('users', mockUsers);
    const user = users.find((u: any) => 
      u.username === username && 
      u.password === password && 
      u.status === 'Active'
    );
    
    if (user) {
      onLogin(user.role.toLowerCase(), user.id, user.username);
      toast.success(`Welcome, ${user.name}!`);
    } else {
      toast.error('Invalid username or password, or account is inactive');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-400 p-3 rounded-full">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle>Educational ERP System</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-sm text-gray-500 space-y-1">
            <div className="border-t pt-3">
              <p className="font-medium">Demo Credentials:</p>
              <p>Admin: admin / admin123</p>
              <p>Teacher: drsarahmiller / teacher123</p>
              <p>Student: johnsmith1 / student123</p>
              <p>Principal: principal / principal123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
