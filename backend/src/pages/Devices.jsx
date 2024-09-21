import "../styles/list.scss";
import Sidebar from "../components/Sidebar";
import React from "react";
import {Link} from "react-router-dom";
import {DataGrid} from "@mui/x-data-grid";
import API from "../APIs/API";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {usePaginationParams} from "../hooks/usePaginationParams";
import {makeQueryString} from "../APIs/request";
import {Switch} from "@mui/material";
import moment from "moment/moment";

const Devices = ({type}) => {
  const queryClient = useQueryClient();
  let pageUserType = type === "Non-Teacher" ? "non-teachers" : "teachers";
  let pathname = window.location.pathname;
  let admin_location_id = pathname.split("/")[2];

  const {gridParams, queryParams} = usePaginationParams();

  const {data: devices = [], isFetching} = useQuery([
    "devices",
    makeQueryString(queryParams, {admin_location_id}),
  ], {
    queryFn: async () => {
      const queryString = makeQueryString(queryParams, {admin_location_id});
      return await new API().getAllDevices(queryString);
    },
    enabled: !!admin_location_id,
  });

  const changeDeviceStatus = useMutation(
    (body) => new API().changeDeviceStatus(body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("devices").then();
      },
    }
  )

  const deviceColumns = [
    {
      field: "status",
      headerName: "Status",
      width: 70,
      renderCell: ({row}) =>
        <Switch
          checked={row.status === true}
          onChange={() =>
            changeDeviceStatus.mutate({
              device_id: row.id,
              status: !row.status,
            })
          }
        />,
    },
    {
      field: "device_name",
      headerName: "Device name",
      width: 200,
    },
    {
      field: "ip_address",
      headerName: "IP address",
      width: 200,
    },
    {
      field: "make_or_model",
      headerName: "Make/Model",
      width: 200,
    },
    {
      field: "gps_location",
      headerName: "GPS location",
      width: 200,
    },
    {
      field: "admin_location",
      headerName: "Admin location",
      width: 200,
    },
    {
      field: "admin_desc",
      headerName: "Admin desc",
      width: 200,
    },
    {
      field: "account_no_desc",
      headerName: "Account no desc",
      width: 200,
    },
    {
      field: "paypoint_desc",
      headerName: "PayPoint desc",
      width: 200,
    },
    {
      field: "creator",
      headerName: "Created by",
      width: 200,
    },
    {
      field: "created_at",
      headerName: "Created at",
      width: 200,
      renderCell: ({row}) => {
        return (
          <>
            <p>{moment(row.created_at).format("YYYY-MM-DD HH:mm:ss")}</p>
          </>
        );
      },
    },
    {
      field: "updated_at",
      headerName: "Updated at",
      width: 200,
      renderCell: ({row}) => {
        return (
          <>
            <p>{moment(row.updated_at).format("YYYY-MM-DD HH:mm:ss")}</p>
          </>
        );
      },
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 80,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/${pageUserType}/${admin_location_id}/devices/view/${params.row.id}`}
              style={{textDecoration: "none"}}
            >
              <div className="viewButton">View</div>
            </Link>
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
              <Link to={`/${pageUserType}`} className="backButtonSection">
                <KeyboardBackspaceIcon className="backButton"/>
              </Link>
              <br/>
              <br/>

              <div className="datatableTitle">
                Devices
                <Link
                  to={`/${pageUserType}/${admin_location_id}/devices/add`}
                  className="link"
                >
                  <button className="addBtn">Add new</button>
                </Link>
              </div>
              <DataGrid
                className="datagrid"
                rows={devices?.rows || []}
                columns={actionColumn.concat(deviceColumns)}
                rowCount={devices?.count ?? 0}
                loading={isFetching}
                {...gridParams}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Devices;
