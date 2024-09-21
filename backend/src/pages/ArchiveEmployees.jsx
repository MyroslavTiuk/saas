import Sidebar from "../components/Sidebar";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import {DataGrid} from "@mui/x-data-grid";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {useQuery} from "react-query";
import {makeQueryString} from "../APIs/request";
import {usePaginationParams} from "../hooks/usePaginationParams";
import "../styles/list.scss";
import {useDebounce} from "../hooks/useDebounce";
import moment from "moment/moment";
import {ArchiveEmployeeAction} from "../components/actions/ArchiveEmployeeAction";
import API from "../APIs/API";

const ArchiveEmployees = () => {
  const {gridParams, queryParams} = usePaginationParams();
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 500);

  const {data: employees, isFetching} = useQuery([
    "archive_employees",
    makeQueryString(
      queryParams, {search: searchDebounced,}
    ),
  ], {
    queryFn: async () => {
      const queryString = makeQueryString(queryParams, {search: searchDebounced});
      return await new API().getArchivedEmployees(queryString);
    }
  });

  const archiveColumns = [
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
      field: "archived_at",
      headerName: "Archived At",
      width: 200,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <p>{moment(params.value).format("DD/MM/YYYY")}</p>,
    },
    {
      field: "archived_by",
      headerName: "Archived By",
      width: 150,
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 150,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <p>{moment(params.value).format("DD/MM/YYYY")}</p>,
    },
    {
      field: "admin_desc",
      headerName: "Admin Desc",
      width: 300,
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
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <p>{moment(params.value).format("DD/MM/YYYY")}</p>,
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

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      sortable: false,
      renderCell: ({row}) => (
        <ArchiveEmployeeAction row={row}/>
      ),
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
              <Link to={`/dashboard`} className="backButtonSection">
                <KeyboardBackspaceIcon className="backButton"/>
              </Link>
              <br/>
              <br/>
              <div className="datatableTitle">
                {`Archived Employees`}
              </div>
              <div className="searchSection">
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
              </div>
              <br/>
              <DataGrid
                className="datagrid"
                rows={employees?.rows || []}
                columns={actionColumn.concat(archiveColumns)}
                rowCount={employees?.count ?? 0}
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

export default ArchiveEmployees;
