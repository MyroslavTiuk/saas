import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useParams} from "react-router";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {useMutation} from "react-query";
import {toast} from "react-toastify";
import {Stack} from "@mui/material";
import Sidebar from "../components/Sidebar";
import {FieldText} from "../components/fields/FieldText";
import {useDeleteUser} from "../hooks/useDeleteUser";

import "../styles/profile.scss";
import API from "../APIs/API";
import {UserResetPasswordAdmin} from "../components/UserResetPasswordAdmin";
import {useDeleteAdminLocationUser} from "../hooks/useDeleteAdminLocationUser";
import {useRestoreAdminLocationUser} from "../hooks/useRestoreAdminLocationUser";

let initialUser = {
  id: 0,
  email: "",
  admin_location_level_user: "",
  surname: "",
  given_name: "",
  job_title: "",
  admin_location: "",
  admin_desc: "",
  account_no_desc: "",
  paypoint_desc: "",
  office_phone: "",
  mobile_number: "",
  creator: "",
  created_at: "",
  updated_at: "",
  deleted_at: null,
};

const AdminLocationUserView = () => {
  const navigate = useNavigate();
  const {user_type, admin_location_id, user_id} = useParams();
  const backUrl = `/${user_type}/${admin_location_id}/users`;
  const [user, setUser] = useState(initialUser);
  const {handleDeleteAdminLocationUser} = useDeleteAdminLocationUser({redirectUrl: backUrl});
  const {handleRestoreAdminLocationUser} = useRestoreAdminLocationUser({redirectUrl: backUrl});
  const updateUser = useMutation((body) => new API().updateAdminUser(body), {
    onSuccess: (data) => {
      if (data) {
        toast.success("Data Updated Successfully!");
        navigate(backUrl);
      } else {
        toast.error("Data Update Failed!");
      }
    },
  });


  useEffect(() => {
    new API().getManagerById(user_id).then((data) => {
      if (data != null) {
        setUser({...data["data"]});
      } else {
        toast.error("Invalid Request!");
        navigate(backUrl);
      }
    });
  }, [user_id]);

  const handleChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value});
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser.mutate(user);
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
              <Link to={backUrl} className="backButtonSection">
                <KeyboardBackspaceIcon className="backButton"/>
              </Link>
              <br/>
              <br/>
              <form onSubmit={handleSubmit} className="container">
                <div className="row">
                  <div className="col col-sm">
                    <h1>View User Details</h1>
                  </div>
                  <div className="col col-sm">
                    <Stack direction="row" justifyContent="end">
                      {
                        user?.deleted_at == null ? (<button
                          className="app-button app-button-primary"
                          style={{marginRight: 10}}
                          onClick={(e) => handleDeleteAdminLocationUser(e, user_id)}
                        >
                          Delete user
                        </button>) : (<button
                          className="app-button app-button-primary"
                          style={{marginRight: 10}}
                          onClick={(e) => handleRestoreAdminLocationUser(e, user_id)}
                        >
                          Restore User
                        </button>)
                      }
                      <button
                        type="submit"
                        className="saveBtn btn btn-primary mb-3"
                      >
                        Save changes
                      </button>
                    </Stack>
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
                        value={user?.surname}
                        onChange={(e) => handleChange(e)}
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
                        value={user?.given_name}
                        onChange={(e) => handleChange(e)}
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
                        value={user?.job_title}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                    </div>
                    <div className="form-outline">
                      <label className="form-label" htmlFor="office_phone">
                        <b>Office phone</b>
                      </label>
                      <br/>
                      <input
                        className="form-control"
                        type="text"
                        name="office_phone"
                        id="office_phone"
                        value={user?.office_phone}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                    </div>
                    <div className="form-outline">
                      <label className="form-label" htmlFor="mobile_number">
                        <b>Mobile number</b>
                      </label>
                      <br/>
                      <input
                        className="form-control"
                        type="text"
                        name="mobile_number"
                        id="mobile_number"
                        value={user?.mobile_number}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col col-sm">
                    <FieldText
                      label="Admin Location Level User"
                      name="admin_location_level_user"
                      value={user.admin_location_level_user}
                      readOnly
                      disabled
                    />
                    {user.admin_desc && (
                      <FieldText
                        label="Admin Location"
                        name="admin_location"
                        value={`${user.admin_location} - ${user.admin_desc}`}
                        readOnly
                        disabled
                      />
                    )}
                    {user.account_no_desc && (
                      <FieldText
                        label="Account No Desc"
                        name="account_no_desc"
                        value={user.account_no_desc}
                        readOnly
                        disabled
                      />
                    )}
                    {user.paypoint_desc && (
                      <FieldText
                        label="Paypoint desc"
                        name="paypoint_desc"
                        value={user.paypoint_desc}
                        readOnly
                        disabled
                      />
                    )}
                    <div className="form-outline">
                      <label className="form-label" htmlFor="email">
                        <b>Email</b>
                      </label>
                      <br/>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        id="email"
                        value={user?.email}
                        readOnly
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
                        value={user?.creator}
                        readOnly
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
                        value={new Date(user?.created_at).toDateString()}
                        readOnly
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
                        value={new Date(user?.updated_at).toDateString()}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </form>
              <div className="container">
                <div className="row">
                  <div className="col col-sm">
                    <hr/>
                    <UserResetPasswordAdmin user_id={user_id}/>
                  </div>
                  <div className="col col-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLocationUserView;
