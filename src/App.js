import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Logout from "./auth/Logout";
import Home from "./home/Home";

const App = () => {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path={`/register/`} element={<Register />} />
          <Route path={`/login/`} element={<Login />} />
          <Route path={`/`} element={<Home />} />
          <Route path={`/logout/`} element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;