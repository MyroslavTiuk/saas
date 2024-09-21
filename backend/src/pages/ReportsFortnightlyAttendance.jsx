import React, {useState, useMemo} from "react";
import {useParams} from "react-router-dom";
import {DataGrid} from "@mui/x-data-grid";
import {useQuery} from "react-query";
import {Link} from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import moment from "moment";
import {useDebounce} from "../hooks/useDebounce";
import Sidebar from "../components/Sidebar";
import {usePaginationParams} from "../hooks/usePaginationParams";
import {makeQueryString} from "../APIs/request";
import {USER_TYPE_FROM_KEY} from "../constants";
import {
  calculatePeriodWorkedTimes,
  calculatePeriodUnderTime,
  calculatePeriodOverTime,
  calculatePeriodSaturdayHours, calculatePeriodSundayHours, calculatePeriodActualHours,
} from "../utils/dates";

import "../styles/list.scss";
import "../styles/datatable.scss";
import "../styles/reports.scss";
import {Autocomplete} from "@mui/material";
import TextField from "@mui/material/TextField";
import Config from "../config";
import API from "../APIs/API";
import {AuthenticatedLink} from "../components/AuthenticatedLink";
import {EmployeeReportLink} from "../components/EmployeeReportLink";

const ReportsFortnightlyAttendance = () => {
  const {gridParams, queryParams} = usePaginationParams({
    initialSortModel: [{field: "name_report", sort: "asc"}],
  });
  const {admin_location_id, usertype} = useParams();
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 1000);
  const [payNoSelect, setPayNoSelect] = useState({label: "", id: -1});
  const {data: payloads, isPayloadFetching} = useQuery([
    "payloads",
  ], {
    queryFn: async () => {
      const result = await new API().getPayloads();
      if (result != null) {
        return result["data"];
      }
      return [];
    }
  });
  const {data: attendance, isFetching} = useQuery([
    "attendance_fortnightly",
    makeQueryString(
      queryParams,
      {
        admin_location_id: admin_location_id,
        search: searchDebounced,
        pay_no: payNoSelect.id,
      },
    ),
  ], {
    queryFn: async () => {
      const queryString = makeQueryString(
        queryParams,
        {
          admin_location_id: admin_location_id,
          search: searchDebounced,
          pay_no: payNoSelect.id,
        },
      );
      const result = await new API().getAttendanceFortnightly(queryString);
      if (result != null) {
        return result;
      }
      return [];
    },
  });

  const dates = useMemo(() => {
    if (!attendance) {
      return [];
    }
    // that is for PNG country. dont change it.
    const momentDate = moment(attendance.payload.start_at);
    const length = 14;
    return Array.from({length}).map(() => momentDate.add(1, "days").clone());
  }, [attendance]);

  const getGeneralReportURL = () => {
    let url = Config.api_url + "/v1/admin/report/print_fortnightly?pay_no=" + payNoSelect.id;
    if (admin_location_id !== undefined) {
      url += "&admin_location_id=" + admin_location_id;
    }
    return url;
  }

  const getEmployeeReportURL = (row) => {
    let url = Config.api_url + "/v1/admin/report/employee/print_fortnightly?pay_no=" + payNoSelect.id;
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
            filename={`fortnightly_${row.name_report}`}
          >
            Print Report
          </EmployeeReportLink>
        </div>
      ),
    },
  ];

  const reportsColumns = [
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
      field: "admin_desc",
      headerName: "Admin Desc",
      width: 300,
    },
    {
      field: "occup_pos_title",
      headerName: "Occup Pos Title",
      width: 200,
    },
    ...dates.map((date) => ({
      field: `date.${date}`,
      headerName: "Date",
      width: 220,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderHeader: () => (
        <div className="reportsHeaderDate">
          <p>{date.format("dddd")}</p>
          <p>{date.format("DD/MM/YYYY")}</p>
          <p>Clock-In : Clock-Out</p>
        </div>
      ),
      renderCell: ({row: {dates}}) => {
        const cellDate = dates[date.format("YYYY-MM-DD")];

        if (!cellDate) {
          return "-";
        }

        const clockedIn = cellDate.clocked_in
          ? moment(cellDate.clocked_in, "hh:mm:ss").format("hh:mm:ss A")
          : "-";
        const clockedOut = cellDate.clocked_out
          ? moment(cellDate.clocked_out, "hh:mm:ss").format("hh:mm:ss A")
          : "-";

        return `${clockedIn} : ${clockedOut}`;
      },
    })),
    {
      field: "total_hours",
      headerName: "Total Hours",
      width: 150,
      valueGetter: ({row}) => calculatePeriodWorkedTimes(dates, row.dates),
    },
    {
      field: "total_actual_hours",
      headerName: "Total Actual Hours",
      width: 150,
      valueGetter: ({row}) => calculatePeriodActualHours(dates, row.dates),
    },
    {
      field: "total_under_time",
      headerName: "Total Under Time",
      width: 150,
      valueGetter: ({row}) => calculatePeriodUnderTime(dates, row.dates),
    },
    {
      field: "total_overtime",
      headerName: "Total Overtime",
      width: 150,
      valueGetter: ({row}) => calculatePeriodOverTime(dates, row.dates),
    },
    {
      field: "saturday_hours",
      headerName: "Total Saturday Hours",
      width: 170,
      valueGetter: ({row}) => calculatePeriodSaturdayHours(dates, row.dates),
    },
    {
      field: "sunday_hours",
      headerName: "Total Sunday Hours",
      width: 150,
      valueGetter: ({row}) => calculatePeriodSundayHours(dates, row.dates),
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
                <div className="datatableTitle" style={{marginBottom: "20px"}}>
                  Fortnightly Attendance Reports{" "}
                  {usertype ? `for ${USER_TYPE_FROM_KEY[usertype]}` : ""}
                </div>
                <div className="my-2">
                  <span>{attendance ? `${moment.utc(attendance.payload.start_at).format("DD/MM/YYYY")} ~ ${moment.utc(attendance.payload.end_at).format('DD/MM/YYYY')}` : ''}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <div className="d-flex justify-content-start gap-3">
                    <Autocomplete
                      disablePortal
                      id="combo-box"
                      sx={{width: 200}}
                      disabled={isPayloadFetching}
                      renderInput={(params) => (
                        <TextField {...params} label="Pay no"/>
                      )}

                      options={payloads ? payloads : []}
                      onChange={(e, value) => {
                        setPayNoSelect(value);
                      }}
                      disableClearable
                      value={attendance ? {
                        label: `Pay ${attendance.payload.pay_no} - ${moment(attendance.payload.end_at).format("YYYY")}`,
                        id: attendance.payload.id
                      } : payNoSelect}
                    />
                    <AuthenticatedLink url={getGeneralReportURL()} filename={`print_fortnightly`}>
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
                  columns={actionColumn.concat(reportsColumns)}
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

export default ReportsFortnightlyAttendance;
