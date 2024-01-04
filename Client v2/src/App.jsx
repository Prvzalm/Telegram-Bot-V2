// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Navbar />}>
      </Route>
    </Routes>
  </BrowserRouter>
      </>
  )
}

export default App;
