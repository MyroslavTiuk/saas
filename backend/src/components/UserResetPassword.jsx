import {useState} from "react";
import {useMutation} from "react-query";
import {toast} from "react-toastify";
import {useFormValues} from "../hooks/useFormValues";
import {FieldText} from "./fields/FieldText";
import API from "../APIs/API";

const INITIAL_VALUES = {
  old_password: "",
  new_password: "",
  confirm_password: "",
};

export function UserResetPassword() {
  const [isShowButton, setIsShowButton] = useState(true);
  const {formValues, handleChange} = useFormValues(INITIAL_VALUES);
  const resetPassword = useMutation({
    mutationFn: (body) => new API().resetPassword(body),
    onSuccess: (data) => {
      if (data) {
        toast.success("Password successfully updated");
        setIsShowButton(true);
      } else {
        toast.error("Please enter the correct password");
      }
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formValues.new_password !== formValues.confirm_password) {
      toast.warning("The passwords don’t match");
      return;
    }

    resetPassword.mutate({...formValues});
  };

  if (isShowButton) {
    return (
      <button
        className="app-button app-button-primary"
        onClick={() => setIsShowButton(false)}
      >
        Reset Password
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldText
        label="Old password"
        name="old_password"
        type="password"
        onChange={handleChange}
        required
      />
      <FieldText
        label="New password"
        name="new_password"
        type="password"
        onChange={handleChange}
        required
      />
      <FieldText
        label="Confirm password"
        name="confirm_password"
        type="password"
        onChange={handleChange}
        required
      />
      <button className="app-button app-button-primary">Submit</button>
    </form>
  );
}
