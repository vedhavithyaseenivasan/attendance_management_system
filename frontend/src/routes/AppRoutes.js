import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ChangePassword from "../pages/ChangePassword";

//Attendance pages
import MyAttendance from "../pages/MyAttendance"; 
import MarkAttendance from "../pages/MarkAttendance";
import TeamAttendance  from "../pages/TeamAttendance";
import UpdateAttendance from "../pages/UpdateAttendance";

//Holiday pages
import Holiday from "../pages/Holidays";
import AddHoliday from "../pages/AddHoliday";

//User page
import Users from "../pages/Users";
import AddUser from "../pages/AddUser";

//Leave pages
import ApplyLeave from "../pages/ApplyLeave";
import MyLeaves from "../pages/MyLeaves";
import ApproveLeaves from "../pages/ApproveLeaves";

//Layout & route protection
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/changepassword" element={<ChangePassword />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/myattendance"
          element={
            <ProtectedRoute roles={["TEAM_MEMBER", "LEAD", "MANAGER", "HR"]}>
              <MyAttendance />
            </ProtectedRoute>
          }
        />
         <Route
  path="/team-attendance"
  element={
    <ProtectedRoute roles={["LEAD", "MANAGER","HR"]}>
      <TeamAttendance />
    </ProtectedRoute>
  }
/>
<Route
  path="/attendance"
  element={
    <ProtectedRoute roles={["HR"]}>
      <MarkAttendance />
    </ProtectedRoute>
  }
/>
<Route
  path="/update-attendance"
  element={
    <ProtectedRoute roles={["HR"]}>
      <UpdateAttendance />
    </ProtectedRoute>
  }
/>
        <Route
          path="/leave/apply"
          element={
            <ProtectedRoute roles={["TEAM_MEMBER", "LEAD"]}>
              <ApplyLeave />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave/my-leaves"
          element={
            <ProtectedRoute roles={["TEAM_MEMBER", "LEAD"]}>
              <MyLeaves />
            </ProtectedRoute>
          }
        />
        
<Route
  path="/leave/approve"
  element={
    <ProtectedRoute roles={["LEAD", "MANAGER"]}>
      <ApproveLeaves />
    </ProtectedRoute>
  }
/>

        <Route
          path="/holiday"
          element={
            <ProtectedRoute roles={["TEAM_MEMBER", "LEAD", "MANAGER", "HR"]}>
              <Holiday />
            </ProtectedRoute>
          }
        />
        <Route
  path="/holiday/add"
  element={
    <ProtectedRoute roles={["HR"]}>
      <AddHoliday />
    </ProtectedRoute>
  }
/>


        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["HR"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
  path="/users/create"
  element={
    <ProtectedRoute roles={["HR"]}>
      <AddUser />
    </ProtectedRoute>
  }
/>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;