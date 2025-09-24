import React, { useState, useEffect } from "react";
import { checkAuthStatus ,fetchCsrfToken} from "../utils/auth";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [csrfToken, setCsrfToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
 useEffect(() => {
    async function getToken() {
      const token = await fetchCsrfToken();
      if (token) setCsrfToken(token);
    }
    getToken();
  }, []);
   
  useEffect(() => {
    async function fetchAuth() {
      const status = await checkAuthStatus();
        if (status.isLoggedIn) {
           navigate("/");
        }
    }
    fetchAuth();
  }, []);
   

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken, 
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) { 
        window.location.href = "/"; 
        console.log("logged in") ;
      } else {
        const data = await res.json();
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong");
    }
  };
  
  
  return (
    <main className={styles["login-container"]}>
      {error && <div className={styles["login-error"]}>{error}</div>}

      <form className={styles["login-form"]} onSubmit={handleSubmit}>
        <input type="hidden" value={csrfToken} />

        <div className={styles["form-control"]}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles["form-control"]}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className={styles.btn} type="submit">
          Login
        </button>
      </form>
    </main>
  );
};

export default LoginPage;
