import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../APIs/API";
import Sidebar from "../components/Sidebar";
import "../styles/profile.scss";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useMutation } from "react-query";

const DeviceAdd = ({ type }) => {
  const pageUserType = type === "Non-Teacher" ? "non-teachers" : "teachers";
  const { admin_location_id } = useParams();
  const navigate = useNavigate();
  const deviceCreate = useMutation((body) => new API().addDevice(body), {
    onSuccess(data) {
      if (data) {
        toast.success("Device created Successfully!");
        navigate(
          `/${pageUserType}/${admin_location_id}/devices/view/${data["data"]["id"]}`
        );
      } else {
        toast.error("Device creation Failed!");
      }
    },
  });

  let initialDevice = {
    admin_location_id: admin_location_id,
    device_id: "",
    device_name: "",
    make_or_model: "",
    account_no_desc: "",
    paypoint_desc: "",
  };

  const [device, setDevice] = useState(initialDevice);
  const [adminLocation, setAdminLocation] = useState({
    admin_location: "",
    admin_desc: "",
  });

  useEffect(() => {
    new API().getAdminLocationById(admin_location_id).then((data) => {
      if (data != null) {
        setAdminLocation({ ...data["data"] });
      }
    });
  }, [admin_location_id]);

  const handleChange = (e) => {
    setDevice({ ...device, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    deviceCreate.mutate(device);
  };

  return (
    <div className="wrapper">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="content">
        <div className="profile">
          <div className="profileContainer">
            <div className="profileSection">
              <Link
                to={`/${pageUserType}/${admin_location_id}/devices`}
                className="backButtonSection"
              >
                <KeyboardBackspaceIcon className="backButton" />
              </Link>
              <br />
              <br />

              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="container">
                  <div className="row">
                    <div className="row">
                      <div className="col col-sm">
                        <h1>Create New Device</h1>
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
                    <hr />

                    <div className="row">
                      <div className="col col-sm">
                        <div className="form-outline">
                          <label className="form-label" htmlFor="device_name">
                            <b>Device name</b>
                          </label>
                          <br />
                          <input
                            className="form-control"
                            type="text"
                            name="device_name"
                            id="device_name"
                            value={device?.device_name}
                            onChange={(e) => handleChange(e)}
                            required
                          />
                        </div>
                        <div className="form-outline">
                          <label className="form-label" htmlFor="device_id">
                            <b>Device ID</b>
                          </label>
                          <br />
                          <input
                            className="form-control"
                            type="text"
                            name="device_id"
                            id="device_id"
                            value={device?.device_id}
                            onChange={(e) => handleChange(e)}
                            required
                          />
                        </div>
                        <div className="form-outline">
                          <label className="form-label" htmlFor="make_or_model">
                            <b>Make/Model</b>
                          </label>
                          <br />
                          <input
                            className="form-control"
                            type="text"
                            name="make_or_model"
                            id="make_or_model"
                            value={device?.make_or_model}
                            onChange={(e) => handleChange(e)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col col-sm">
                        <div className="form-outline">
                          <label
                            className="form-label"
                            htmlFor="admin_location"
                          >
                            <b>Admin location</b>
                          </label>
                          <br />
                          <input
                            className="form-control"
                            type="text"
                            name="admin_location"
                            id="admin_location"
                            value={adminLocation?.admin_location}
                            readOnly
                          />
                        </div>
                        <div className="form-outline">
                          <label className="form-label" htmlFor="admin_desc">
                            <b>Admin desc</b>
                          </label>
                          <br />
                          <input
                            className="form-control"
                            type="text"
                            name="admin_desc"
                            id="admin_desc"
                            value={adminLocation?.admin_desc}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col col-sm">
                        <div className="form-outline">
                          <label
                            className="form-label"
                            htmlFor="account_no_desc"
                          >
                            <b>Account no desc</b>
                          </label>
                          <br />
                          <input
                            className="form-control"
                            type="text"
                            name="account_no_desc"
                            id="account_no_desc"
                            value={device?.account_no_desc}
                            onChange={(e) => handleChange(e)}
                            required
                          />
                        </div>
                        <div className="form-outline">
                          <label className="form-label" htmlFor="paypoint_desc">
                            <b>Paypoint desc</b>
                          </label>
                          <br />
                          <input
                            className="form-control"
                            type="text"
                            name="paypoint_desc"
                            id="paypoint_desc"
                            value={device?.paypoint_desc}
                            onChange={(e) => handleChange(e)}
                            required
                          />
                        </div>
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

export default DeviceAdd;
