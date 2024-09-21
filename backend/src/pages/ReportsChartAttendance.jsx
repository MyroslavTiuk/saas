import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import {
  ComposedChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Line,
  Legend,
  Tooltip,
} from "recharts";
import { Link } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Stack } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { makeQueryString } from "../APIs/request";
import { USER_TYPE_FROM_KEY } from "../constants";

import "../styles/datatable.scss";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function toHoursAndMinutes(totalSeconds) {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}

const ReportsChartAttendance = () => {
  const [filters, setFilters] = useState({ start: "", end: "" });
  const { admin_location_id, period, usertype } = useParams();
  const { data: attendances = [] } = useQuery([
    "attendance/chart",
    makeQueryString(
      {
        admin_location_id,
        period,
        "$employee.user_type$": USER_TYPE_FROM_KEY[usertype],
      },
      filters
    ),
  ]);
  const transformedAttendances = useMemo(
    () =>
      attendances.map((attendance) => ({
        ...attendance,
        avg_hours: Math.floor(attendance.avg_time / 60) / 60,
      })),
    [attendances]
  );
  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="wrapper">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="content">
        <div className="reports">
          <div className="reportsContainer">
            <div className="reportsSection">
              <div className="datatable">
                <Link to="/reports" className="backButtonSection">
                  <KeyboardBackspaceIcon className="backButton" />
                </Link>
                <br />
                <br />
                <div className="datatableTitle">
                  {capitalizeFirstLetter(period)} Attendance Reports{" "}
                  {usertype ? `for ${USER_TYPE_FROM_KEY[usertype]}` : ""}
                  <Stack direction="row" spacing={2}>
                    <div className="form-outline">
                      <input
                        className="form-control"
                        type="date"
                        name="start"
                        min="2000-01-01"
                        max="2050-12-31"
                        value={filters.start}
                        onChange={handleChange}
                      />
                    </div>
                    <div>:</div>
                    <div className="form-outline">
                      <input
                        className="form-control"
                        type="date"
                        name="end"
                        min="2000-01-01"
                        max="2050-12-31"
                        value={filters.end}
                        onChange={handleChange}
                      />
                    </div>
                  </Stack>
                </div>
                <br />
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={transformedAttendances}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="start_date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name, { payload }) => [
                        name === "Average time"
                          ? toHoursAndMinutes(payload.avg_time)
                          : value,
                        name,
                      ]}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="avg_hours"
                      fill="#add8e6"
                      name="Average time"
                    />
                    <Line
                      yAxisId="right"
                      dataKey="count"
                      stroke="#ff7300"
                      strokeWidth={2}
                      name="Attendance"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsChartAttendance;
