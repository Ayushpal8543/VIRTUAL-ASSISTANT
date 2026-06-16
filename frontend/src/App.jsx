import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import SignUp from './pages/SignUp';
import SignIn from './pages/signIn';
import Customize from './pages/Customize';
import Customize2 from './pages/Customize2';
import Home from './pages/Home';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';

import { userDataContext } from './context/userContext';

function App() {
  const { userData } = useContext(userDataContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.assistantName
            ? <Home />
            : <Navigate to="/Customize" />
        }
      />

      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />

      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" />}
      />
      <Route
        path="/verify-otp"
        element={<VerifyOtp />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/Customize"
        element={userData ? <Customize /> : <Navigate to="/signup" />}
      />

      <Route
        path="/Customize2"
        element={userData ? <Customize2 /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
}

export default App;
