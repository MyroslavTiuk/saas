import React, {useEffect, useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {Modal} from "antd";
import {toast} from "react-toastify";
import {useMutation} from "react-query";
import API from "../APIs/API";
import Sidebar from "../components/Sidebar";

import "../styles/profile.scss";

const DeviceView = ({type}) => {
  let pageUserType = type === "Non-Teacher" ? "non-teachers" : "teachers";
  const {admin_location_id, id} = useParams();
  let initialDevice = {
    id: id,
    account_no_desc: "",
    paypoint_desc: "",
    ip_address: "",
    device_id: "",
    device_name: "",
    device_product_key: "",
    make_or_model: "",
    gps_location: "",
  };

  const navigate = useNavigate();
  const [adminLocation, setAdminLocation] = useState({
    admin_location: "",
    admin_desc: "",
  });
  const [device, setDevice] = useState(initialDevice);
  const deleteDevice = useMutation({
    mutationFn: () => new API().deleteDevice(id),
    onSuccess: (data) => {
      if (data) {
        toast.success("Device deleted successfully");
        navigate(`/${pageUserType}/${admin_location_id}/devices`);
      } else {
        toast.error("Failed to delete Device!");
      }
    },
  });
  const updateDevice = useMutation((body) => new API().updateDevice(body), {
    onSuccess: (data) => {
      if (data) {
        toast.success("Device Updated Successfully!");
      } else {
        toast.error("Device Update Failed!");
      }
    }
  })

  useEffect(() => {
    new API().getDeviceById(id).then((data) => {
      setDevice({...data["data"]["device"]});
      setAdminLocation({...data["data"]["admin_location"]});
    });
  }, [id]);

  const handleChange = (e) => {
    setDevice({...device, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateDevice.mutate(device)
  };
  const handleDeleteDevice = (e) => {
    e.preventDefault();
    e.stopPropagation();

    Modal.confirm({
      title: "Are you sure?",
      content: "Are you sure you want to delete this device?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        deleteDevice.mutate();
      },
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
              <Link
                to={`/${pageUserType}/${admin_location_id}/devices`}
                className="backButtonSection"
              >
                <KeyboardBackspaceIcon className="backButton"/>
              </Link>
              <br/>
              <br/>
              <form>
                <div className="container">
                  <div className="row">
                    <div className="row">
                      <div className="col col-sm">
                        <h1>Device Details</h1>
                      </div>
                      <div className="col col-sm d-flex justify-content-end">
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
                          <label className="form-label" htmlFor="device_name">
                            <b>Device name</b>
                          </label>
                          <br/>
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
                          <label className="form-label" htmlFor="make_or_model">
                            <b>Make/Model</b>
                          </label>
                          <br/>
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
                        <div className="form-outline">
                          <label
                            className="form-label"
                            htmlFor="account_no_desc"
                          >
                            <b>Account no desc</b>
                          </label>
                          <br/>
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
                          <br/>
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
                      <div className="col col-sm">
                        <div className="form-outline">
                          <label className="form-label" htmlFor="device_id">
                            <b>Device ID</b>
                          </label>
                          <br/>
                          <input
                            className="form-control"
                            type="text"
                            name="device_id"
                            id="device_id"
                            value={device?.device_id}
                            readOnly
                            disabled
                          />
                        </div>
                        <div className="form-outline">
                          <label className="form-label" htmlFor="ip_address">
                            <b>IP address</b>
                          </label>
                          <br/>
                          <input
                            className="form-control"
                            type="text"
                            name="ip_address"
                            id="ip_address"
                            value={device?.ip_address}
                            readOnly
                            disabled
                          />
                        </div>
                        <div className="form-outline">
                          <label className="form-label" htmlFor="gps_location">
                            <b>GPS location</b>
                          </label>
                          <br/>
                          <input
                            className="form-control"
                            type="text"
                            name="gps_location"
                            id="gps_location"
                            value={device?.gps_location}
                            readOnly
                            disabled
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
                          <br/>
                          <input
                            className="form-control"
                            type="text"
                            name="admin_location"
                            id="admin_location"
                            value={adminLocation?.admin_location}
                            readOnly
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
                            value={adminLocation?.admin_desc}
                            readOnly
                            disabled
                          />
                        </div>
                        <div className="form-outline">
                          <label className="form-label" htmlFor="device_product_key">
                            <b>Activate Code</b>
                          </label>
                          <br/>
                          <input
                            className="form-control"
                            type="text"
                            name="device_product_key"
                            id="device_product_key"
                            disabled
                            value={device?.device_product_key}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              <hr/>
              <div className="container">
                <div className="row">
                  <div className="col col-sm">
                    <button
                      className="app-button app-button-primary"
                      onClick={handleDeleteDevice}
                    >
                      Delete Device
                    </button>
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

export default DeviceView;
