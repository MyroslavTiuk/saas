import {useMutation, useQueryClient} from "react-query";
import {useNavigate} from "react-router";
import {Modal} from "antd";
import API from "../APIs/API";
import {toast} from "react-toastify";

export function useRestoreUser({redirectUrl} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const restoreUser = useMutation({
    mutationFn: (user_id) => new API().restoreAdminUser(user_id),
    onSuccess: (data) => {
      if (data != null) {
        toast.success("User restore successfully");
        queryClient.invalidateQueries("users");

        if (redirectUrl) {
          navigate(redirectUrl);
        }
      } else {
        toast.success("Failed to restore User");
      }
    },
  });

  const handleRestoreUser = (e, user_id) => {
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

  return {handleRestoreUser};
}