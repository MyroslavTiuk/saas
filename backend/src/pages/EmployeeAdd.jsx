import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import API from "../APIs/API";
import Sidebar from "../components/Sidebar";
import "../styles/profile.scss";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {useMe} from "../hooks/useMe";
import {toast} from "react-toastify";
import {useMutation} from "react-query";

const EmployeeAdd = ({type}) => {
  const navigate = useNavigate();
  const {admin_location_id} = useParams();
  const pageUserType = type === "Non-Teacher" ? "non-teachers" : "teachers";
  const backUrl = `/${pageUserType}/${admin_location_id}`;

  const {user: loggedUser} = useMe();

  let initialEmployee = {
    employee_no: "",
    admin_location_id: admin_location_id,
    name_report: "",
    position_no: "",
    occup_pos_title: "",
    award: "",
    award_desc: "",
    classification: "",
    class_desc: "",
    step_no: "",
    occup_type: "",
    gender: "M",
    first_commence: "",
    account_no: "",
    account_no_desc: "",
    emp_status: "",
    paypoint: "",
    paypoint_desc: "",
    date_of_birth: "",
    occup_pos_cat: "",
  };

  const [employee, setEmployee] = useState(initialEmployee);
  const [adminLocation, setAdminLocation] = useState({
    id: 0,
    admin_location: "",
    admin_desc: "",
    user_type: "",
  });

  useEffect(() => {
    new API().getAdminLocationById(admin_location_id).then((data) => {
      setAdminLocation({...data["data"]});
    });
  }, [admin_location_id]);

  const handleChange = (e) => {
    setEmployee({...employee, [e.target.name]: e.target.value});
  };

  const createEmployee = useMutation((body) => new API().addEmployee(body), {
    onSuccess: (data) => {
      if (data) {
        toast.success("Employee created Successfully!");
        navigate(backUrl);
      } else {
        toast.error("Employee creation Failed!");
      }
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    createEmployee.mutate(employee);
  };

  return (
    <div className="wrapper">
      <div className="sidebar">
        <Sidebar/>
      </div>
      <div className="content">
        <div className="profile">
          <div className="profileContainer">
            <div className="profileSection">
              <Link
                to={`/${pageUserType}/${admin_location_id}`}
                className="backButtonSection"
              >
                <KeyboardBackspaceIcon className="backButton"/>
              </Link>
              <br/>
              <br/>

              <form>
                <div className="container">
                  <div className="row">
                    <div className="col col-sm">
                      <h1>Create New Employee</h1>
                    </div>
                    <div className="col col-sm">
                      <button
                        type="submit"
                        className="saveBtn btn btn-primary btn-block mb-3"
                        onClick={(e) => handleSubmit(e)}
                      >
                        Create
                      </button>
                    </div>
                  </div>
                  <hr/>

                  <div className="row">
                    <div className="col col-sm">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="user_type">
                          <b>User type</b>
                        </label>
                        <br/>
                        <input
                          className="form-select"
                          name="user_type"
                          id="user_type"
                          value={adminLocation?.user_type}
                          disabled
                          readOnly
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="employee_no">
                          <b>Employee no</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="employee_no"
                          id="employee_no"
                          value={employee?.employee_no}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="name_report">
                          <b>Name report</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="name_report"
                          id="name_report"
                          value={employee?.name_report}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="admin_location">
                          <b>Admin location</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          disabled
                          type="text"
                          name="admin_location"
                          id="admin_location"
                          value={adminLocation?.admin_location}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="admin_desc">
                          <b>Admin desc</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          disabled
                          type="text"
                          name="admin_desc"
                          id="admin_desc"
                          value={adminLocation?.admin_desc}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="position_no">
                          <b>Position no</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="position_no"
                          id="position_no"
                          value={employee?.position_no}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="occup_pos_title">
                          <b>Occup pos title</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="occup_pos_title"
                          id="occup_pos_title"
                          value={employee?.occup_pos_title}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="award">
                          <b>Award</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="award"
                          id="award"
                          value={employee?.award}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col col-sm">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="award_desc">
                          <b>Award desc</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="award_desc"
                          id="award_desc"
                          value={employee?.award_desc}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="classification">
                          <b>Classification</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="classification"
                          id="classification"
                          value={employee?.classification}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="class_desc">
                          <b>Class desc</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="class_desc"
                          id="class_desc"
                          value={employee?.class_desc}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="step_no">
                          <b>Step no</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="step_no"
                          id="step_no"
                          value={employee?.step_no}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="occup_type">
                          <b>Occup type</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="occup_type"
                          id="occup_type"
                          value={employee?.occup_type}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="gender">
                          <b>Gender</b>
                        </label>
                        <br/>
                        <select
                          className="form-select"
                          name="gender"
                          id="gender"
                          value={employee?.gender}
                          onChange={handleChange}
                        >
                          <option value={"M"}>Male</option>
                          <option value={"F"}>Female</option>
                        </select>
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="first_commence">
                          <b>First commence</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="first_commence"
                          id="first_commence"
                          value={employee?.first_commence}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="account_no">
                          <b>Account no</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="account_no"
                          id="account_no"
                          value={employee?.account_no}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col col-sm">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="account_no_desc">
                          <b>Account no desc</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="account_no_desc"
                          id="account_no_desc"
                          value={employee?.account_no_desc}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="emp_status">
                          <b>Emp status</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="emp_status"
                          id="emp_status"
                          value={employee?.emp_status}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="paypoint">
                          <b>Paypoint</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="paypoint"
                          id="paypoint"
                          value={employee?.paypoint}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="paypoint_desc">
                          <b>Paypoint desc</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="paypoint_desc"
                          id="paypoint_desc"
                          value={employee?.paypoint_desc}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="date_of_birth">
                          <b>Date of birth</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="date_of_birth"
                          id="date_of_birth"
                          value={employee?.date_of_birth}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="occup_pos_cat">
                          <b>Occup pos cat</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="occup_pos_cat"
                          id="occup_pos_cat"
                          value={employee?.occup_pos_cat}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="created_by">
                          <b>Created by</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="created_by"
                          id="created_by"
                          value={loggedUser?.email}
                          required
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAdd;
