// src/App.js
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Components/Dashboard.jsx";
import Layout from "./Components/Layout.jsx";
import Customer from "./Components/Customer.jsx";
import ErrorPage from "./Components/ErrorPage.jsx";
import Report from "./Components/Report.jsx";
import Signup from "./Components/Signup.jsx";
import Login from "./Components/Login.jsx";
import LoadingBar from 'react-top-loading-bar';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [chatMembers, setChatMembers] = useState([]);
  const ref = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        ref.current.continuousStart()
        const response = await axios.get("/api/chatMembers");
        setChatMembers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Hide the loading bar after data is fetched
        ref.current.complete();
      }
    };

    fetchData();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Dashboard chatMembers={chatMembers} />,
        },
        {
          path: "dashboard",
          element: <Dashboard chatMembers={chatMembers} />,
        },
        {
          path: "customer",
          element: <Customer chatMembers={chatMembers} />,
        },
        {
          path: "report",
          element: <Report chatMembers={chatMembers} />,
        },
      ],
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <div className="row container-fluid">
      <RouterProvider router={router} />
      <LoadingBar color='red' ref={ref} />
    </div>
  );
}

export default App;
