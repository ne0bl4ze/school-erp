import { useAuth } from '../context/AuthContext';
import StudentDashboard   from './StudentDashboard';
import PrincipalDashboard from './PrincipalDashboard';
import TeacherDashboard   from './TeacherDashboard';
import ParentDashboard    from './ParentDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  if (user?.role === 'principal' || user?.role === 'admin') return <PrincipalDashboard />;
  if (user?.role === 'teacher')  return <TeacherDashboard />;
  if (user?.role === 'parent')   return <ParentDashboard />;
  return <StudentDashboard />;
}
