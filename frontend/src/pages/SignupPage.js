import React, { useState, useEffect } from "react";
import { fetchCsrfToken,checkAuthStatus } from "../utils/auth";
import styles from "./SignupPage.module.css";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [csrfToken, setCsrfToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
 

    useEffect(() => {
      async function fetchAuth() {
        const status = await checkAuthStatus();
          if (status.isLoggedIn) {
             navigate("/");
          }
      }
      fetchAuth();
    }, []);
    
  useEffect(() => {
    async function getToken() {
      const token = await fetchCsrfToken();
      if (token) setCsrfToken(token);
    }
    getToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        setTimeout(() => navigate("/login"), 1500); 
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong");
    }
  };

  return (
    <main className={styles.signupContainer}>
      {error && <div className={styles.errorBox}>{error}</div>}
      {success && <div className={styles.successBox}>{success}</div>}

      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <input type="hidden" value={csrfToken} />

        <div className={styles.formControl}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formControl}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.formControl}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button className={styles.btn} type="submit">
          Sign Up
        </button>
      </form>
    </main>
  );
};

export default SignupPage;
