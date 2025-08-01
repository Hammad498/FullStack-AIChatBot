


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");

      if (!token) {
        navigate("/login?error=OAuth+login+failed");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/auth/authToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", token);
          navigate("/");
        } else {
          console.error("Token validation failed:", data.error);
          navigate("/login?error=OAuth+token+invalid");
        }
      } catch (err) {
        console.error("Token validation error:", err.message);
        navigate("/login?error=OAuth+server+error");
      }
    };

    checkToken();
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#343541] text-white">
      <p>Validating token...</p>
    </div>
  );
}

export default OAuthCallback;

