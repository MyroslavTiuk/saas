import React, {useEffect, useState} from "react";
import {useQuery} from "react-query";
import {DataGrid} from "@mui/x-data-grid";
import {Stack} from "@mui/material";
import Widget from "../components/Widget";
import Sidebar from "../components/Sidebar";
import API from "../APIs/API";
import {makeQueryString} from "../APIs/request";
import {usePaginationParams} from "../hooks/usePaginationParams";
import {EmployeeAction} from "../components/actions/EmployeeAction";
import {useDebounce} from "../hooks/useDebounce";
import "../styles/dashboard.scss";
import {toast} from "react-toastify";
import moment from "moment";

const initSummary = {
  user_summary: 0,
  employee_summary: 0,
  device_summary: 0,
}

const Dashboard = () => {
  const {gridParams, queryParams} = usePaginationParams();
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 1000);
  const {data: employees, isFetching} = useQuery(
    [
      "employees",
      makeQueryString(queryParams, {search: searchDebounced})
    ],
    {
      queryFn: async () => {
        const queryString = makeQueryString(queryParams, {search: searchDebounced});
        return await new API().getDashboardEmployees(queryString);
      }
    }
  );
  const [summary, setSummary] = useState(initSummary);

  const employeesColumns = [
    {
      field: "action",
      headerName: "Action",
      width: 120,
      sortable: false,
      renderCell: ({row}) => (
        <EmployeeAction row={row}/>
      ),
    },
    {
      field: "employee_no",
      headerName: "Employee No",
      width: 200,
    },
    {
      field: "name_report",
      headerName: "Name Report",
      width: 200,
    },
    {
      field: "admin_location",
      headerName: "Admin Location",
      width: 200,
    },
    {
      field: "admin_desc",
      headerName: "Admin Desc",
      width: 200,
    },
    {
      field: "position_no",
      headerName: "Position No",
      width: 200,
    },
    {
      field: "occup_pos_title",
      headerName: "Occup Pos Title",
      width: 200,
    },
    {
      field: "award",
      headerName: "Award",
      width: 200,
    },
    {
      field: "award_desc",
      headerName: "Award Desc",
      width: 200,
    },
    {
      field: "classification",
      headerName: "Classification",
      width: 200,
    },
    {
      field: "class_desc",
      headerName: "Class Desc",
      width: 100,
    },
    {
      field: "step_no",
      headerName: "Step No",
      width: 200,
    },
    {
      field: "occup_type",
      headerName: "Occup Type",
      width: 200,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 200,
    },
    {
      field: "first_commence",
      headerName: "First Commence",
      width: 200,
      renderCell: ({row}) => {
        return (
          <>
            <p>{moment(row.first_commence).format("YYYY-MM-DD")}</p>
          </>
        );
      },
    },
    {
      field: "account_no",
      headerName: "Account No",
      width: 200,
    },
    {
      field: "account_no_desc",
      headerName: "Account No Desc",
      width: 200,
    },
    {
      field: "emp_status",
      headerName: "Emp Status",
      width: 200,
    },
    {
      field: "paypoint",
      headerName: "Paypoint",
      width: 200,
    },
    {
      field: "paypoint_desc",
      headerName: "Paypoint Desc",
      width: 200,
    },
    {
      field: "date_of_birth",
      headerName: "Date of Birth",
      width: 200,
      renderCell: ({row}) => {
        return (
          <>
            {row.date_of_birth != null ? <p>{moment(row.date_of_birth).format("YYYY-MM-DD")}</p> : <></>}
          </>
        );
      },
    },
    {
      field: "age",
      headerName: "Age",
      width: 200,
    },
    {
      field: "occup_pos_cat",
      headerName: "Occup Pos Cat",
      width: 200,
    },
  ];
  useEffect(() => {
    new API().getSummary().then((data) => {
      if (data != null) {
        setSummary({...data["data"]});
      } else {
        toast.error("Invalid Request!");
      }
    })
  }, []);

  return (
    <div className="wrapper">
      <div className="sidebar">
        <Sidebar/>
      </div>
      <div className="content">
        <div className="dashboard">
          <div className="dashboardContainer">
            <div className="widgets">
              <Widget type="user" count={`${summary?.user_summary}`}/>
              <Widget type="employee" count={summary?.employee_summary}/>
              <Widget type="device" count={`${summary?.device_summary}`}/>
            </div>
            <div className="list">
              <div className="listContainer">
                <div className="datatable">
                  <Stack alignItems="start" direction="row" spacing={2}>
                    <div className="datatableTitle">Employees</div>
                    <input
                      className="form-control"
                      type="text"
                      name="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search"
                    />
                  </Stack>
                  <DataGrid
                    className="datagrid"
                    rows={employees?.rows ?? []}
                    columns={employeesColumns}
                    rowCount={employees?.count ?? 0}
                    loading={isFetching}
                    {...gridParams}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
