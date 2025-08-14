import EventList from "../pages/EventList/EventList";
import AddEvent from "../pages/AddEvent/AddEvent";
import Dashboard from "../pages/Dashboard/Dashboard";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import FilterEvents from "../pages/FilterEvents/FilterEvents";
import EventDetail from "../pages/EventDetails/EventDetails";
import EventRegistration from "../pages/Registeration/Register"; // Ensure correct spelling
import Login from "../pages/Login/Login";
import Contact from "../pages/Contact/Contact";
import Signup from "../pages/Signup/Signup";

export const routes = [
  { path: "/eventlist", element: <EventList /> },
  { path: "/find-events", element: <FilterEvents /> },
  { path: "/events/:id", element: <EventDetail /> },
  { path: "/register", element: <EventRegistration /> }, 
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/add-event", element: <AddEvent /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/contact", element: <Contact /> }
];
