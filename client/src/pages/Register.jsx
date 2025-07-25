import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.error || "Registration failed");
      }

      setSuccess(" Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(" Server error. Try again later.");
    }
  };

  const handleOAuthRegister = (provider) => {
    window.location.href = `http://localhost:3000/auth/${provider}`;
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#343541] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#202123] p-6 rounded-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Register</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-[#343541] border border-gray-600 outline-none"
          required
        />
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
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <button
          type="submit"
          className="w-full bg-[#10A37F] text-white py-2 rounded hover:opacity-90"
        >
          Register
        </button>

        {/* Divider */}
        <div className="text-center text-gray-400 text-sm py-2">or</div>

        {/* Google Register */}
        <button
          type="button"
          onClick={() => handleOAuthRegister("google")}
          className="w-full bg-red-600 py-2 rounded hover:opacity-90"
        >
          Continue with Google
        </button>

        {/* GitHub Register */}
        <button
          type="button"
          onClick={() => handleOAuthRegister("github")}
          className="w-full bg-gray-700 py-2 rounded hover:opacity-90"
        >
          Continue with GitHub
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;
