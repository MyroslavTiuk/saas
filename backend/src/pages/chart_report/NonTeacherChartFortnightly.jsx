import {useMemo} from "react";
import {useQuery} from "react-query";
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
import {Link} from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Sidebar from "../../components/Sidebar";

import "../../styles/datatable.scss";
import API from "../../APIs/API";
import {toHoursAndMinutes} from "../../utils/helper";

const NonTeacherChartFortnightly = () => {
  const {data: attendances = []} = useQuery([
    "non-teacher/chart/fortnightly",
  ], {
    queryFn: async () => {
      return await new API().getNonTeacherChartFortnightly();
    }
  });
  const transformedAttendances = useMemo(
    () =>
      attendances.map((attendance) => ({
        ...attendance,
        avg_hours: attendance.count === 0 ? 0 : (Math.floor(attendance.avg / attendance.count / 60) / 60),
        avg_time: attendance.count === 0 ? 0 : (Math.floor(attendance.avg / attendance.count)),
      })),
    [attendances]
  );

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
                <Link to="/non_teacher_report" className="backButtonSection">
                  <KeyboardBackspaceIcon className="backButton"/>
                </Link>
                <br/>
                <br/>
                <div className="datatableTitle">
                  Non Teacher Fortnightly Report
                </div>
                <br/>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={transformedAttendances}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis yAxisId="left"/>
                    <YAxis yAxisId="right" orientation="right"/>
                    <Tooltip
                      formatter={(value, name, {payload}) => [
                        name === "Average time"
                          ? toHoursAndMinutes(payload.avg_time)
                          : value,
                        name,
                      ]}
                    />
                    <Legend/>
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

export default NonTeacherChartFortnightly;
