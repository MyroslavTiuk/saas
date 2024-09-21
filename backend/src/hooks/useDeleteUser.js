import {useMutation, useQueryClient} from "react-query";
import {useNavigate} from "react-router";
import {Modal} from "antd";
import {toast} from "react-toastify";
import API from "../APIs/API";

export function useDeleteUser({redirectUrl} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deleteUser = useMutation({
    mutationFn: (user_id) => new API().deleteAdminUser(user_id),
    onSuccess: (data) => {
      if (data != null) {
        toast.success("User deleted successfully");
        queryClient.invalidateQueries("users");

        if (redirectUrl) {
          navigate(redirectUrl);
        }
      } else {
        toast.success("Failed to delete User");
      }
    },
  });

  const handleDeleteUser = (e, user_id) => {
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
  };

  return {handleDeleteUser};
}
