import Navbar from "../../customer/components/layout/Navbar";
import Footer from "../../customer/components/layout/Footer";
import LoginForm from "../components/LoginForm";
import "../styles/login.css";

export default function Login() {
  return (
    <div className="login-page">
      <Navbar />
      <LoginForm />
      <Footer />
    </div>
  );
}

