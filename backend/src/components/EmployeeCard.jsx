import { useEffect, useState } from "react";
import QRCode from "qrcode";
import moment from "moment";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Link as MuiLink, Stack, Switch, Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import { useMutation, useQuery } from "react-query";
import { usePaginationParams } from "../hooks/usePaginationParams";
import { makePutRequest, makeQueryString } from "../APIs/request";
import { useMe } from "../hooks/useMe";
import { toHoursAndMinutesAndSeconds, getTotalHours } from "../utils/dates";

const employeeColumns = [
  {
    field: "date",
    headerName: "Work day",
    width: 200,
    renderCell: (params) => <p>{moment(params.value).format("DD/MM/YYYY")}</p>,
  },
  {
    field: "clocked_in",
    headerName: "Clock In",
    width: 150,
    renderCell: (params) => (
      <p>{moment(params.value, "hh:mm:ss").format("hh:mm:ss A")}</p>
    ),
  },
  {
    field: "clocked_out",
    headerName: "Clock Out",
    width: 150,
    renderCell: (params) => (
      <p>{moment(params.value, "hh:mm:ss").format("hh:mm:ss A")}</p>
    ),
  },
  {
    field: "worked_hours",
    headerName: "Work Hours",
    width: 150,
  },
  {
    field: "total_under_time",
    headerName: "Total Under Time",
    width: 150,
    valueGetter: ({ row }) =>
      toHoursAndMinutesAndSeconds(
        getTotalHours(moment(row.date), row, "undertime")
      ),
  },
  {
    field: "total_overtime",
    headerName: "Total Overtime",
    width: 150,
    valueGetter: ({ row }) =>
      toHoursAndMinutesAndSeconds(
        getTotalHours(moment(row.date), row, "overtime")
      ),
  },
];

function secondsToHM(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);

  return `${hours} Hours ${minutes} mins`;
}

export function EmployeeCard({ employee, backLink, setEmployee }) {
  const { permissions } = useMe();
  const { gridParams, queryParams } = usePaginationParams();
  const { data: attendance, isFetching } = useQuery(
    [
      "attendance",
      makeQueryString(queryParams, {
        "$employee.id$": employee.id,
        order: "date,desc",
      }),
    ],
    { enabled: !!employee.id }
  );
  const { data: attendancesSummary = [] } = useQuery(
    ["attendance", employee.employee_no, "summary"],
    { enabled: !!employee.id }
  );
  const [activeStatus, setActiveStatus] = useState(false);
  const updateEmployee = useMutation(
    (data) => makePutRequest("/employees", data),
    {
      onSuccess: () => {
        toast.success("Successfully updated data");

        setEmployee((prev) => ({
          ...prev,
          status: activeStatus ? "Active" : "Inactive",
        }));
      },
    }
  );
  const [src, setSrc] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    updateEmployee.mutate({
      ...employee,
      status: activeStatus ? "Active" : "Inactive",
    });
  };
  const handleOpenQRCode = (e) => {
    e.preventDefault();
    Modal.confirm({
      title: "Employee QR Code",
      okText: "Download",
      cancelText: "Close",
      content: (
        <div>
          <img src={src} style={{ width: 320, height: 320 }} alt="QR Code" />
        </div>
      ),
      onOk() {
        // data.split(",")[1]
        saveAs(src, employee.name_report + ".png");
      },
    });
  };

  useEffect(() => {
    setActiveStatus(employee.status === "Active");
  }, [employee.status]);

  useEffect(() => {
    if (employee) {
      QRCode.toDataURL(employee.employee_no).then((data) => {
        setSrc(data);
      });
    } else {
      setSrc("");
    }
  }, [employee]);

  return (
    <Stack spacing={4}>
      <Stack component="form" onSubmit={handleSubmit}>
        <Stack direction="row" spacing={4}>
          <Stack>
            <Stack direction="row">
              <Typography width={240} fontWeight="bold">
                Account status:
              </Typography>
              <Switch
                checked={activeStatus}
                onChange={() => setActiveStatus(!activeStatus)}
              />
            </Stack>
            <Stack direction="row">
              <Typography width={240} fontWeight="bold">
                QRCode:
              </Typography>
              <Stack>
                <Typography variant="body2">
                  QR Code data: <b>{employee.id}</b>
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <img
                    src={src}
                    style={{ width: 60, height: 60 }}
                    alt="QR Code"
                  />
                  <MuiLink href="#" underline="none" onClick={handleOpenQRCode}>
                    Open QR Code
                  </MuiLink>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack>
            {attendancesSummary.map((summary, idx) => (
              <Stack direction="row" key={idx} spacing={2}>
                <Typography color="primary">
                  {summary.name}: {summary.period}
                </Typography>
                <Typography>{secondsToHM(summary.totalSeconds)}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
        <Stack direction="row">
          {permissions.super && (
            <button
              className="app-button app-button-primary"
              style={{ marginRight: 10 }}
            >
              Save
            </button>
          )}
          <Link className="app-button app-button-gray" to={backLink}>
            Back
          </Link>
        </Stack>
      </Stack>
      <Box height={30} bgcolor="rgb(244, 244, 244)" />
      <Box height={320}>
        <Typography variant="h6" marginBottom={2}>
          Attendance
        </Typography>
        <DataGrid
          rows={attendance?.rows || []}
          columns={employeeColumns}
          rowCount={attendance?.count ?? 0}
          loading={isFetching}
          {...gridParams}
        />
      </Box>
    </Stack>
  );
}
