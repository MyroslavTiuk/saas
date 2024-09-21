import React, {useState} from "react";
import "../styles/login.scss";
import {toast} from "react-toastify";
import API from "../APIs/API";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";

var initialUserEmail = {
  email: "",
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(initialUserEmail);

  const handleChange = (e) => {
    setUserEmail({...userEmail, [e.target.name]: e.target.value});
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(userEmail?.email) || userEmail?.email === "") {
      toast.warning("Please enter your email exactly!");
      return;
    }

    const result = await new API().forgotPassword(userEmail);
    if (result != null) {
      toast.success("Email has been sent!", {
        onClose: () => {
          navigate(`/login`);
        },
      });
    } else {
      toast.error("Email address not registered!");
    }
  };

  return (
    <div className="login-page">
      <div className="box-form">
        <div className="left">
          <div className="overlay">
            <h1>PNG Time Access</h1>
            <p>Forgot Password.</p>
          </div>
        </div>
        <div className="right">
          <h5>Email</h5>
          <div className="inputs">
            <div>
              <input
                className="form-control"
                type="text"
                placeholder="Enter email"
                name="email"
                id="email"
                value={userEmail?.email}
                onChange={(e) => handleChange(e)}
                required
              />
            </div>
            <button
              type="submit"
              className="loginbtn btn btn-primary btn-block mb-3"
              onClick={(e) => handleSubmit(e)}
            >
              Next
            </button>
            <Link
              to="/login"
              className="login"
              style={{textDecoration: "none"}}
            >
              <p>Login Now</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
