import React from "react";
import {useMutation} from "react-query";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";
import {Button, Form, Modal, Upload, Input} from "antd";
import {UploadOutlined} from '@ant-design/icons';
import Config from "../config";
import {getAccessToken} from "../utils/helper";
import API from "../APIs/API";


export function useArchiveEmployee({redirectUrl} = {}) {
  const navigate = useNavigate();
  const archiveEmployee = useMutation({
    mutationFn: (data) => new API().archiveOn(data),
    onSuccess: (data) => {
      if (data != null) {
        toast.success("Employee archived successfully");
        if (redirectUrl) {
          navigate(redirectUrl);
        }
      } else {
        toast.error("Employee archived Failed!");
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
    archiveEmployee.mutate({
      employee_no: employee_no,
      archived_reason: values.select,
      archived_comment: values.comment,
    })
    modal.destroy();
  };

  const [form] = Form.useForm();

  const handleArchiveEmployee = (e, employee_no) => {
    e.preventDefault();
    e.stopPropagation();
    const file_url = `${Config.api_url}v1/admin/employee/archive_file?employee_no=${employee_no}`;
    const modal = Modal.confirm({
      title: "Do you want to archive this record?",
      width: 500,
      content: (
        <Form
          form={form}
        >
          <Form.Item
            name="select"
            label="Select"
            size
            rules={[{required: true, message: 'Please select the reason!'}]}
          >
            <div className="form-outline">
              <select
                className="form-select"
                placeholder="Please select the reason"
              >
                <option value={'retire'}>Retire</option>
                <option value={'retrench'}>Retrench</option>
                <option value={'resign'}>Resign</option>
                <option value={'terminated'}>Terminated</option>
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

  return {handleArchiveEmployee};
}