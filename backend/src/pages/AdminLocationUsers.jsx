import React from "react";
import {Link, useParams} from "react-router-dom";
import {DataGrid} from "@mui/x-data-grid";
import {Switch} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {makeQueryString} from "../APIs/request";
import Sidebar from "../components/Sidebar";

import "../styles/list.scss";
import {usePaginationParams} from "../hooks/usePaginationParams";
import API from "../APIs/API";
import moment from "moment";

const AdminLocationUsers = ({type}) => {
  const queryClient = useQueryClient();
  const {admin_location_id} = useParams();
  const {gridParams, queryParams} = usePaginationParams();
  const pageUserType = type === "Non-Teacher" ? "non-teachers" : "teachers";

  const {data: managers = [], isFetching} = useQuery([
    "managers",
    makeQueryString(queryParams),
  ], {
    queryFn: async () => {
      const queryString = makeQueryString(queryParams, {admin_location_id});
      return await new API().getManagers(queryString);
    }
  });

  const changeUserStatus = useMutation(
    (body) => new API().changeUserStatus(body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("managers");

      },
    }
  );

  const userColumns = [
    {
      field: "status",
      headerName: "Status",
      width: 70,
      renderCell: ({row}) => {
        if (row.deleted_at != null) return <span className={"red-text"}>Deleted</span>;
        return (
          <Switch
            checked={row.status}
            onChange={() =>
              changeUserStatus.mutate({
                user_id: row.id,
                status: !row.status,
              })
            }
          />
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "admin_location_level_user",
      headerName: "Admin Location Level",
      width: 200,
    },
    {
      field: "surname",
      headerName: "Surname",
      width: 200,
    },
    {
      field: "given_name",
      headerName: "Given name",
      width: 200,
    },
    {
      field: "job_title",
      headerName: "Job title",
      width: 200,
    },
    {
      field: "office_phone",
      headerName: "Office phone",
      width: 200,
    },
    {
      field: "mobile_number",
      headerName: "Mobile number",
      width: 200,
    },
    {
      field: "creator",
      headerName: "Created by",
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
              to={`/${pageUserType}/${admin_location_id}/users/${params.row.id}`}
              style={{textDecoration: "none"}}
            >
              <div className="viewButton">View</div>
            </Link>
          </div>
        );
      },
    }
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
                Admin Location Users
                <Link
                  to={`/${pageUserType}/${admin_location_id}/users/add`}
                  className="link"
                >
                  <button className="addBtn">Add new</button>
                </Link>
              </div>
              <DataGrid
                className="datagrid"
                rows={managers?.rows || []}
                columns={actionColumn.concat(userColumns)}
                rowCount={managers?.count ?? 0}
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

export default AdminLocationUsers;
