import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) return setError(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(" Server error. Try again later.");
    }
  };

  const handleOAuthLogin = (provider) => {
    // Redirect to backend OAuth route
    window.location.href = `http://localhost:3000/auth/${provider}`;

    // Create OAuth session
    createOAuthSession(provider);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#343541] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#202123] p-6 rounded-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-[#343541] border border-gray-600 outline-none"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-[#343541] border border-gray-600 outline-none"
          required
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#10A37F] text-white py-2 rounded hover:opacity-90"
        >
          Login
        </button>

        {/* Divider */}
        <div className="text-center text-gray-400 text-sm py-2">or</div>

        {/* Google Login */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          className="w-full bg-red-600 py-2 rounded hover:opacity-90"
        >
          Continue with Google
        </button>

        {/* GitHub Login */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("github")}
          className="w-full bg-gray-700 py-2 rounded hover:opacity-90"
        >
          Continue with GitHub
        </button>

        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
