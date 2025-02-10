// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CreateGame from "./components/CreateGame";
import FindGames from "./components/Games";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import EditGame from "./components/EditGame";
import UserProfile from "./components/UserProfile";
import TermsAndConditions from "./components/TermsAndConditions"; // Import the modal component
import ResetPassword from "./components/ResetPassword";
import UpdatePassword from "./components/UpdatePassword";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <TermsAndConditions /> {/* Show Terms modal when needed */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />

          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/create-game" element={<CreateGame />} />
            <Route path="/profile" element={<UserProfile />} />

            <Route path="/games" element={<FindGames />} />
            <Route path="/edit-game/:gameId" element={<EditGame />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
