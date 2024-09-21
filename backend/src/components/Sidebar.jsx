import {ExclamationCircleOutlined} from "@ant-design/icons";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import {Link, useNavigate} from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {Modal} from "antd";
import {useMutation, useQueryClient} from "react-query";
import styles from "../styles/sidebar.module.scss";
import {useMe} from "../hooks/useMe";
import API from "../APIs/API";

const {confirm} = Modal;
const Sidebar = () => {
  const queryClient = useQueryClient();
  const {user: loggedUser, permissions} = useMe();
  const logout = useMutation(() => new API().logout(), {
    onSuccess: () => {
      localStorage.clear();
      navigate("/login");
    },
  });
  let pathname = window.location.pathname;
  let activeLink = pathname.split("/")[1];
  const navigate = useNavigate();

  let profileDisplayName = loggedUser ? [loggedUser.given_name, loggedUser.surname]
    .filter(Boolean)
    .join(" ") : "";

  const handleLogout = (e) => {
    e.preventDefault();
    confirm({
      title: "Logout",
      icon: <ExclamationCircleOutlined/>,
      content: "Are you sure you want to logout?",
      onOk: () => {
        queryClient.invalidateQueries("/users/me");
        logout.mutate();
      },
      onCancel() {
        Modal.destroyAll();
      },
    });
  };
  return (
    <div className="sidebar2">
      <div className="top">
        <Link to="/" className={`link`}>
          <span className="logo">PNG Time Access</span>
        </Link>
      </div>
      <hr/>

      <div className="center">
        <ul>
          <div className="profile-link">
            <p className="title">PROFILE</p>
            <Link
              to="/profile"
              className={`link ${activeLink === "profile" ? "active" : ""}`}
            >
              <li className={styles.liProfileDisplayName}>
                <AccountCircleOutlinedIcon className="icon"/>
                <span className={styles.profileDisplayName}>
                  {profileDisplayName}
                </span>
              </li>
            </Link>
          </div>
          <div className="main-links">
            <div>
              <p className="title">MAIN</p>
              <Link
                to="/dashboard"
                className={`link ${
                  activeLink === "dashboard" || activeLink === ""
                    ? "active"
                    : ""
                }`}
              >
                <li>
                  <DashboardIcon className="icon"/>
                  <span>Dashboard</span>
                </li>
              </Link>
            </div>
            <p className="title">LISTS</p>
            <div>
              {permissions.super && (
                <Link
                  to="/users"
                  className={`link ${activeLink === "users" ? "active" : ""}`}
                >
                  <li>
                    <PersonOutlineIcon className="icon"/>
                    <span>Admin Users</span>
                  </li>
                </Link>
              )}
            </div>
            <div>
              {permissions.non_teacher && (
                <Link
                  to="/non-teachers"
                  className={`link ${
                    activeLink === "non-teachers" ? "active" : ""
                  }`}
                >
                  <li>
                    <PersonOutlineIcon className="icon"/>
                    <span>Non Teachers</span>
                  </li>
                </Link>
              )}
            </div>
            <div>
              {permissions.teacher && (
                <Link
                  to="/teachers"
                  className={`link ${
                    activeLink === "teachers" ? "active" : ""
                  }`}
                >
                  <li>
                    <PersonOutlineIcon className="icon"/>
                    <span>Teachers</span>
                  </li>
                </Link>
              )}
            </div>
            <div>
              {permissions.super && (
                <Link
                  to="/archive"
                  className={`link ${activeLink === "archive" ? "active" : ""}`}
                >
                  <li>
                    <PersonOutlineIcon className="icon"/>
                    <span>Archive Employees</span>
                  </li>
                </Link>
              )}
            </div>
            <div>
              <p className="title">REPORTS</p>
              {permissions.superRead && (<>
                  <Link
                    to="/super_read_report"
                    className={`link ${activeLink === "super_read_report" ? "active" : ""}`}
                  >
                    <li>
                      <PersonOutlineIcon className="icon"/>
                      <span>Master Reports</span>
                    </li>
                  </Link>
                </>
              )}
              {permissions.report_teacher && (
                <Link
                  to="/teacher_report"
                  className={`link ${activeLink === "teacher_report" ? "active" : ""}`}
                >
                  <li>
                    <PersonOutlineIcon className="icon"/>
                    <span>Teacher Reports</span>
                  </li>
                </Link>
              )}
              {permissions.report_non_teacher && (
                <Link
                  to="/non_teacher_report"
                  className={`link ${activeLink === "non_teacher_report" ? "active" : ""}`}
                >
                  <li>
                    <PersonOutlineIcon className="icon"/>
                    <span>Non-Teacher Reports</span>
                  </li>
                </Link>
              )}
              {permissions.normal_user && (
                <Link
                  to={`/reports/location-level/${loggedUser.admin_location.user_type.toLowerCase()}/${loggedUser.admin_location.id}`}
                  className={`link ${activeLink === "reports" ? "active" : ""}`}
                >
                  <li>
                    <PersonOutlineIcon className="icon"/>
                    <span>Reports</span>
                  </li>
                </Link>
              )}
            </div>
          </div>

          <hr></hr>
          <div className="logout-link">
            <li onClick={(e) => handleLogout(e)}>
              <ExitToAppIcon className="icon"/>
              <span>Logout</span>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
