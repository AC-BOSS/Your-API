import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./Login.module.scss";

import Logo from "../../components/Logo/Logo";
import profileImage from "../../assets/profileImage.png";
import { postData } from "../../utils/fetchData";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    console.log({ email, password });

    let res = await postData(`${BACKEND_URL}/api/user/login`, {
      email,
      password,
    });
    console.log(res);
    if (res.message) {
      // @TODO: display Error Message
      toast.error(res.message);
      res.errors.map((error) => {
        console.log(error.msg);
        toast.error(error.msg);
      });
      return;
    } else {
      // @TODO: redirect to dashboard With State
      navigate(`/`);
      sessionStorage.setItem("Auth Token", res.token);
      console.log("Login Successfull!!");
    }
  };

  return (
    <div className={styles.login}>
      <ToastContainer />
      <div className={styles.navbar}>
        <Logo />
      </div>
      <div className={styles.body}>
        <div className={styles.infoBox}>
          <div className={styles.infoCard}>
            <div className={styles.profileImage}>
              <img src={profileImage} alt="profileImage" />
            </div>
            <div className={styles.textBox}>
              <div className={styles.primaryText}>
                Welcome to your Dashboard
              </div>
              <div className={styles.secondaryText}>
                Your uploaded APIs will be displayed here once you login to your
                account
              </div>
            </div>
          </div>
        </div>
        <div className={styles.loginBox}>
          <div className={styles.loginForm}>
            <div className={styles.formH1}>Login to your account</div>
            <input
              className={styles.inputField}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={styles.inputField}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className={styles.loginBtn} onClick={handleOnSubmit}>
              Login now
            </div>
            <div
              className={styles.registerLink}
              onClick={() => {
                navigate("/register");
              }}
            >
              Create a new account?
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
