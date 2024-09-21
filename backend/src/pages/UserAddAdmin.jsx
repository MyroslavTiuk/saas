import {toast} from "react-toastify";
import React, {useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery} from "react-query";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {FieldShowAccountNoDesc} from "../components/fields/FieldShowAccountNoDesc";
import {FieldShowPaypointDesc} from "../components/fields/FieldShowPaypointDesc";
import Sidebar from "../components/Sidebar";
import {useMe} from "../hooks/useMe";
import API from "../APIs/API";
import {ADMIN_LOCATION_LEVEL_USER_OPTIONS} from "../constants";

const UserAddAdmin = () => {
  const navigate = useNavigate();
  const {admin_location_id, user_type} = useParams();
  const backUrl = `/${user_type}/${admin_location_id}/users`;
  const {user: loggedUser} = useMe();
  const {data: adminLocation} = useQuery(
    {
      queryFn: async () => {
        const data = await new API().getAdminLocationById(admin_location_id);
        if (data != null) {
          return data["data"];
        }
        return null;
      }
    }
  );
  const createUser = useMutation((body) => new API().addManager(body), {
    onSuccess: (data) => {
      if (data) {
        toast.success("User created Successfully!");
        navigate(backUrl);
      } else {
        toast.error("User creation Failed!");
      }
    },
  });

  const [user, setUser] = useState(() => ({
    admin_location_id: "",
    surname: "",
    given_name: "",
    job_title: "",
    admin_location_level_user: ADMIN_LOCATION_LEVEL_USER_OPTIONS.ADMIN_LOCATION_USER,
    account_no_desc: "",
    paypoint_desc: "",
    office_phone: "",
    mobile_number: "",
    email: "",
    password: "",
    confirm_password: "",
  }));

  const handleChange = (e) => {
    setUser((prev) => ({...prev, [e.target.name]: e.target.value}));

    if (e.target.name === "admin_location_level_user") {
      setUser((prev) => ({...prev, account_no_desc: "", paypoint_desc: ""}));
    }
  };

  const handleChangeAutocomplete = (name, value) => {
    if (name === "account_no_desc") {
      setUser((prev) => ({...prev, paypoint_desc: ""}));
    }

    setUser((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {...user};

    Object.assign(newUser, {
      admin_location_id: admin_location_id,
    });

    if (newUser.password !== newUser.confirm_password) {
      toast.warning("The passwords you entered do not match.");
      return;
    }

    createUser.mutate(newUser);
  };
  return (
    <>
      <div className="wrapper">
        <div className="sidebar">
          <Sidebar/>
        </div>
        <div className="content">
          <div className="profile">
            <div className="profileContainer">
              <div className="profileSection">
                <Link
                  to={`/${user_type}/${admin_location_id}/users`}
                  className="backButtonSection"
                >
                  <KeyboardBackspaceIcon className="backButton"/>
                </Link>
                <br/>
                <br/>
                <div className="container">
                  <div className="row">
                    <div className="row">
                      <div className="row">
                        <div className="col col-sm">
                          <h1>Admin Location</h1>
                        </div>
                      </div>
                      <hr/>
                      <div className="row">
                        <div className="col col-sm">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="admin_location"
                            >
                              <b>Admin location</b>
                            </label>
                            <br/>
                            <input
                              className="form-control"
                              type="text"
                              name="admin_location"
                              id="admin_location"
                              value={adminLocation?.admin_location}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col col-sm">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="admin_desc">
                              <b>Admin Desc</b>
                            </label>
                            <br/>
                            <input
                              className="form-control"
                              type="text"
                              name="admin_desc"
                              id="admin_desc"
                              value={adminLocation?.admin_desc}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col col-sm">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="user_type">
                              <b>User type</b>
                            </label>
                            <br/>
                            <select
                              disabled
                              className="form-select"
                              name="user_type"
                              id="user_type"
                              value={adminLocation?.user_type}
                            >
                              <option value="Teacher">Teacher</option>
                              <option value="Non-Teacher">Non-Teacher</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr/>
                  <br/>
                  <br/>
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
                            <label
                              className="form-label"
                              htmlFor="admin_location_level_user"
                            >
                              <b>Admin Location Level</b>
                            </label>
                            <br/>
                            <select
                              className="form-select"
                              name="admin_location_level_user"
                              id="admin_location_level_user"
                              value={user.admin_location_level_user}
                              onChange={handleChange}
                            >
                              <option value={ADMIN_LOCATION_LEVEL_USER_OPTIONS.ADMIN_LOCATION_USER}>
                                Admin Location User
                              </option>
                              <option value={ADMIN_LOCATION_LEVEL_USER_OPTIONS.ACCOUNT_NO_DESC_USER}>
                                Account No Desc User
                              </option>
                              <option value={ADMIN_LOCATION_LEVEL_USER_OPTIONS.PAYPOINT_DESC_USER}>
                                Paypoint Desc User
                              </option>
                            </select>
                          </div>
                          {[
                            ADMIN_LOCATION_LEVEL_USER_OPTIONS.ACCOUNT_NO_DESC_USER,
                            ADMIN_LOCATION_LEVEL_USER_OPTIONS.PAYPOINT_DESC_USER,
                          ].includes(user.admin_location_level_user) && (
                            <FieldShowAccountNoDesc
                              name="account_no_desc"
                              value={user.account_no_desc}
                              onChange={handleChangeAutocomplete}
                              adminLocationId={admin_location_id}
                            />
                          )}
                          {user.admin_location_level_user ===
                            ADMIN_LOCATION_LEVEL_USER_OPTIONS.PAYPOINT_DESC_USER &&
                            !!user.account_no_desc && (
                              <FieldShowPaypointDesc
                                name="paypoint_desc"
                                value={user.paypoint_desc}
                                onChange={handleChangeAutocomplete}
                                adminLocationId={admin_location_id}
                                accountNoDesc={user.account_no_desc}
                              />
                            )}
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="office_phone"
                            >
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
                            <label
                              className="form-label"
                              htmlFor="mobile_number"
                            >
                              <b>Mobile number</b>
                            </label>
                            <br/>
                            <input
                              className="form-control"
                              type="tel"
                              name="mobile_number"
                              id="mobile_number"
                              value={user?.mobile_number}
                              onChange={(e) => handleChange(e, "user")}
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
                              value={user?.email}
                              onChange={(e) => handleChange(e, "user")}
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
                              value={user?.password}
                              onChange={(e) => handleChange(e, "user")}
                            />
                          </div>
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="confirm_password"
                            >
                              <b>Confirm Password</b>
                            </label>
                            <br/>
                            <input
                              className="form-control"
                              type="password"
                              name="confirm_password"
                              id="confirm_password"
                              value={user?.confirm_password}
                              onChange={(e) => handleChange(e, "user")}
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
    </>
  );
};

export default UserAddAdmin;
