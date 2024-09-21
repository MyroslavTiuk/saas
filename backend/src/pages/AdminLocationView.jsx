import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import API from "../APIs/API";
import Sidebar from "../components/Sidebar";

import "../styles/profile.scss";
import {TEACHER} from "../constants";
import {toast} from "react-toastify";

const AdminLocationView = ({type}) => {
  const navigate = useNavigate();
  let pathname = window.location.pathname;
  let admin_location_id = pathname.split("/")[2];

  let pageUserType = type === "Non-Teacher" ? "non-teachers" : "teachers";

  let initialAdminLocation = {
    id: "",
    admin_location: "",
    admin_desc: "",
    user_type: TEACHER,
  };

  const [adminLocation, setAdminLocation] = useState(initialAdminLocation);

  useEffect(() => {

    new API().getAdminLocationById(admin_location_id).then((data) => {
      if (data != null) {
        setAdminLocation({...data["data"]});
      } else {
        toast.error("Invalid Request!");
        navigate(`/${pageUserType}`);
      }

    });
  }, [admin_location_id]);

  const handleChange = (e) => {
    setAdminLocation({...adminLocation, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    new API().updateAdminLocation(adminLocation).then((data) => {
      if (data) {
        toast.success("Admin location updated Successfully!");
        navigate(`/${pageUserType}`);
      }else {
        toast.error("Failed to update Admin location!");
      }
    });
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
              <Link to={`/${pageUserType}`} className="backButtonSection">
                <KeyboardBackspaceIcon className="backButton"/>
              </Link>
              <br/>
              <br/>

              <form>
                <div className="container">
                  <div className="row">
                    <div className="col col-sm">
                      <h1>View Admin Location Details</h1>
                    </div>
                    <div className="col col-sm">
                      <button
                        type="submit"
                        className="saveBtn btn btn-primary btn-block mb-3"
                        onClick={(e) => handleSubmit(e)}
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                  <hr/>

                  <div className="row">
                    <div className="col col-sm">
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
                          value={adminLocation?.admin_location}
                          onChange={(e) => handleChange(e, "admin-location")}
                          required
                        />
                      </div>
                    </div>
                    <div className="col col-sm">
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
                          value={adminLocation?.admin_desc}
                          onChange={(e) => handleChange(e, "admin-location")}
                          required
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
                          className="form-select"
                          name="user_type"
                          id="user_type"
                          value={adminLocation?.user_type}
                          onChange={(e) => handleChange(e, "admin-location")}
                          disabled
                        >
                          <option value="Teacher">Teacher</option>
                          <option value="Non-Teacher">Non-Teacher</option>
                        </select>
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

export default AdminLocationView;
