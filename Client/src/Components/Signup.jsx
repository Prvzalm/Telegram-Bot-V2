import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "../Signin.css";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    name: "",
  });
  const { email, password, name } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/signup",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      name: "",
    });
  };

  return (
    <main className="d-flex align-items-center py-4 bg-body-tertiary">
      <div className="form-signin w-100 m-auto text-center">
        <img
          className="mb-4"
          src="../../arrow-01.jpg"
          alt=""
          width="72"
          height="57"
        />
        <h1 className="h3 mb-3 fw-normal">Sign in</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-floating">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              className="form-control"
              type="text"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={handleOnChange}
            />
          </div>
          <div className="form-floating">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              className="form-control"
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
            />
          </div>
          <div className="form-floating">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-control"
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
          </div>
          <button className="btn btn-primary w-100 py-2" type="submit">
            Submit
          </button>
          <span>
            Already have an account? <Link to={"/login"}>Login</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </main>
  );
};

export default Signup;
