import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {DataGrid} from "@mui/x-data-grid";
import {Autocomplete, TextField} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Sidebar from "../components/Sidebar";
import API from "../APIs/API";
import {useMe} from "../hooks/useMe";
import "../styles/list.scss";
import {NON_TEACHER} from "../constants";

const AdminLocations = ({type}) => {
  const {permissions} = useMe();

  const pageUserType = type === NON_TEACHER ? "non-teachers" : "teachers";
  const pageUserTypeTitle = type === NON_TEACHER ? "Non-Teachers" : "Teachers";

  const [adminLocations, setAdminLocations] = useState([]);
  const [adminLocationRows, setAdminLocationRows] = useState([]);
  const [adminDescList, setAdminDescList] = useState([]);

  let initialSearch = {
    adminDesc: "All",
  };

  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    getAllAdminLocationsByUserType(type);
  }, [type]);

  const getAllAdminLocationsByUserType = (type) => {
    new API().getAllAdminLocationsByUserType(type).then((data) => {
      let adminLocationList = [];
      let tempAdminDescList = [];
      data["data"].forEach((location) => {
        if (!tempAdminDescList.includes(location.admin_desc)) {
          tempAdminDescList.push(location.admin_desc);
          let adminLocation = {
            id: location.id,
            admin_location: location.admin_location,
            admin_desc: location.admin_desc,
            user_type: location.user_type,
          };
          adminLocationList.push(adminLocation);
        }
      });
      setAdminLocations([...adminLocationList]);
      setAdminLocationRows([...adminLocationList]);
      setAdminDescList(["All", ...tempAdminDescList]);
    });
  };

  const handleSearch = (key, value) => {
    setSearch({...search, [key]: value});

    let adminLocationList = [];

    if (key === "adminDesc") {
      var tempAdminLocationList = adminLocations.filter((location) => {
        if (value !== "All") {
          setSearch({
            adminDesc: value,
          });
          return location.admin_desc === value;
        }
        return location;
      });
    }

    adminLocationList = tempAdminLocationList;
    setAdminLocationRows(adminLocationList);
  };

  const adminLocationColumns = [
    {
      field: "admin_location",
      headerName: "Admin location",
      width: 150,
    },
    {
      field: "admin_desc",
      headerName: "Admin desc",
      width: 400,
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 480,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/${pageUserType}/${params.row.id}`}
              className="actionLink"
            >
              <div className="detailsButton">Details</div>
            </Link>
            {permissions.super && (
              <Link
                to={`/${pageUserType}/${params.row.id}/update`}
                className="actionLink"
              >
                <div className="updateButton">Update</div>
              </Link>
            )}
            {permissions.super && (
              <Link
                to={`/${pageUserType}/${params.row.id}/users`}
                className="actionLink"
              >
                <div className="usersButton">Users</div>
              </Link>
            )}
            <Link
              to={`/reports/location-level/${pageUserType}/${params.row.id}`}
              className="actionLink"
            >
              <div className="reportsButton">Reports</div>
            </Link>
            {permissions.super && (
              <Link
                to={`/${pageUserType}/${params.row.id}/devices`}
                className="actionLink"
              >
                <div className="devicesButton">Devices</div>
              </Link>
            )}
            {permissions.super && (
              <Link
                to={`/${pageUserType}/${params.row.id}/qrcodes`}
                className="actionLink"
              >
                <div className="qrcodesButton">QR codes</div>
              </Link>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="wrapper">
      <div className="sidebar">
        <Sidebar/>
      </div>
      <div className="content">
        <div className="list">
          <div className="listContainer">
            <div className="datatable">
              <Link to="/dashboard" className="backButtonSection">
                <KeyboardBackspaceIcon className="backButton"/>
              </Link>
              <br/>
              <br/>
              <div className="datatableTitle">
                {`${pageUserTypeTitle}`} Admin Locations
                {permissions.super && (
                  <Link to={`/${pageUserType}/add`} className="link">
                    <button className="addBtn">Add new</button>
                  </Link>
                )}
              </div>

              <div className="searchSection">
                <div className="row">
                  <div className="col col-sm-4">
                    <Autocomplete
                      disablePortal
                      id="combo-box"
                      options={adminDescList}
                      sx={{width: 300}}
                      renderInput={(params) => (
                        <TextField {...params} label="Admin desc"/>
                      )}
                      onChange={(e, value) => handleSearch("adminDesc", value)}
                      defaultValue="All"
                      disableClearable
                      value={search?.adminDesc}
                    />
                  </div>
                </div>
              </div>
              <br/>
              <DataGrid
                className="datagrid"
                rows={adminLocationRows}
                columns={adminLocationColumns.concat(actionColumn)}
                pageSize={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLocations;
