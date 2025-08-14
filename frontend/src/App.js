// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/HomePage/Home";
// import Events from "./pages/EventList/UpcomingEventList";
// import EventDetail from "./pages/EventDetails/EventDetails";
// import AddEvent from "./pages/AddEvent/AddEvent";
// import EventRegisteration from "./pages/Registeration/Register";
// import Dashboard from "./pages/Dashboard/Dashboard";
// import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
// import Login from "./pages/Login/Login";
// import Signup from "./pages/Signup/Signup";
// import Contact from "./pages/Contact/Contact";
// import LoginAsAdmin from "./pages/LoginAsAdmin/LoginAsAdmin";
// import LoginAsStu from "./pages/LoginAsStu/LoginAsStu";
// import SignupAsAdmin from "./pages/SignupAsAdmin/SignupAsAdmin";
// import SignupAsStu from "./pages/SignupAsStu/SignupAsStu";
// // import Register from "./pages/Registeration/Register"; // Import Register component
// import Total from "./pages/TotStu/TotStu";
// import Attended from "./pages/AttendedStu/AttendedStu";
// import MarkAttendance from "./pages/MarkAttendance/MarkAttendance";
// import Result from "./pages/Result/Result";
// import EventResults from "./pages/EventResult/EventResult";
// import Gallery from './pages/Gallery/Gallery';
// import FeedbackPage from "./pages/Feedback/Feedback";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/events" element={<Events />} />
//         <Route path="/event/:id" element={<EventDetail />} />
//         <Route path="/add-event" element={<AddEvent />} />
//         <Route path="/EventRegisteration/:id" element={<EventRegisteration />} />
//         <Route path="/student-dashboard" element={<Dashboard />} />
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/login-admin" element={<LoginAsAdmin />} />
//         <Route path="/login-student" element={<LoginAsStu />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/signup/admin" element={<SignupAsAdmin />} />
//         <Route path="/signup/student" element={<SignupAsStu />} />
//         <Route path="/contact" element={<Contact />} />
//         {/* <Route path="/register/:id" element={<Register />} /> Add Register Route */}
//         {/* <Route path="/total-students" element={<Total />} /> */}
//         <Route path="/total-students/:eventId" element={<Total />} />
//         <Route path="/attended-students" element={<Attended />} />
//         <Route path="/mark-attendance" element={<MarkAttendance />} />
//         <Route path="/attended-students/:eventId" element={<Attended />} />
//         <Route path="/post-result/:eventId" element={<Result />} />
//         <Route path="/event-results/:eventId" element={<EventResults />} />
//         <Route path="/gallery" element={<Gallery />} />
//         <Route path="/feedback/:eventId" element={<FeedbackPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage/Home";
import Events from "./pages/EventList/UpcomingEventList";
import EventDetail from "./pages/EventDetails/EventDetails";
import AddEvent from "./pages/AddEvent/AddEvent";
import EventRegisteration from "./pages/Registeration/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Contact from "./pages/Contact/Contact";
import LoginAsAdmin from "./pages/LoginAsAdmin/LoginAsAdmin";
import LoginAsStu from "./pages/LoginAsStu/LoginAsStu";
import SignupAsAdmin from "./pages/SignupAsAdmin/SignupAsAdmin";
import SignupAsStu from "./pages/SignupAsStu/SignupAsStu";
import Total from "./pages/TotStu/TotStu";
import Attended from "./pages/AttendedStu/AttendedStu";
import MarkAttendance from "./pages/MarkAttendance/MarkAttendance";
import Result from "./pages/Result/Result";
import EventResults from "./pages/EventResult/EventResult";
import Gallery from './pages/Gallery/Gallery';
import FeedbackPage from "./pages/Feedback/Feedback";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetail />} />
        
        {/* Public auth routes (only accessible when not logged in) */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/login-admin" element={<AuthRoute><LoginAsAdmin /></AuthRoute>} />
        <Route path="/login-student" element={<AuthRoute><LoginAsStu /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
        <Route path="/signup/admin" element={<AuthRoute><SignupAsAdmin /></AuthRoute>} />
        <Route path="/signup/student" element={<AuthRoute><SignupAsStu /></AuthRoute>} />
        
        {/* Student protected routes */}
        <Route path="/student-dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/EventRegisteration/:id" element={
          <ProtectedRoute allowedRoles={['student']}>
            <EventRegisteration />
          </ProtectedRoute>
        } />
        <Route path="/feedback/:eventId" element={
          <ProtectedRoute allowedRoles={['student']}>
            <FeedbackPage />
          </ProtectedRoute>
        } />
        
        {/* Admin protected routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/add-event" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AddEvent />
          </ProtectedRoute>
        } />
        <Route path="/total-students/:eventId" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Total />
          </ProtectedRoute>
        } />
        <Route path="/attended-students" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Attended />
          </ProtectedRoute>
        } />
        <Route path="/mark-attendance" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MarkAttendance />
          </ProtectedRoute>
        } />
        <Route path="/attended-students/:eventId" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Attended />
          </ProtectedRoute>
        } />
        <Route path="/post-result/:eventId" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Result />
          </ProtectedRoute>
        } />
        <Route path="/event-results/:eventId" element={<EventResults />} />
        
        {/* Public routes */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;