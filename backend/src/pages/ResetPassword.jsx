import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import API from "../APIs/API";

const initialUserData = {
  email: "",
  verify_token: "",
  password: "",
  confirm_password: "",
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(initialUserData);
  const params = useParams();

  useEffect(() => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      verify_token: params.token,
      email: params.email.replace("%dot%", "."),
    }));
  }, [params]);

  const handleChange = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (userData?.password !== userData?.confirm_password) {
        toast.warning("The passwords you entered do not match.");
        return;
      }
      const result = await new API().forgetPasswordSetPassword(userData);
      if (result != null) {
        toast.success("Update Password Successfully!", {
          onClose: () => {
            navigate("/login", 2000);
          },
        });
      } else {
        toast.error("Update Password Failed!");
      }
    }
  ;

  return (
    <div className="login-page">
      <div className="box-form">
        <div className="left">
          <div className="overlay">
            <h1>PNG Time Access</h1>
            <p>Reset Password</p>
          </div>
        </div>
        <div className="right">
          <h5>Password</h5>
          <h4>{userData.email}</h4>
          <div className="inputs">
            <div>
              <input
                className="form-control"
                type="password"
                placeholder="Enter password"
                name="password"
                id="password"
                value={userData?.password}
                onChange={(e) => handleChange(e)}
                required
              />
            </div>
            <div>
              <input
                className="form-control"
                type="password"
                placeholder="Confirm password"
                name="confirm_password"
                id="confirm_password"
                onChange={(e) => handleChange(e)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="loginbtn btn btn-primary btn-block mb-3"
            onClick={(e) => handleSubmit(e)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
