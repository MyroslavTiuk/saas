import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useParams} from "react-router";
import API from "../APIs/API";
import Sidebar from "../components/Sidebar";
import "../styles/profile.scss";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {toast} from "react-toastify";
import {Stack} from "@mui/material";
import {FieldText} from "../components/fields/FieldText";
import {useDeleteUser} from "../hooks/useDeleteUser";
import {useMutation} from "react-query";
import {UserResetPasswordAdmin} from "../components/UserResetPasswordAdmin";
import {useRestoreUser} from "../hooks/useRestoreUser";

const UserView = () => {
  const navigate = useNavigate();
  const {user_id} = useParams();
  let initialUser = {
    id: 0,
    email: "",
    access_privilege: "",
    creator: "",
    surname: "",
    given_name: "",
    job_title: "",
    office_phone: "",
    mobile_number: "",
    created_at: "",
    updated_at: "",
    deleted_at: null,
  };
  const [user, setUser] = useState(initialUser);
  const {handleDeleteUser} = useDeleteUser({redirectUrl: "/users"});
  const {handleRestoreUser} = useRestoreUser({redirectUrl: "/users"});

  const updateUser = useMutation((body) => new API().updateAdminUser(body), {
    onSuccess: (data) => {
      if (data) {
        toast.success("User Updated Successfully!");
        navigate('/users');
      } else {
        toast.error("User Update Failed!");
      }
    },
  });

  useEffect(() => {
    new API().getUserById(user_id).then((data) => {
      if (data != null) {
        setUser({...data["data"]});
      } else {
        toast.error("Invalid Request!");
        navigate('/users');
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
              <Link to="/users" className="backButtonSection">
                <KeyboardBackspaceIcon className="backButton"/>
              </Link>
              <br/>
              <br/>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="container">
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
                            onClick={(e) => handleDeleteUser(e, user_id)}
                          >
                            Delete user
                          </button>) : (<button
                            className="app-button app-button-primary"
                            style={{marginRight: 10}}
                            onClick={(e) => handleRestoreUser(e, user_id)}
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
                      <FieldText
                        label="Access privilege"
                        value={user.access_privilege}
                        readOnly
                      />
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
                    </div>
                    <div className="col col-sm">
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
                </div>
              </form>
              <hr/>
              <div className="container">
                <div className="row">
                  <div className="col col-sm">
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

export default UserView;
