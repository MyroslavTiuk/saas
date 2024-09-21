import React from "react";
import {Stack, Button} from "@mui/material";
import {Link} from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import "../../styles/reports.scss";

const SuperReadReports = () => {
  return (
    <div className="wrapper">
      <div className="sidebar">
        <Sidebar/>
      </div>
      <div className="content reports">
        <Stack direction="column" spacing={2}>
          <Stack spacing={2}>
            <div className="reportsTitle">
              Master Reports
            </div>
            <Button
              component={Link}
              to="/super_read_report/daily"
              variant="outlined"
            >
              Daily Attendance Reports
            </Button>
            <Button
              component={Link}
              to="/super_read_report/weekly"
              variant="outlined"
            >
              Weekly Attendance Reports
            </Button>
            <Button
              component={Link}
              to="/super_read_report/fortnightly"
              variant="outlined"
            >
              Fortnightly Attendance Reports
            </Button>
            <Button
              component={Link}
              to="/super_read_report/monthly"
              variant="outlined"
            >
              Monthly Attendance Reports
            </Button>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default SuperReadReports;
