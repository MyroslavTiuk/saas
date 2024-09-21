import {BrowserRouter, Routes, Route} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import "./styles/app.scss";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import ReportsDailyAttendance from "./pages/ReportsDailyAttendance";
import ProtectedRoutes from "./common/ProtectedRoutes";
import UserProfile from "./pages/UserProfile";
import UserView from "./pages/UserView";
import UserAdd from "./pages/UserAdd";
import Employees from "./pages/Employees";
import EmployeeView from "./pages/EmployeeView";
import EmployeeAdd from "./pages/EmployeeAdd";
import AdminLocations from "./pages/AdminLocations";
import AdminLocationView from "./pages/AdminLocationView";
import Devices from "./pages/Devices";
import DeviceAdd from "./pages/DeviceAdd";
import DeviceView from "./pages/DeviceView";
import AdminLocationUsers from "./pages/AdminLocationUsers";
import React from "react";
import UserAddAdmin from "./pages/UserAddAdmin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import QRCodes from "./pages/QRCodes";
import AdminLocationAdd from "./pages/AdminLocationAdd";
import AdminLocationUserView from "./pages/AdminLocationUserView";
import ReportsFortnightlyAttendance from "./pages/ReportsFortnightlyAttendance";
import ReportsWeeklyAttendance from "./pages/ReportsWeeklyAttendance";
import ReportsMonthlyAttendance from "./pages/ReportsMonthlyAttendance";
import ArchiveEmployees from "./pages/ArchiveEmployees";
import ArchiveEmployeeView from "./pages/ArchiveEmployeeView";
import {NON_TEACHER, TEACHER} from "./constants";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import SuperReadReports from "./pages/chart_report/SuperReadReports";
import SuperReadChartDaily from "./pages/chart_report/SuperReadChartDaily";
import SuperReadChartWeekly from "./pages/chart_report/SuperReadChartWeekly";
import SuperReadChartMonthly from "./pages/chart_report/SuperReadChartMonthly";
import SuperReadChartFortnightly from "./pages/chart_report/SuperReadChartFortnightly";
import NonTeacherReports from "./pages/chart_report/NonTeacherReports";
import TeacherReports from "./pages/chart_report/TeacherReports";
import TeacherChartDaily from "./pages/chart_report/TeacherChartDaily";
import TeacherChartWeekly from "./pages/chart_report/TeacherChartWeekly";
import TeacherChartMonthly from "./pages/chart_report/TeacherChartMonthly";
import TeacherChartFortnightly from "./pages/chart_report/TeacherChartFortnightly";
import NonTeacherChartDaily from "./pages/chart_report/NonTeacherChartDaily";
import NonTeacherChartWeekly from "./pages/chart_report/NonTeacherChartWeekly";
import NonTeacherChartMonthly from "./pages/chart_report/NonTeacherChartMonthly";
import NonTeacherChartFortnightly from "./pages/chart_report/NonTeacherChartFortnightly";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="app">
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          closeButton={false}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login/>}/>

            <Route path="/forgotpassword" element={<ForgotPassword/>}/>
            <Route
              path="/resetpassword/:email/:token"
              element={<ResetPassword/>}
            />

            <Route element={<ProtectedRoutes/>}>
              <Route path="/" element={<Dashboard/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>

              <Route path="/users">
                <Route index element={<Users/>}/>
                <Route path=":user_id" element={<UserView/>}/>
                <Route path="add" element={<UserAdd/>}/>
              </Route>

              <Route
                path="/:user_type/:admin_location_id/users/add"
                element={<UserAddAdmin/>}
              />
              <Route
                path="/:user_type/:admin_location_id/users/:user_id"
                element={<AdminLocationUserView/>}
              />

              <Route path="/non-teachers">
                <Route index element={<AdminLocations type={"Non-Teacher"}/>}/>
                <Route
                  path=":admin_location_id"
                  element={<Employees type={"Non-Teacher"}/>}
                />
                <Route
                  path="add"
                  element={<AdminLocationAdd type={NON_TEACHER}/>}
                />
                <Route
                  path=":admin_location_id/:employee_no"
                  element={<EmployeeView type={"Non-Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/add"
                  element={<EmployeeAdd type={"Non-Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/update"
                  element={<AdminLocationView type={"Non-Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/devices"
                  element={<Devices type={"Non-Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/devices/add"
                  element={<DeviceAdd type={"Non-Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/devices/view/:id"
                  element={<DeviceView type={"Non-Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/users"
                  element={<AdminLocationUsers type={"Non-Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/qrcodes"
                  element={<QRCodes type={"Non-Teacher"}/>}
                />
              </Route>

              <Route path="/teachers">
                <Route index element={<AdminLocations type={"Teacher"}/>}/>
                <Route
                  path="add"
                  element={<AdminLocationAdd type={TEACHER}/>}
                />
                <Route
                  path=":admin_location_id"
                  element={<Employees type={"Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/:employee_no"
                  element={<EmployeeView type={"Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/add"
                  element={<EmployeeAdd type={"Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/update"
                  element={<AdminLocationView type={"Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/devices"
                  element={<Devices type={"Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/devices/add"
                  element={<DeviceAdd type={"Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/devices/view/:id"
                  element={<DeviceView type={"Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/users"
                  element={<AdminLocationUsers type={"Teacher"}/>}
                />
                <Route
                  path=":admin_location_id/qrcodes"
                  element={<QRCodes type={"Teacher"}/>}
                />
              </Route>
              <Route path="/archive">
                <Route index element={<ArchiveEmployees/>}/>
                <Route
                  path="view/:employee_no"
                  element={<ArchiveEmployeeView/>}
                />
              </Route>
              <Route path="/super_read_report">
                <Route index element={<SuperReadReports/>}/>
                <Route
                  path="daily"
                  element={<SuperReadChartDaily/>}
                />
                <Route
                  path="weekly"
                  element={<SuperReadChartWeekly/>}
                />
                <Route
                  path="monthly"
                  element={<SuperReadChartMonthly/>}
                />
                <Route
                  path="fortnightly"
                  element={<SuperReadChartFortnightly/>}
                />
              </Route>
              <Route path="/non_teacher_report">
                <Route index element={<NonTeacherReports/>}/>
                <Route
                  path="daily"
                  element={<NonTeacherChartDaily/>}
                />
                <Route
                  path="weekly"
                  element={<NonTeacherChartWeekly/>}
                />
                <Route
                  path="monthly"
                  element={<NonTeacherChartMonthly/>}
                />
                <Route
                  path="fortnightly"
                  element={<NonTeacherChartFortnightly/>}
                />
              </Route>
              <Route path="/teacher_report">
                <Route index element={<TeacherReports/>}/>
                <Route
                  path="daily"
                  element={<TeacherChartDaily/>}
                />
                <Route
                  path="weekly"
                  element={<TeacherChartWeekly/>}
                />
                <Route
                  path="monthly"
                  element={<TeacherChartMonthly/>}
                />
                <Route
                  path="fortnightly"
                  element={<TeacherChartFortnightly/>}
                />
              </Route>
              <Route path="/reports">
                <Route index element={<Reports/>}/>
                <Route
                  path="location-level/:usertype/:admin_location_id"
                  element={<Reports/>}
                />
                <Route
                  path="daily/:usertype?/:admin_location_id?"
                  element={<ReportsDailyAttendance/>}
                />
                <Route
                  path="weekly/:usertype?/:admin_location_id?"
                  element={<ReportsWeeklyAttendance/>}
                />
                <Route
                  path="fortnightly/:usertype?/:admin_location_id?"
                  element={<ReportsFortnightlyAttendance/>}
                />
                <Route
                  path="monthly/:usertype?/:admin_location_id?"
                  element={<ReportsMonthlyAttendance/>}
                />
              </Route>
              <Route path="/profile" element={<UserProfile/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </LocalizationProvider>
  );
}

export default App;
