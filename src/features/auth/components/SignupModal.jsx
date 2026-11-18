import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { authApi } from "../../../api/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../styles/signupModal.css";

export default function SignupModal({ isOpen, onClose }) {
  const [stage, setStage] = useState("email"); // "email", "otp", "register", "success"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transitioning, setTransitioning] = useState(false);

  const { signUpLogin } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const changeStage = (nextStage) => {
    setTransitioning(true);
    setStage(nextStage);
    setTimeout(() => {
      setTransitioning(false);
    }, 400); // 400ms cooldown
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (transitioning) return;
    if (stage !== "email") return;
    if (!email) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authApi.sendOtp(email);
      changeStage("otp");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (transitioning) return;
    if (stage !== "otp") return;
    if (!otp) {
      setError("Please enter the verification code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authApi.verifyOtp(email, otp);
      changeStage("register");
    } catch (err) {
      setError(err.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (transitioning) return;
    if (stage !== "register") return;
    if (!name || !password || !phone) {
      setError("Name, password, and phone number are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const user = await authApi.register({ name, email, password, phone });
      
      // Auto login the registered user
      signUpLogin(user);
      
      changeStage("success");
      
      // Auto-close and redirect to home after 1.5 seconds
      setTimeout(() => {
        handleClose();
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset all state on close
    setStage("email");
    setEmail("");
    setOtp("");
    setName("");
    setPassword("");
    setShowPassword(false);
    setPhone("");
    setError("");
    setTransitioning(false);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {stage === "email" && (
          <div className="modal-step-content">
            <h2 className="modal-title">Sign Up</h2>
            <p className="modal-subtitle">Enter your email to receive a verification OTP code.</p>
            
            <form onSubmit={handleSendOtp} className="modal-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="modal-input"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {error && <div className="modal-error-message">{error}</div>}

              <button type="submit" className="modal-primary-btn" disabled={loading || transitioning}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </div>
        )}

        {stage === "otp" && (
          <div className="modal-step-content">
            <h2 className="modal-title">Sign Up</h2>
            <p className="modal-subtitle">Enter the verification code sent to your email.</p>
            
            <form onSubmit={handleVerifyOtp} className="modal-form">
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  className="modal-input read-only-input"
                  disabled
                />
              </div>

              <div className="input-group animate-slide-down">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="modal-input text-center"
                  maxLength={6}
                  required
                  disabled={loading}
                  autoComplete="one-time-code"
                />
              </div>

              {error && <div className="modal-error-message">{error}</div>}

              <button type="submit" className="modal-primary-btn" disabled={loading || transitioning}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </div>
        )}

        {stage === "register" && (
          <div className="modal-step-content">
            <h2 className="modal-title">Sign Up</h2>
            <p className="modal-subtitle">Setup your password and complete your profile registration.</p>
            
            <form onSubmit={handleRegister} className="modal-form">
              <div className="input-group">
                <div className="verified-email-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>{email} (Verified)</span>
                </div>
              </div>

              <div className="input-group animate-slide-down">
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="modal-input"
                  required
                  disabled={loading}
                  autoComplete="name"
                />
              </div>

              <div className="input-group animate-slide-down">
                <div className="modal-password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Set password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="modal-input"
                    required
                    disabled={loading}
                    autoComplete="new-password"
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
              </div>

              <div className="input-group animate-slide-down">
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="modal-input"
                  required
                  disabled={loading}
                  autoComplete="tel"
                />
              </div>

              {error && <div className="modal-error-message">{error}</div>}

              <button type="submit" className="modal-primary-btn" disabled={loading || transitioning}>
                {loading ? "Registering..." : "Complete Registration"}
              </button>
            </form>
          </div>
        )}

        {stage === "success" && (
          <div className="modal-step-content text-center">
            <div className="success-icon-container animate-scale-up">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className="modal-title">Welcome to Osmaki!</h2>
            <p className="modal-subtitle">Your account has been created successfully. Redirecting you to login page...</p>
          </div>
        )}
      </div>
    </div>
  );
}
