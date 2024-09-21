import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {toast} from "react-toastify";
import {useMutation, useQuery} from "react-query";
import Sidebar from "../components/Sidebar";
import "../styles/profile.scss";
import {useMe} from "../hooks/useMe";
import {BUREAUCRAT_USER, NON_TEACHER_USER, SUPER_USER, TEACHER_USER} from "../constants";
import API from "../APIs/API";
import {Autocomplete, TextField} from "@mui/material";

const UserAdd = () => {
  const {user: loggedUser} = useMe();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => ({
    surname: "",
    given_name: "",
    job_title: "",
    admin_desc: "",
    access_privilege: TEACHER_USER,
    office_phone: "",
    mobile_number: "",
    email: "",
    password: "",
    confirm_password: "",
  }));
  const createUser = useMutation((body) => new API().addAdminUser(body), {
    onSuccess: (data) => {
      if (data) {
        toast.success("User created Successfully!");
        navigate('/users');
      } else {
        toast.error("User creation Failed!");
      }
    },
  });

  const {data: adminDescList = []} = useQuery({
    queryKey: ["get_all"],
    queryFn: async () => {
      const data = await new API().getAllLocations();
      if (data != null) {
        return data["data"];
      }
      return [];
    },
    select: (records) =>
      records.map((rec) => ({
        id: rec.id,
        label: rec.admin_desc,
      })),

  });

  const handleChangeAdminDesc = (e) => {
    setUser((prev) => ({...prev, admin_desc: e.target.value}));
  };

  const handleChange = (e) => {
    setUser((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.password !== user.confirm_password) {
      toast.warning("The passwords you entered do not match.");
      return;
    }

    createUser.mutate(user);
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
              <Link to={`/users`} className="backButtonSection">
                <KeyboardBackspaceIcon className="backButton"/>
              </Link>
              <br/>
              <br/>
              <div className="container">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="row">
                      <div className="col col-sm">
                        <h1>Create New User</h1>
                      </div>
                      <div className="col col-sm">
                        <button
                          type="submit"
                          className="saveBtn btn btn-primary btn-block mb-3"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                    <hr/>

                    <div className="row">
                      <div className="col col-sm">
                        <div className="form-outline">
                          <label className="form-label" htmlFor="surname">
                            <b>Surname</b>
                          </label>
                          <br/>
                          <input
                            className="form-control"
                            type="text"
                            name="surname"
                            id="surname"
                            value={user.surname}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-outline">
                          <label className="form-label" htmlFor="given_name">
                            <b>Given name</b>
                          </label>
                          <br/>
                          <input
                            className="form-control"
                            type="text"
                            name="given_name"
                            id="given_name"
                            value={user.given_name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-outline">
                          <label className="form-label" htmlFor="job_title">
                            <b>Job title</b>
                          </label>
                          <br/>
                          <input
                            className="form-control"
                            type="text"
                            name="job_title"
                            id="job_title"
                            value={user.job_title}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-outline">
                          <label className="form-label" htmlFor="admin_desc">
                            <b>Admin Desc</b>
                          </label>
                          <br/>
                          <Autocomplete
                            disablePortal
                            id="combo-box"
                            className="autocomplete"
                            options={adminDescList}
                            renderInput={(params) => <TextField {...params} />}
                            onSelect={handleChangeAdminDesc}
                            defaultValue="Select Admin Desc"
                            disableClearable
                            value={adminDescList.label}
                          />
                        </div>
                        <div className="form-outline">
                          <label
                            className="form-label"
                            htmlFor="access_privilege"
                          >
                            <b>Access privilege</b>
                          </label>
                          <br/>
                          <select
                            className="form-select"
                            name="access_privilege"
                            id="access_privilege"
                            value={user.access_privilege}
                            onChange={handleChange}
                          >
                            <option value={TEACHER_USER}>Teacher User</option>
                            <option value={NON_TEACHER_USER}>
                              Non Teacher User
                            </option>
                            <option value={SUPER_USER}>Super User</option>
                            <option value={BUREAUCRAT_USER}>Bureaucrat User</option>
                          </select>
                        </div>
                        <div className="form-outline">
                          <label className="form-label" htmlFor="office_phone">
                            <b>Office phone</b>
                          </label>
                          <br/>
                          <input
                            className="form-control"
                            type="tel"
                            name="office_phone"
                            id="office_phone"
                            value={user.office_phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col col-sm">
                        <div className="form-outline">
                          <label className="form-label" htmlFor="mobile_number">
                            <b>Mobile number</b>
                          </label>
                          <br/>
                          <input
                            className="form-control"
                            type="tel"
                            name="mobile_number"
                            id="mobile_number"
                            value={user.mobile_number}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-outline">
                          <label className="form-label" htmlFor="email">
                            <b>Email</b>
                          </label>
                          <br/>
                          <input
                            className="form-control"
                            type="email"
                            name="email"
                            id="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-outline">
                          <label className="form-label" htmlFor="password">
                            <b>Password</b>
                          </label>
                          <br/>
                          <input
                            className="form-control"
                            type="password"
                            name="password"
                            id="password"
                            value={user.password}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-outline">
                          <label className="form-label" htmlFor="password">
                            <b>Confirm Password</b>
                          </label>
                          <br/>
                          <input
                            className="form-control"
                            type="password"
                            name="confirm_password"
                            id="confirm_password"
                            value={user.confirm_password}
                            onChange={handleChange}
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
                            value={loggedUser.email}
                            readOnly
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
    </div>
  );
};

export default UserAdd;
