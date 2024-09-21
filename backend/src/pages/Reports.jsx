import React from "react";
import {Stack, Button} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {useMe} from "../hooks/useMe";
import "../styles/reports.scss";

const ReportPart = ({name = "", label, variant = "chart"}) => {
  return (
    <Stack key={name} spacing={2}>
      <div className="reportsTitle">{label}</div>
      <Button
        component={Link}
        to={`/reports/table/daily/${name}`}
        variant="outlined"
      >
        Daily Attendance Reports
      </Button>
      <Button
        component={Link}
        to={`/reports/${variant}/weekly/${name}`}
        variant="outlined"
      >
        Weekly Attendance Reports
      </Button>
      <Button
        component={Link}
        to={`/reports/${variant}/fortnightly/${name}`}
        variant="outlined"
      >
        Fortnightly Attendance Reports
      </Button>
      <Button
        component={Link}
        to={`/reports/${variant}/monthly/${name}`}
        variant="outlined"
      >
        Monthly Attendance Reports
      </Button>
    </Stack>
  );
};

const ReportPartTopLevel = ({name = "", label}) => {
  return (
    <Stack key={name} spacing={2}>
      <div className="reportsTitle">{label}</div>
      <Button
        component={Link}
        to={`/reports/daily/${name}`}
        variant="outlined"
      >
        Daily Attendance Reports
      </Button>
      <Button
        component={Link}
        to={`/reports/weekly/${name}`}
        variant="outlined"
      >
        Weekly Attendance Reports
      </Button>
      <Button
        component={Link}
        to={`/reports/fortnightly/${name}`}
        variant="outlined"
      >
        Fortnightly Attendance Reports
      </Button>
      <Button
        component={Link}
        to={`/reports/monthly/${name}`}
        variant="outlined"
      >
        Monthly Attendance Reports
      </Button>
    </Stack>
  );
};

const Reports = () => {
  const {permissions} = useMe();
  const {usertype, admin_location_id} = useParams();
  const params = [usertype, admin_location_id].filter(Boolean).join("/");

  // const

  return (
    <div className="wrapper">
      <div className="sidebar">
        <Sidebar/>
      </div>
      <div className="content reports">
        {permissions.superRead && !params && (
          <Stack direction="column" spacing={2}>
            <Stack spacing={2}>
              <div className="reportsTitle">
                Master Reports
              </div>
              <Button
                component={Link}
                to="/reports/chart/daily"
                variant="outlined"
              >
                Daily Attendance Reports
              </Button>
              <Button
                component={Link}
                to="/reports/chart/weekly"
                variant="outlined"
              >
                Weekly Attendance Reports
              </Button>
              <Button
                component={Link}
                to="/reports/chart/fortnightly"
                variant="outlined"
              >
                Fortnightly Attendance Reports
              </Button>
              <Button
                component={Link}
                to="/reports/chart/monthly"
                variant="outlined"
              >
                Monthly Attendance Reports
              </Button>
            </Stack>
            <Stack spacing={2}>
              <div className="reportsTitle">Groups Reports</div>
              <Stack direction="row" spacing={2}>
                {[
                  ["Teachers", "teachers"],
                  ["Non-Teachers", "non-teachers"],
                ].map(([label, name]) => (
                  <ReportPart key={name} name={name} label={label}/>
                ))}
              </Stack>
            </Stack>
          </Stack>
        )}
        {params && (
          <Stack spacing={2}>
            <ReportPartTopLevel
              name={params}
              label="Admin location level report"
            />
          </Stack>
        )}
      </div>
    </div>
  );
};

export default Reports;
