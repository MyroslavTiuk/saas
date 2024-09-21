import {
  calculateDailyActualHours,
  calculateDailyHoursWorked,
  calculateDailyOverTime,
  calculateDailyUnderTime,
  isSaturday,
  isSunday,
  isWeekEnd
} from "./dates";
import moment from "moment/moment";
import React from "react";

export function getDailyReportRecords(inputDate) {
  if (!isWeekEnd(inputDate)) {
    return [
      {
        field: "employee_no",
        headerName: "Employee No",
        width: 150,
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
      {
        field: `date.${inputDate}`,
        headerName: "Date",
        width: 220,
        sortable: false,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <div className="reportsHeaderDate">
            <p>{moment(inputDate).format("dddd")}</p>
            <p>{moment(inputDate).format("DD/MM/YYYY")}</p>
            <p>Clock-In : Clock Out</p>
          </div>
        ),
        renderCell: ({row: {dates}}) => {
          const cellDate = dates[inputDate];

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
      },
      {
        field: "total_hours",
        headerName: "Hours Worked",
        width: 150,
        sortable: false,
        valueGetter: ({row}) => calculateDailyHoursWorked(inputDate, row.dates),
      },
      {
        field: "actual_hours",
        headerName: "Actual Hours",
        width: 150,
        sortable: false,
        valueGetter: ({row}) => calculateDailyActualHours(inputDate, row.dates),
      },
      {
        field: "total_under_time",
        headerName: "Under time",
        width: 150,
        sortable: false,
        valueGetter: ({row}) => calculateDailyUnderTime(inputDate, row.dates),
      },
      {
        field: "total_overtime",
        headerName: "Overtime",
        width: 150,
        sortable: false,
        valueGetter: ({row}) => calculateDailyOverTime(inputDate, row.dates),
      },
    ];
  }
  if (isSunday(inputDate)) {
    return [
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
        width: 350,
      },
      {
        field: `date.${inputDate}`,
        headerName: "Date",
        width: 220,
        sortable: false,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <div className="reportsHeaderDate">
            <p>{moment(inputDate).format("dddd")}</p>
            <p>{moment(inputDate).format("DD/MM/YYYY")}</p>
            <p>Clock-In : Clock Out</p>
          </div>
        ),
        renderCell: ({row: {dates}}) => {
          const cellDate = dates[inputDate];

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
      },
      {
        field: "sunday_hours",
        headerName: "Sunday Hours",
        sortable: false,
        width: 150,
        valueGetter: ({row}) => calculateDailyHoursWorked(inputDate, row.dates),
      },
    ];
  }

  if (isSaturday(inputDate)) {
    return [
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
        width: 350,
      },
      {
        field: `date.${inputDate}`,
        headerName: "Date",
        width: 220,
        sortable: false,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <div className="reportsHeaderDate">
            <p>{moment(inputDate).format("dddd")}</p>
            <p>{moment(inputDate).format("DD/MM/YYYY")}</p>
            <p>Clock-In : Clock Out</p>
          </div>
        ),
        renderCell: ({row: {dates}}) => {
          const cellDate = dates[inputDate];
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
      },
      {
        field: "saturday_hours",
        headerName: "Saturday Hours",
        sortable: false,
        width: 150,
        valueGetter: ({row}) => calculateDailyHoursWorked(inputDate, row.dates),
      },
    ];
  }
}