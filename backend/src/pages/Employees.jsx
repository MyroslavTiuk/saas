import Sidebar from "../components/Sidebar";
import React, {useState} from "react";
import {Link, useParams} from "react-router-dom";
import {DataGrid} from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {useQuery} from "react-query";
import {makeQueryString} from "../APIs/request";
import {EmployeeAction} from "../components/actions/EmployeeAction";
import {UploadExcel} from "../components/UploadExcel";
import {usePaginationParams} from "../hooks/usePaginationParams";
import {useMe} from "../hooks/useMe";
import "../styles/list.scss";
import API from "../APIs/API";
import moment from "moment";
import {ADMIN_LOCATION_LEVEL_USER_OPTIONS} from "../constants";

const employeeColumns = [
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
    width: 200,
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
          <p>{moment(row.date_of_birth).format("YYYY-MM-DD")}</p>
        </>
      );
    },
  },
  {
    field: "age",
    headerName: "Age",
    width: 100,
  },
  {
    field: "occup_pos_cat",
    headerName: "Occup Pos Cat",
    width: 200,
  },
  {
    field: "creator",
    headerName: "Created by",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: ({row}) => {
      return (<>
        <p>{row.status === true ? "Active" : "InActive"}</p>
      </>);
    }
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

const Employees = ({type}) => {
  const {admin_location_id} = useParams();
  const {gridParams, queryParams} = usePaginationParams();
  const [adminNoDesc, setAdminNoDesc] = useState("All");
  const [paypointDesc, setPaypointDesc] = useState("All");
  const {permissions, user: loggedUser} = useMe();

  const pageUserType = type === "Non-Teacher" ? "non-teachers" : "teachers";
  const {data: adminLocation} = useQuery(
    {
      queryFn: async () => {
        const result = await new API().getAdminLocationById(admin_location_id);
        if (result) {
          return result["data"];
        }
        return null;
      }
    }
  );
  const {data: accountNoDescList = []} = useQuery(["account_no_desc_list"], {
    queryFn: async () => {
      const result = await new API().getAccountNoDescList(admin_location_id);
      if (result) {
        if (loggedUser.admin_location_level_user === ADMIN_LOCATION_LEVEL_USER_OPTIONS.ACCOUNT_NO_DESC_USER) {
          setAdminNoDesc(loggedUser.account_no_desc);
        }
        return ["All", ...result["data"]];
      }
      return ["All"];
    }
  });
  const {data: employees = [], isFetching} = useQuery(
    [
      "employees",
      adminNoDesc,
      paypointDesc,
      makeQueryString(queryParams, {
        admin_location_id,
      }),
    ], {
      queryFn: async () => {
        let search = {};
        if (adminNoDesc !== 'All') {
          search["account_no_desc"] = adminNoDesc;
        }
        if (paypointDesc !== 'All') {
          search["paypoint_desc"] = paypointDesc;
        }
        const queryString = makeQueryString(queryParams, search, {
          admin_location_id,
        });
        const result = await new API().getAllEmployees(queryString);
        if (result != null) {
          return result;
        }
        return [];
      }
    },
    {keepPreviousData: true}
  );
  const {data: paypointDescList = []} = useQuery(["paypoint_desc_list"],
    {
      queryFn: async () => {
        const result = await new API().getPaypointDescList(admin_location_id, adminNoDesc);
        if (result) {
          if (loggedUser.admin_location_level_user === ADMIN_LOCATION_LEVEL_USER_OPTIONS.PAYPOINT_DESC_USER) {
            setAdminNoDesc(loggedUser.paypoint_desc);
          }
          return ["All", ...result["data"]];
        }
        return ["All"];
      },
      enabled: adminNoDesc !== "All",
    }
  );

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 120,
      sortable: false,
      renderCell: ({row}) => (
        <EmployeeAction row={row}/>
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
              <Link to={`/${pageUserType}`} className="backButtonSection">
                <KeyboardBackspaceIcon className="backButton"/>
              </Link>
              <br/>
              <br/>

              <div className="datatableTitle">
                {`${type} Employees`}
                <div>
                  {permissions.super && (
                    <>
                      <Link
                        to={`/${pageUserType}/${admin_location_id}/add`}
                        className="link"
                      >
                        <button className="addBtn">Add new</button>
                      </Link>
                      <UploadExcel adminLocationId={admin_location_id}/>
                    </>
                  )}
                </div>
              </div>

              <div className="searchSection">
                <div className="row">
                  <div className="col col-sm-4">
                    <TextField
                      id="outlined-disabled"
                      label="Admin desc"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      value={adminLocation?.admin_desc ?? ""}
                    />
                  </div>
                  <div className="col col-sm-4">
                    <Autocomplete
                      disablePortal
                      id="combo-box"
                      options={accountNoDescList}
                      fullWidth
                      disabled={(loggedUser.admin_location_level_user === ADMIN_LOCATION_LEVEL_USER_OPTIONS.ACCOUNT_NO_DESC_USER || loggedUser.admin_location_level_user === ADMIN_LOCATION_LEVEL_USER_OPTIONS.PAYPOINT_DESC_USER)}
                      renderInput={(params) => (
                        <TextField {...params} label="Account no desc"/>
                      )}
                      onChange={(e, value) =>
                        setAdminNoDesc(value)
                      }
                      disableClearable
                      value={adminNoDesc}
                    />
                  </div>
                  <div className="col col-sm-4">
                    <Autocomplete
                      hidden={adminNoDesc === "All"}
                      disablePortal
                      id="combo-box"
                      options={paypointDescList}
                      fullWidth
                      disabled={(loggedUser.admin_location_level_user === ADMIN_LOCATION_LEVEL_USER_OPTIONS.PAYPOINT_DESC_USER)}
                      renderInput={(params) => (
                        <TextField {...params} label="Paypoint desc"/>
                      )}
                      onChange={(e, value) =>
                        setPaypointDesc(value)
                      }
                      disableClearable
                      value={paypointDesc}
                    />
                  </div>
                </div>
              </div>
              <br/>
              <DataGrid
                className="datagrid"
                rows={employees?.rows || []}
                columns={actionColumn.concat(employeeColumns)}
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

export default Employees;
