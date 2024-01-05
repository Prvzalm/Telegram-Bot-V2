// src/App.js
import { useEffect, useState } from "react";
import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Components/Dashboard.jsx";
import Layout from "./Components/Layout.jsx";
import Customer from "./Components/Customer.jsx";
import ErrorPage from "./Components/ErrorPage.jsx";

function App() {

  const [chatMembers, setChatMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/chatMembers"
        );
        setChatMembers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // Set up interval for periodic data fetching
    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard chatMembers={chatMembers} />,
        },
        {
          path: "customer",
          element: <Customer chatMembers={chatMembers} />,
        },
      ],
    },
  ]);

  return (
    <div className="row container-fluid">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
