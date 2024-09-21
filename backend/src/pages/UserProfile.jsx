import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useMutation, useQueryClient} from "react-query";
import {FieldText} from "../components/fields/FieldText";
import {UserResetPassword} from "../components/UserResetPassword";
import {useMe} from "../hooks/useMe";
import API from "../APIs/API";
import Sidebar from "../components/Sidebar";
import "../styles/profile.scss";

const initialUser = {
  id: 0,
  surname: "",
  given_name: "",
  job_title: "",
  access_privilege: "",
  admin_location_level_user: "",
  admin_desc: "",
  office_phone: "",
  mobile_number: "",
  email: "",
  creator: "",
  created_at: "",
  updated_at: "",
};

const UserProfile = () => {
  const {user: loggedUser, permissions} = useMe();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(initialUser);
  const [hasPermission, setHasPermission] = useState(false);
  const updateProfile = useMutation((body) => new API().updateProfile(body), {
    onSuccess: (data) => {
      if (data) {
        toast.success("Profile Updated Successfully !");
        queryClient.invalidateQueries("/users/me");
      } else {
        toast.error("Profile Update Failed !");
      }
    }
  })

  useEffect(() => {
    setUser({
      id: loggedUser.id,
      surname: loggedUser.surname,
      given_name: loggedUser.given_name,
      job_title: loggedUser.job_title,
      access_privilege: loggedUser.access_privilege,
      admin_location_level_user: loggedUser.admin_location_level_user,
      admin_desc: loggedUser.admin_location?.admin_desc,
      office_phone: loggedUser.office_phone,
      mobile_number: loggedUser.mobile_number,
      email: loggedUser.email,
      creator: loggedUser.creator,
      created_at: loggedUser.created_at,
      updated_at: loggedUser.updated_at,
    });
    setHasPermission(permissions.super || loggedUser.admin_location_level_user === "Admin Location User");
  }, [loggedUser]);

  const handleChange = (e, entity) => {
    setUser({...user, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile.mutate(user);
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
              <form>
                <div className="container">
                  <div className="row">
                    <div className="col col-sm">
                      <h1>My Profile</h1>
                    </div>
                    <div className="col col-sm">
                      {hasPermission && (<button
                        type="submit"
                        className="saveBtn btn btn-primary btn-block mb-3"
                        onClick={(e) => handleSubmit(e)}
                      >
                        Save changes
                      </button>)}
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
                          disabled={!hasPermission}
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
                          disabled={!hasPermission}
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
                          disabled={!hasPermission}
                        />
                      </div>
                      {user.access_privilege && (
                        <FieldText
                          label="Access privilege"
                          name="access_privilege"
                          value={user.access_privilege}
                          readOnly
                        />
                      )}
                      {!!user.admin_location && (
                        <FieldText
                          label="Admin Location Level User"
                          name="admin_location_level_user"
                          value={`${user.admin_location.admin_location} - ${user.admin_location.admin_desc}`}
                          readOnly
                        />
                      )}
                      {user.account_no_desc && (
                        <FieldText
                          label="Account No Desc"
                          name="account_no_desc"
                          value={user.account_no_desc}
                          readOnly
                        />
                      )}
                      {user.paypoint_desc && (
                        <FieldText
                          label="Paypoint desc"
                          name="paypoint_desc"
                          value={user.paypoint_desc}
                          readOnly
                        />
                      )}
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
                          disabled={!hasPermission}
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
                          disabled={!hasPermission}
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
                          onChange={(e) => handleChange(e)}
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
                          onChange={(e) => handleChange(e)}
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
                          onChange={(e) => handleChange(e)}
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
                          onChange={(e) => handleChange(e)}
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
                    <UserResetPassword/>
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

export default UserProfile;
