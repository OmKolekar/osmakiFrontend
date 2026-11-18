import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import SignupModal from "./SignupModal";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const userObj = await login(email, password);
      if (userObj && userObj.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Sign in</h1>

      <p className="login-subtitle">Enter your credentials to continue</p>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
          disabled={loading}
        />
        <div className="login-password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
            disabled={loading}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        {error && <div className="modal-error-message">{error}</div>}

        <button className="login-btn" disabled={loading}>
          {loading ? "Signing in..." : "Continue"}
        </button>
      </form>

      <div className="login-signup-prompt">
        Don't have an account?{" "}
        <span className="login-signup-link" onClick={() => setIsSignUpOpen(true)}>
          Sign up
        </span>
      </div>

      <SignupModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
    </div>
  );
}

