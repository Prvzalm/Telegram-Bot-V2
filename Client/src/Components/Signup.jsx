import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "../Signin.css";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    chatId: "",
    password: "",
    channelName: "",
  });
  const { chatId, password, channelName } = inputValue;
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
  const handleSuccess = (message) =>
    toast.success(message, {
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
      chatId: "",
      password: "",
      channelName: "",
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
            <label className="form-label" htmlFor="channelName">
              Channel Name
            </label>
            <input
              className="form-control"
              type="text"
              id="channelName"
              name="channelName"
              value={channelName}
              placeholder="Enter your Channel Name"
              onChange={handleOnChange}
            />
          </div>
          <div className="form-floating">
            <label className="form-label" htmlFor="chatId">
              chatId
            </label>
            <input
              className="form-control"
              type="chatId"
              id="chatId"
              name="chatId"
              value={chatId}
              placeholder="Enter your Chat Id"
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
