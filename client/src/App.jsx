import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout        from './components/Layout/Layout';
import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Profile       from './pages/Profile';
import Attendance    from './pages/Attendance';
import Grades        from './pages/Grades';
import Fees          from './pages/Fees';
import TimeTable     from './pages/TimeTable';
import Syllabus      from './pages/Syllabus';
import Announcements from './pages/Announcements';
import LeaveDetails  from './pages/LeaveDetails';
import Library       from './pages/Library';
import Hostel        from './pages/Hostel';
import ContactMentor from './pages/ContactMentor';
import Blogs         from './pages/Blogs';
// Principal pages
import Admissions    from './pages/Admissions';
import AdmissionForm from './pages/AdmissionForm';
import AdmissionDetail from './pages/AdmissionDetail';
import AcademicYears from './pages/AcademicYears';
import Promotions    from './pages/Promotions';
import SchoolStudents from './pages/SchoolStudents';
// Teacher pages
import MyClasses     from './pages/MyClasses';
import Messages      from './pages/Messages';
// Parent pages
import ChildAttendance from './pages/ChildAttendance';
import ChildGrades   from './pages/ChildGrades';
import ChildFees     from './pages/ChildFees';
import ChildTimetable from './pages/ChildTimetable';
import ParentMessages from './pages/ParentMessages';
// Print pages (no layout/sidebar)
import PrintReportCard from './pages/print/ReportCard';
import PrintFeeReceipt from './pages/print/FeeReceipt';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#DF740C', fontSize:14 }}>
      Loading…
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/" replace />;
}

function RoleRoute({ roles, children }) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          {/* Printable standalone pages — no sidebar/header */}
          <Route path="/print/report-card/:year" element={<PrivateRoute><PrintReportCard /></PrivateRoute>} />
          <Route path="/print/fee-receipt/:term"  element={<PrivateRoute><PrintFeeReceipt /></PrivateRoute>} />

          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index              element={<Dashboard />} />
            <Route path="profile"    element={<Profile />} />
            <Route path="announcements" element={<Announcements />} />

            {/* Student routes */}
            <Route path="attendance" element={<Attendance />} />
            <Route path="grades"     element={<Grades />} />
            <Route path="fees"       element={<Fees />} />
            <Route path="timetable"  element={<TimeTable />} />
            <Route path="syllabus"   element={<Syllabus />} />
            <Route path="leave"      element={<LeaveDetails />} />
            <Route path="library"    element={<Library />} />
            <Route path="hostel"     element={<Hostel />} />
            <Route path="mentor"     element={<ContactMentor />} />
            <Route path="blogs"      element={<Blogs />} />

            {/* Principal routes */}
            <Route path="admissions"     element={<RoleRoute roles={['principal','admin']}><Admissions /></RoleRoute>} />
            <Route path="admissions/new" element={<RoleRoute roles={['principal','admin']}><AdmissionForm /></RoleRoute>} />
            <Route path="admissions/:id" element={<RoleRoute roles={['principal','admin']}><AdmissionDetail /></RoleRoute>} />
            <Route path="academic-years" element={<RoleRoute roles={['principal','admin']}><AcademicYears /></RoleRoute>} />
            <Route path="promotions"     element={<RoleRoute roles={['principal','admin']}><Promotions /></RoleRoute>} />
            <Route path="school-students" element={<RoleRoute roles={['principal','admin','teacher']}><SchoolStudents /></RoleRoute>} />

            {/* Teacher routes */}
            <Route path="my-classes" element={<RoleRoute roles={['teacher']}><MyClasses /></RoleRoute>} />
            <Route path="messages"   element={<RoleRoute roles={['teacher','principal','admin']}><Messages /></RoleRoute>} />

            {/* Parent routes */}
            <Route path="child-attendance" element={<RoleRoute roles={['parent']}><ChildAttendance /></RoleRoute>} />
            <Route path="child-grades"     element={<RoleRoute roles={['parent']}><ChildGrades /></RoleRoute>} />
            <Route path="child-fees"       element={<RoleRoute roles={['parent']}><ChildFees /></RoleRoute>} />
            <Route path="child-timetable"  element={<RoleRoute roles={['parent']}><ChildTimetable /></RoleRoute>} />
            <Route path="parent-messages"  element={<RoleRoute roles={['parent']}><ParentMessages /></RoleRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
