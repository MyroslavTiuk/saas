import {useMutation, useQueryClient} from "react-query";
import {useNavigate} from "react-router";
import API from "../APIs/API";
import {toast} from "react-toastify";
import {Modal} from "antd";

export function useRestoreAdminLocationUser({redirectUrl} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const restoreUser = useMutation({
    mutationFn: (user_id) => new API().restoreAdminLocationUser(user_id),
    onSuccess: (data) => {
      if (data != null) {
        toast.success("User restore successfully");
        queryClient.invalidateQueries("managers");

        if (redirectUrl) {
          navigate(redirectUrl);
        }
      } else {
        toast.success("Failed to restore User");
      }
    },
  });

  const handleRestoreAdminLocationUser = (e, user_id) => {
    e.preventDefault();
    e.stopPropagation();

    Modal.confirm({
      title: "Are you sure?",
      content: "Are you sure you want to restore this user?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        restoreUser.mutate(user_id);
      },
    });
  }
  return {handleRestoreAdminLocationUser};
}