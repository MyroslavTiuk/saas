import React, {useState} from "react";
import {Link} from "react-router-dom";
import {DataGrid} from "@mui/x-data-grid";
import {Switch} from "@mui/material";
import Sidebar from "../components/Sidebar";
import "../styles/list.scss";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {makeQueryString} from "../APIs/request";
import {useDebounce} from "../hooks/useDebounce";
import {useMe} from "../hooks/useMe";
import {usePaginationParams} from "../hooks/usePaginationParams";
import API from "../APIs/API";
import moment from "moment";

const Users = () => {
  const queryClient = useQueryClient();
  const {user: loggedUser} = useMe();
  const {gridParams, queryParams} = usePaginationParams();
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 500);

  const {data: users = [], isFetching} = useQuery([
    "users",
    makeQueryString(queryParams, {search: searchDebounced}),
  ], {
    queryFn: async () => {
      const queryString = makeQueryString(queryParams, {search: searchDebounced});
      return await new API().getAllUsers(queryString);
    },
  });
  const changeUserStatus = useMutation(
    (body) => new API().changeUserStatus(body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users").then();
      },
    }
  );

  const userColumns = [
    {
      field: "status",
      headerName: "Status",
      width: 70,
      renderCell: ({row}) => {
        if (loggedUser.id === row.id) return <div></div>;
        if (row.deleted_at != null) return <span className={"red-text"}>Deleted</span>;
        //if (row.access_privilege === 'Super User') return <div></div>;
        return (<Switch
          checked={row.status}
          onChange={() =>
            changeUserStatus.mutate({
              user_id: row.id,
              status: !row.status,
            })
          }
        />);
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "access_privilege",
      headerName: "Access privilege",
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
      field: "admin_desc",
      headerName: "Admin Desc",
      width: 200,
    },
    {
      field: "office_phone",
      headerName: "Office phone",
      width: 150,
    },
    {
      field: "mobile_number",
      headerName: "Mobile number",
      width: 150,
    },
    {
      field: "creator",
      headerName: "Created by",
      width: 200,
    },
    {
      field: "created_at",
      headerName: "Created at",
      width: 120,
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
      width: 120,
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
              to={`/users/${params.row.id}`}
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
              <div className="datatableTitle">
                Admin Users
                <Link to="/users/add" className="link">
                  <button className="addBtn">Add new</button>
                </Link>
              </div>
              <div className="d-flex justify-content-end">
                <input
                  className="form-control w-50"
                  type="text"
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                />
              </div>
              <br/>
              <DataGrid
                className="datagrid"
                rows={users?.rows || []}
                columns={actionColumn.concat(userColumns)}
                rowCount={users?.count ?? 0}
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

export default Users;
