import {useMutation} from "react-query";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";
import {Modal} from "antd";
import API from "../APIs/API";

export function useDeleteEmployee({redirectUrl} = {}) {
  const navigate = useNavigate();
  const deleteEmployee = useMutation({
    mutationFn: (employee_no) => new API().deleteEmployee(employee_no),
    onSuccess: (data) => {
      if (data != null) {
        toast.success("Employee deleted successfully");
        if (redirectUrl) {
          navigate(redirectUrl);
        }
      } else {
        toast.error("Employee deleted Failed!");
      }
    },
  });

  const handleDeleteEmployee = (e, employee_no) => {
    e.preventDefault();
    e.stopPropagation();

    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to delete this record?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        deleteEmployee.mutate(employee_no);
      },
    });
  }

  return {handleDeleteEmployee};
}