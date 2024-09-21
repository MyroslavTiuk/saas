import {useMutation, useQueryClient} from "react-query";
import {useNavigate} from "react-router";
import API from "../APIs/API";
import {toast} from "react-toastify";
import {Modal} from "antd";

export function useDeleteAdminLocationUser({redirectUrl} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deleteUser = useMutation({
    mutationFn: (user_id) => new API().deleteAdminLocationUser(user_id),
    onSuccess: (data) => {
      if (data != null) {
        toast.success("User deleted successfully");
        queryClient.invalidateQueries("managers");

        if (redirectUrl) {
          navigate(redirectUrl);
        }
      } else {
        toast.success("Failed to delete User");
      }
    },
  });

  const handleDeleteAdminLocationUser = (e, user_id) => {
    e.preventDefault();
    e.stopPropagation();

    Modal.confirm({
      title: "Are you sure?",
      content: "Are you sure you want to delete this user?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        deleteUser.mutate(user_id);
      },
    });
  }

  return {handleDeleteAdminLocationUser};
}