import {useState, useMemo} from "react";
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
import {Stack} from "@mui/material";
import Sidebar from "../../components/Sidebar";

import "../../styles/datatable.scss";
import API from "../../APIs/API";
import moment from "moment";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {toHoursAndMinutes} from "../../utils/helper";

const SuperReadChartDaily = () => {
  const [target, setTarget] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const {data: attendances = []} = useQuery([
    "super/read/chart/daily", target,
  ], {
    queryFn: async () => {
      return await new API().getSuperReadChartDaily(target);
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
  const handleChange = (e) => {
    setTarget(e.format("YYYY-MM-DD"));
  };

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
                <Link to="/super_read_report" className="backButtonSection">
                  <KeyboardBackspaceIcon className="backButton"/>
                </Link>
                <br/>
                <br/>
                <div className="datatableTitle">
                  Master Daily Report
                  <Stack direction="row" spacing={2}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label={'Select the Month'}
                        views={['year', 'month']}
                        value={dayjs(target)}
                        onAccept={handleChange}
                      />
                    </DemoContainer>
                  </Stack>
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

export default SuperReadChartDaily;
