import {useNavigate} from "react-router";
import {Button, Form, Input, Modal, Upload} from "antd";
import {useMutation} from "react-query";
import {toast} from "react-toastify";
import Config from "../config";
import {UploadOutlined} from "@ant-design/icons";
import React from "react";
import API from "../APIs/API";
import {getAccessToken} from "../utils/helper";


export function useArchiveOffEmployee({redirectUrl} = {}) {
  const navigate = useNavigate();
  const archiveOffEmployee = useMutation({
    mutationFn: (data) => new API().archiveOff(data),
    onSuccess: (data) => {
      if (data != null) {
        toast.success("Employee restored successfully");
        if (redirectUrl) {
          navigate(redirectUrl);
        }
      } else {
        toast.error("Employee restore Failed!");
      }
    },
  });

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = (values, employee_no, modal) => {
    archiveOffEmployee.mutate({
      employee_no: employee_no,
      archived_reason: values.select,
      archived_comment: values.comment,
    })
    modal.destroy();
  };

  const [form] = Form.useForm();

  const handleArchiveOffEmployee = (e, employee_no) => {
    e.preventDefault();
    e.stopPropagation();
    const file_url = `${Config.api_url}v1/admin/employee/archive_file?employee_no=${employee_no}`;
    const modal = Modal.confirm({
      title: "Do you want to restore this record?",
      width: 500,
      content: (
        <Form
          form={form}
        >
          <Form.Item
            name="select"
            label="Select"
            hasFeedback
            rules={[{required: true, message: 'Please select the reason!'}]}
          >
            <div className="form-outline">
              <select
                className="form-select"
                placeholder="Please select the reason"
              >
                <option value={'rehire'}>Rehired</option>
                <option value={'retrench'}>Reinstated</option>
                <option value={'contract'}>Contract</option>
              </select>
            </div>
          </Form.Item>
          <Form.Item
            name="document"
            label="Document"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{required: true, message: 'Please select the document!'}]}
          >
            <Upload
              name="archived_file"
              action={file_url}
              listType="picture"
              multiple={false}
              maxCount={1}
              headers={{
                Origin: Config.api_url,
                Accept: "application/json",
                Authorization: getAccessToken(),
              }}
            >
              <Button icon={<UploadOutlined/>}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="comment"
            label="Comment"
            rules={[{required: true, message: 'Please select the document!'}]}
          >
            <Input.TextArea/>
          </Form.Item>
        </Form>
      ),
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: (e) => {
        form
          .validateFields()
          .then((values) => {
            onFinish(values, employee_no, modal);
            form.resetFields();
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      },
    });
  }

  return {handleArchiveOffEmployee};
}