import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    console.log("Extracted token:", token);

    if (token) {
      localStorage.setItem("token", token);
      console.log("Token saved to localStorage", token);
      setTimeout(() => {
        navigate("/");
      }, 100); // Redirect after 0.1 second
      // navigate("/");
    } else {
      navigate("/login?error=OAuth+login+failed");
    }
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#343541] text-white">
      <p>Logging you in...</p>
    </div>
  );
}

export default OAuthCallback;
