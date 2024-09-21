import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {DataGrid} from "@mui/x-data-grid";
import {useQuery} from "react-query";
import {Link} from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {useDebounce} from "../hooks/useDebounce";
import Sidebar from "../components/Sidebar";
import {usePaginationParams} from "../hooks/usePaginationParams";
import {makeQueryString} from "../APIs/request";
import {USER_TYPE_FROM_KEY} from "../constants";
import {getCurrentDate} from "../utils/dates";

import "../styles/list.scss";
import "../styles/datatable.scss";
import "../styles/reports.scss";
import {getDailyReportRecords} from "../utils/report";
import Config from "../config";
import API from "../APIs/API";
import {AuthenticatedLink} from "../components/AuthenticatedLink";
import {EmployeeReportLink} from "../components/EmployeeReportLink";

const ReportsDailyAttendance = () => {
  const {gridParams, queryParams} = usePaginationParams();
  const {admin_location_id, usertype} = useParams();
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 1000);
  const [inputDate, setInputDate] = useState(() => getCurrentDate());
  const {data: attendance, isFetching} = useQuery([
    "attendances_daily",
    makeQueryString(
      queryParams,
      {
        admin_location_id: admin_location_id,
        search: searchDebounced,
        date: inputDate,
      },
    ),
  ], {
    queryFn: async () => {
      const queryString = makeQueryString(
        queryParams,
        {
          admin_location_id: admin_location_id,
          search: searchDebounced,
          date: inputDate,
        },
      );
      const result = await new API().getAttendanceDaily(queryString);
      if (result != null) {
        return result;
      }
      return [];
    },
  });

  const getGeneralReportURL = () => {
    let url = Config.api_url + "/v1/admin/report/print_daily?date=" + inputDate;
    if (admin_location_id !== undefined) {
      url += "&admin_location_id=" + admin_location_id;
    }
    return url;
  }

  const getEmployeeReportURL = (row) => {
    let url = Config.api_url + "/v1/admin/report/employee/print_daily?date=" + inputDate;
    url += `&employee_no=${row["employee_no"]}`;
    if (admin_location_id !== undefined) {
      url += "&admin_location_id=" + admin_location_id;
    }
    return url;
  }

  const actionColumn = [
    {
      field: "action",
      headerName: "Report",
      width: 120,
      sortable: false,
      renderCell: ({row}) => (
        <div className="cellAction">
          <EmployeeReportLink
            url={getEmployeeReportURL(row)}
            filename={`daily_${row.name_report}`}
          >
            Print Report
          </EmployeeReportLink>
        </div>
      ),
    },
  ];

  return (
    <div className="wrapper">
      <div className="sidebar">
        <Sidebar/>
      </div>
      <div className="content">
        <div className="reports">
          <div className="reportsContainer">
            <div className="reportsSection">
              <div className="datatable">
                <Link
                  to={`/reports/location-level/${usertype}/${admin_location_id}`}
                  className="backButtonSection"
                >
                  <KeyboardBackspaceIcon className="backButton"/>
                </Link>
                <br/>
                <br/>
                <div className="datatableTitle">
                  Daily Attendance Reports{" "}
                  {usertype ? `for ${USER_TYPE_FROM_KEY[usertype]}` : ""}
                </div>
                <div className="d-flex justify-content-between">
                  <div className="d-flex justify-content-start gap-3">
                    <div className="form-outline">
                      <input
                        className="form-control"
                        type={"date"}
                        name="date"
                        id="date"
                        min="2000-01-01"
                        max="2050-12-31"
                        value={inputDate || ""}
                        onChange={(e) => setInputDate(e.target.value)}
                      />
                    </div>
                    <AuthenticatedLink url={getGeneralReportURL()} filename={`print_daily_${inputDate}`}>
                      Print Report
                    </AuthenticatedLink>
                  </div>
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
                  rows={attendance?.rows || []}
                  columns={actionColumn.concat(getDailyReportRecords(inputDate))}
                  rowCount={attendance?.count ?? 0}
                  loading={isFetching}
                  getRowId={(row) => row.id}
                  {...gridParams}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDailyAttendance;
