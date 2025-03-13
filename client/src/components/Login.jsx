import { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie"; // Import js-cookie
import image from "@/assets/loginani.png";
import logo from "@/assets/logo1.png";
import { GoogleLogin } from "@react-oauth/google";

const backendUrl = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/users/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log(response.data);

      if (response.data.token) {
        Cookie.set("token", response.data.token, { expires: 1 }); // Store token in cookies for 1 day
      }

      setSuccess("Login successful! Redirecting...");
      setError("");

      setTimeout(() => {
        navigate("/main-page"); // Redirect to main page after login
      }, 2000);

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password");
      handleMessage();
      setSuccess("");
    }
  };

  const handleMessage = () => {
    setTimeout(() => {
      setError("");
    }, 2000);
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleMailVerification = () => {
    navigate("/mail-verification");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      console.log("Google Login Success:", credentialResponse);

      const response = await axios.post(
        `${backendUrl}/api/users/google-login`,
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      if (response.data.token) {
        Cookie.set("token", response.data.token, { expires: 1 });
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/main-page"), 2000);
      }
    } catch (error) {
      console.error("Google login failed:", error);
      setError("Google login failed. Try again.");
      handleMessage();
    }
  };

  return (
    <div className="page">
      {/* Logo container */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="login-right">
        <div className="login-container">
          <h3 className="login-header">Sign in to Your Account</h3>

          {error && <p className="text-danger text-center">{error}</p>}
          {success && <p className="text-success text-center">{success}</p>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="google-login-container">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError("Google login failed. Try again.")}
              />
            </div>

            <div className="login-links">
              <button
                type="button"
                className="btn-links"
                onClick={handleForgotPassword}
              >
                Forgot Your Password?
              </button>
              <button
                type="button"
                className="btn-links"
                onClick={handleRegister}
              >
                Need an Account?
              </button>
            </div>

            <button type="submit" className="btn-submit">
              Sign In
            </button>

            <button
              type="button"
              className="btn-links p-5"
              onClick={handleMailVerification}
            >
              Registered but not verified?
            </button>
          </form>
        </div>
      </div>

      <div className="fly-img">
        <img src={image} alt="Flying image" />
        <div className="quote-container">
          <p className="quote-text">
            "Dream big, work hard, stay focused, and surround yourself with good
            people." <br />– StudyBuddy
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
