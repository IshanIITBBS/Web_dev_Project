// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { checkAuthStatus, fetchCsrfToken } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 New: Get the current location object
  const [auth, setAuth] = useState({ isLoggedIn: false });
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    async function fetchAuth() {
      const status = await checkAuthStatus();
      setAuth(status);
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

  const handleLogout = () => {
        
       
    fetch("http://localhost:5000/logOut", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
    })
      .then((res) => {
        if (res.ok) {
              window.location.href = "/" ;
        } else {
          console.error("Logout failed");
        }
      })
      .catch((err) => console.error("Error logging out:", err));
  };

  const getLinkClassName = (path) => {
    // Check if the current path matches the link's path
    
    return location.pathname == path ? styles.activeLink : ""; 
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbarLeft}>
        <li>
          {/* Apply the activeLink class if the path matches */}
          <Link to="/" className={getLinkClassName("/")}>
            Shop
          </Link>
        </li>
        <li>
          <Link to="/products" className={getLinkClassName("/products")}>
            Products
          </Link>
        </li>
        <li>
          <Link to="/cart" className={getLinkClassName("/cart")}>
            Cart
          </Link>
        </li>
        <li>
          <Link to="/orders" className={getLinkClassName("/orders")}>
            Orders
          </Link>
        </li>
        <li>
          <Link to="/admin/add-product" className={getLinkClassName("/admin/add-product")}>
            Add Product
          </Link>
        </li>
        <li>
          <Link
            to="/admin/products"
            className={getLinkClassName("/admin/products")}
          >
            Admin
          </Link>
        </li>
      </ul>

      <ul className={styles.navbarRight}>
        {!auth.isLoggedIn ? (
          <>
            <li>
              <Link to="/login" className={getLinkClassName("/login")}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className={getLinkClassName("/signup")}>
                Signup
              </Link>
            </li>
          </>
        ) : (
          <li>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;