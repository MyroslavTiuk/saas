import React, {useEffect, useState} from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {Link, useNavigate, useParams} from "react-router-dom";
import Config from "../config";
import sample from "../profileImage/sample.png";
import Sidebar from "../components/Sidebar";
import {EmployeeCard} from "../components/EmployeeCard";
import {useMe} from "../hooks/useMe";
import "../styles/profile.scss";
import {UploadFile} from "../components/UploadFile";
import {useMutation} from "react-query";
import {Stack} from "@mui/material";
import {toast} from "react-toastify";
import {useDeleteEmployee} from "../hooks/useDeleteEmployee";
import {useArchiveEmployee} from "../hooks/useArchiveEmployee";
import API from "../APIs/API";

const initialEmployee = {
  id: 0,
  avatar_src: "",
  user_type: "",
  employee_no: "",
  name_report: "",
  admin_location: "",
  admin_desc: "",
  position_no: "",
  occup_pos_title: "",
  award: "",
  award_desc: "",
  classification: "",
  class_desc: "",
  step_no: "",
  occup_type: "",
  gender: "",
  first_commence: "",
  account_no: "",
  account_no_desc: "",
  emp_status: "",
  paypoint: "",
  paypoint_desc: "",
  date_of_birth: "",
  age: 0,
  occup_pos_cat: "",
  creator: "",
  status: true,
  created_at: "",
  updated_at: "",
};

const EmployeeView = ({type}) => {
  const navigate = useNavigate();
  const {admin_location_id, employee_no} = useParams();
  const {permissions} = useMe();
  const pageUserType = type === "Non-Teacher" ? "non-teachers" : "teachers";
  const [employee, setEmployee] = useState(initialEmployee);
  const [needSave, setNeedSave] = useState(false);
  const [editable, setEditable] = useState(false);
  const backUrl = `/${pageUserType}/${admin_location_id}`;
  const {handleDeleteEmployee} = useDeleteEmployee({redirectUrl: backUrl})
  const {handleArchiveEmployee} = useArchiveEmployee({redirectUrl: backUrl})

  const employeeUpdate = useMutation((body) => new API().updateEmployee(body), {
    onSuccess: (data) => {
      if (data != null) {
        toast.success("Data Updated Successfully!");
        navigate(backUrl);
      } else {
        toast.error("Data Update Failed!");
      }
    },
  });

  useEffect(() => {
    new API().getEmployee(employee_no).then((data) => {
      if (data != null) {
        setEmployee({...data["data"]});
      } else {
        toast.error("Invalid Request!");
        navigate(backUrl);
      }
    });
  }, [employee_no]);

  const handleChange = (e) => {
    if (!needSave) {
      setNeedSave(true);
    }
    setEmployee({...employee, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    employeeUpdate.mutate(employee);

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
                      <h1>View Employee Details</h1>
                    </div>
                  </div>
                  <hr/>
                  <div className="text-center">
                    <img
                      style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "40x solid black",
                      }}
                      src={
                        employee.avatar_src
                          ? `${Config.api_url}v1/admin/employee/profile_image/${employee.avatar_src}`
                          : sample
                      }
                      alt=""
                    />
                  </div>
                  {permissions.super && (
                    <UploadFile
                      invalidateQueries="employees"
                      url={`${Config.api_url}v1/admin/employee/employee_avatar?employee_no=${employee_no}`}
                      name="avatar_file"
                    />
                  )}
                  <hr/>

                  <div className="row">
                    <div className="col col-sm">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="user_type">
                          <b>User type</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="user_type"
                          id="user_type"
                          value={employee?.user_type}
                          disabled
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
                          disabled
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
                          disabled
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="admin_location">
                          <b>Admin location</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="admin_location"
                          id="admin_location"
                          value={employee?.admin_location}
                          disabled
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="admin_desc">
                          <b>Admin desc</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="admin_desc"
                          id="admin_desc"
                          value={employee?.admin_desc}
                          disabled
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
                          disabled={!editable}
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
                          disabled={!editable}
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
                          disabled={!editable}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
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
                          disabled={!editable}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col col-sm">
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
                          disabled={!editable}
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
                          disabled={!editable}
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
                          disabled={!editable}
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
                          disabled={!editable}
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
                          disabled={!editable}
                          required
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
                          value={employee ? new Date(employee?.first_commence).toDateString() : ""}
                          disabled={!editable}
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
                          disabled={!editable}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
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
                          disabled={!editable}
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
                          disabled={!editable}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col col-sm">
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
                          disabled={!editable}
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
                          disabled={!editable}
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
                          value={new Date(
                            employee?.date_of_birth
                          ).toDateString()}
                          disabled={!editable}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="age">
                          <b>Age</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="number"
                          name="age"
                          id="age"
                          value={employee?.age}
                          disabled
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
                          disabled={!editable}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="status">
                          <b>Status</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="status"
                          id="status"
                          value={employee?.status ? "Active" : "Inactive"}
                          disabled
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
                          value={employee?.creator}
                          disabled
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="created_at">
                          <b>Created at</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="created_at"
                          id="created_at"
                          value={new Date(employee?.created_at).toDateString()}
                          disabled
                        />
                      </div>
                      <div className="form-outline">
                        <label className="form-label" htmlFor="updated_at">
                          <b>Updated at</b>
                        </label>
                        <br/>
                        <input
                          className="form-control"
                          type="text"
                          name="updated_at"
                          id="updated_at"
                          value={new Date(employee?.updated_at).toDateString()}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <hr/>
                  <Stack direction="row">
                    {permissions.super && (
                      <Link className="app-button app-button-gray"
                            to={`/${pageUserType}/${admin_location_id}`}
                            style={{marginRight: 10, marginLeft: 10}}>
                        Back
                      </Link>
                    )}
                    {permissions.super && (
                      <button
                        className="app-button app-button-primary"
                        style={{marginRight: 10}}
                        disabled={editable}
                        onClick={(e) => setEditable(!editable)}
                      >
                        Edit
                      </button>
                    )}
                    {permissions.super && (
                      <button
                        className="app-button app-button-primary"
                        style={{marginRight: 10}}
                        disabled={!needSave}
                        onClick={(e) => handleSubmit(e)}
                      >
                        Save
                      </button>
                    )}
                    {permissions.super && (
                      <button
                        className="app-button app-button-primary"
                        style={{marginRight: 10}}
                        onClick={(e) => handleDeleteEmployee(e, employee_no)}
                      >
                        Delete
                      </button>
                    )}
                    {permissions.super && (
                      <button
                        className="app-button app-button-primary"
                        style={{marginRight: 10}}
                        onClick={(e) => handleArchiveEmployee(e, employee_no)}
                      >
                        Archive
                      </button>
                    )}
                  </Stack>
                </div>
              </form>
              {/*<hr/>*/}
              {/*<div className="col col-sm text-center">*/}
              {/*  <h1>View Employee Details</h1>*/}
              {/*</div>*/}
              {/*<div className="col col-sm">
                <EmployeeCard
                  employee={employee}
                  backLink={`/${pageUserType}/${admin_location_id}`}
                  setEmployee={setEmployee}
                />
              </div>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;
