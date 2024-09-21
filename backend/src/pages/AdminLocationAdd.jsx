import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {toast} from "react-toastify";
import {useMutation} from "react-query";
import Sidebar from "../components/Sidebar";
import "../styles/profile.scss";
import {NON_TEACHER, TEACHER} from "../constants";
import API from "../APIs/API";

const AdminLocationAdd = ({type}) => {
  const navigate = useNavigate();
  let pageUserType = type === NON_TEACHER ? "non-teachers" : "teachers";

  const createAdminLocation = useMutation(
    (body) => new API().addAdminLocation(body),
    {
      onSuccess(data) {
        if (data) {
          toast.success("Admin location created Successfully!");
          navigate(`/${pageUserType}`);
        } else {
          toast.error("Admin location creation Failed!");
        }
      },
    }
  );
  const [adminLocation, setAdminLocation] = useState(() => ({
    admin_location: "",
    admin_desc: "",
    user_type: type,
  }));

  const handleChange = (e, entity) => {
    setAdminLocation({...adminLocation, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createAdminLocation.mutate(adminLocation);
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
              <div className="container">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="row">
                      <div className="col col-sm">
                        <h1>Create Admin Location</h1>
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
                            onChange={handleChange}
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
                            onChange={handleChange}
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
                            onChange={handleChange}
                          >
                            <option value={TEACHER}>Teacher</option>
                            <option value={NON_TEACHER}>Non-Teacher</option>
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
    </div>
  );
};

export default AdminLocationAdd;
