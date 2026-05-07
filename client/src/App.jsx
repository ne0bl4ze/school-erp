import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout      from './components/Layout/Layout';
import Login       from './pages/Login';
import Dashboard   from './pages/Dashboard';
import Profile     from './pages/Profile';
import Attendance  from './pages/Attendance';
import Grades      from './pages/Grades';
import Fees        from './pages/Fees';
import TimeTable   from './pages/TimeTable';
import Syllabus    from './pages/Syllabus';
import Announcements from './pages/Announcements';
import LeaveDetails  from './pages/LeaveDetails';
import Library       from './pages/Library';
import Hostel        from './pages/Hostel';
import ContactMentor from './pages/ContactMentor';
import Blogs         from './pages/Blogs';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#DF740C', fontSize:14 }}>Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index             element={<Dashboard />} />
            <Route path="profile"    element={<Profile />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="grades"     element={<Grades />} />
            <Route path="fees"       element={<Fees />} />
            <Route path="timetable"  element={<TimeTable />} />
            <Route path="syllabus"   element={<Syllabus />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="leave"      element={<LeaveDetails />} />
            <Route path="library"    element={<Library />} />
            <Route path="hostel"     element={<Hostel />} />
            <Route path="mentor"     element={<ContactMentor />} />
            <Route path="blogs"      element={<Blogs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
