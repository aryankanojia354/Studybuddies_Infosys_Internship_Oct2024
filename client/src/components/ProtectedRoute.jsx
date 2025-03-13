import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie"; 

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookie.get("token");

    if (!token) {
      setRedirecting(true);
      navigate("/"); // Redirect immediately if no token found
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds

      if (decoded.exp < currentTime) {
        Cookie.remove("token"); // Remove expired token
        setRedirecting(true);
        navigate("/"); // Redirect if token expired
      } else {
        setLoading(false); // Allow access if valid token
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      Cookie.remove("token"); // Remove corrupted token
      setRedirecting(true);
      navigate("/"); // Redirect if decoding fails
    }
  }, [navigate]); // Removed `token` from dependencies to prevent multiple executions

  if (redirecting) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="p-4 border-2 border-red-500 bg-red-100 text-center rounded-md">
          <h2 className="text-lg font-bold text-red-600">
            Unauthorized Access! Redirecting to the home page...
          </h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return null; // Prevent rendering until token validation is complete
  }

  return <Outlet />; // Render protected content if authentication passes
};

export default ProtectedRoute;
