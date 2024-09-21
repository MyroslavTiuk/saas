import {useState} from "react";
import {Modal} from "antd";
import {useQueryClient} from "react-query";
import Config from "../config";
import {UploadFile} from "./UploadFile";

export function UploadExcel({adminLocationId}) {
  const url = `${Config.api_url}v1/admin/excel/import?admin_location_id=${adminLocationId}`;
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleUploadExcelClose = () => {
    setIsModalOpen(false);
    queryClient.invalidateQueries("employees");
  };

  return (
    <>
      <Modal
        title="Upload Excel"
        open={isModalOpen}
        onOk={handleUploadExcelClose}
        onCancel={handleUploadExcelClose}
      >
        <UploadFile invalidateQueries="employees" url={url} name="csv_file"/>
      </Modal>
      <button
        className="addBtn"
        style={{marginRight: 10}}
        onClick={showModal}
      >
        Excel Import
      </button>
    </>
  );
}
