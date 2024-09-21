import Sidebar from "../components/Sidebar";
import React, {useMemo} from "react";
import {Link, useParams} from "react-router-dom";
import {IconButton} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DownloadIcon from "@mui/icons-material/Download";
import {useQuery} from "react-query";
import {saveAs} from "file-saver";
import JSzip from "jszip";
import QRCode from "qrcode";
import {makeQueryString} from "../APIs/request";
import {usePaginationParams} from "../hooks/usePaginationParams";
import "../styles/list.scss";
import API from "../APIs/API";

async function downloadQRcodes(employees) {
  const zip = JSzip();

  await Promise.all(
    employees.map(async (employee) => {
      const data = await QRCode.toDataURL(employee.employee_no);
      zip.file(employee.name_report + ".png", data.split(",")[1], {
        base64: true,
      });
    })
  );

  const content = await zip.generateAsync({type: "blob"});
  saveAs(content, "qrcodes.zip");
}

const QRCodes = ({type}) => {
  const {admin_location_id} = useParams();
  const {gridParams, queryParams} = usePaginationParams();
  const [selectionModel, setSelectionModel] = React.useState([]);

  const pageUserType = type === "Non-Teacher" ? "non-teachers" : "teachers";
  const {data: employees, isFetching} = useQuery(
    [
      "employees",
      makeQueryString(queryParams, {admin_location_id,}),
    ],
    {
      queryFn: async () => {
        const queryString = makeQueryString(queryParams, {admin_location_id});
        const result = await new API().getAllEmployees(queryString);
        if (result != null) {
          return result;
        }
        return [];
      },
      keepPreviousData: true,
    }
  );
  const handleDownloadQRcode = (row) => {
    downloadQRcodes([row]);
  };
  const handleDownloadAll = () => {
    if (!employees) {
      return;
    }

    if (selectionModel.length) {
      downloadQRcodes(
        selectionModel
          .map((employeeId) =>
            employees.rows.find((employee) => employee.id === employeeId)
          )
          .filter(Boolean)
      );
    } else {
      downloadQRcodes(employees.rows);
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "actions",
        headerName: "",
        width: 60,
        renderCell: (params) => (
          <IconButton onClick={() => handleDownloadQRcode(params.row)}>
            <DownloadIcon/>
          </IconButton>
        ),
      },
      {
        field: "employee_no",
        headerName: "Employee No",
        width: 200,
      },
      {
        field: "name_report",
        headerName: "Name Report",
        width: 260,
      },
    ],
    []
  );

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
                {`${type} Employees QR codes`}
                <button className="addBtn" onClick={handleDownloadAll}>
                  Download all
                </button>
              </div>
              <br/>

              <DataGrid
                className="datagrid"
                rows={employees?.rows || []}
                columns={columns}
                rowCount={employees?.count ?? 0}
                loading={isFetching}
                checkboxSelection
                onSelectionModelChange={(newSelectionModel) => {
                  setSelectionModel(newSelectionModel);
                }}
                selectionModel={selectionModel}
                {...gridParams}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodes;
