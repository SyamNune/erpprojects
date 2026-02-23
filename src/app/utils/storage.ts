import { mockUsers, mockStudents, mockAttendance, mockGrades, mockSchedules, mockMessages, mockAnnouncements, mockResources, mockSettings } from '../data/mockData';

// Initialize localStorage with mock data if not already set
export const initializeStorage = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem('initialized')) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
    localStorage.setItem('students', JSON.stringify(mockStudents));
    localStorage.setItem('attendance', JSON.stringify(mockAttendance));
    localStorage.setItem('grades', JSON.stringify(mockGrades));
    localStorage.setItem('schedules', JSON.stringify(mockSchedules));
    localStorage.setItem('messages', JSON.stringify(mockMessages));
    localStorage.setItem('announcements', JSON.stringify(mockAnnouncements));
    localStorage.setItem('resources', JSON.stringify(mockResources));
    localStorage.setItem('settings', JSON.stringify(mockSettings));
    localStorage.setItem('initialized', 'true');
  }
};

export const getStoredData = <T,>(key: string, defaultData: T): T => {
  if (typeof window === 'undefined') return defaultData;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultData;
  }
};

export const setStoredData = <T,>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};
