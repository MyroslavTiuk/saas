import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {useQueryClient} from "react-query";
import API from "../APIs/API";
import "../styles/login.scss";
import {setAccessToken} from "../utils/helper";

var initialUserData = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(initialUserData);
  const [showHiddenPassword, setShowHiddenPassword] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.email === "") {
      toast.warning("Please enter your email !");
    } else if (userData.password === "") {
      toast.warning("Please enter your password !");
    } else {
      const result = await new API().loginUser(userData);
      if (result.status === true) {
        setAccessToken(result.data);
        queryClient.invalidateQueries("/users/me");
        navigate("/dashboard");
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleChange = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value});
  };

  const showPassword = (status) => {
    setShowHiddenPassword(status);
  };

  return (
    <div className="login-page">
      <div className="box-form">
        <div className="left">
          <div className="overlay">
            <h1>PNG Time Access</h1>
            <p>Get started by logging into our system.</p>
          </div>
        </div>

        <div className="right">
          <h5>Login</h5>
          <div className="inputs">
            <div>
              <input
                className="form-control"
                type="text"
                placeholder="email"
                name="email"
                id="email"
                onChange={(e) => handleChange(e)}
                required
              />
            </div>
            <div>
              <input
                className="form-control"
                type={showHiddenPassword ? "text" : "password"}
                placeholder="password"
                name="password"
                id="psw"
                onChange={(e) => handleChange(e)}
                required
              />
              <span
                style={{cursor: "pointer"}}
                onClick={(e) => showPassword(!showHiddenPassword)}
              >
                {showHiddenPassword ? " hide" : " show"}
              </span>
              <br/>
            </div>
          </div>
          <button
            type="submit"
            className="loginbtn btn btn-primary btn-block mb-3"
            onClick={(e) => handleSubmit(e)}
          >
            Login
          </button>
          <Link
            to="/forgotpassword"
            className="forgotpassword"
            style={{textDecoration: "none"}}
          >
            <p>Forget password?</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
