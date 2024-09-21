import { Upload, Button, message } from "antd";
import { useQueryClient } from "react-query";
import { UploadOutlined } from "@ant-design/icons";
import Config from "../config";
import {getAccessToken} from "../utils/helper";

export function UploadFile({ invalidateQueries, url, name = "file" }) {
  const queryClient = useQueryClient();
  const handleChange = (info) => {
    if (
      info.file.status === "done" &&
      info.file.response?.errors &&
      info.file.response.errors.length > 0
    ) {
      // Need this to show error messages from uploading excel
      message.error(
        <>
          <div>{info.file.name} file upload with errors:</div>
          {info.file.response.errors.map((msg) => (
            <div>{msg}</div>
          ))}
        </>
      );
      queryClient.invalidateQueries(invalidateQueries);
    } else if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      queryClient.invalidateQueries(invalidateQueries);
    } else if (info.file.status === "error") {
      message.error(
        info.file.response?.message ?? `${info.file.name} file upload failed.`
      );
      queryClient.invalidateQueries(invalidateQueries);
    }
  };

  return (
    <Upload
      name={name}
      action={url}
      headers={{
        Origin: Config.api_url,
        Accept: "application/json",
        Authorization: getAccessToken(),
      }}
      onChange={handleChange}
    >
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  );
}
