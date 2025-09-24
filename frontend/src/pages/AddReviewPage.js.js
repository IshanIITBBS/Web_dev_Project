import React, { useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AddReviewPage.module.css";
import { checkAuthStatus ,fetchCsrfToken} from "../utils/auth";

const AddReviewPage = () => {
  const { productId } = useParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();
    // Fetch CSRF token when component mounts
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
          if (!status.isLoggedIn) {
             navigate("/login");
          }
      }
      fetchAuth();
    }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/products/${productId}/addreview`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to add review");
        return;
      }

      navigate(`/products/${productId}/reviews`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <main className={styles.addReviewPage}>
      <h1>Add Review</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Rating (1-5):
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1,2,3,4,5].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </label>
        <label>
          Comment:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </label>
        <button type="submit" className={styles.btn}>Submit Review</button>
      </form>
    </main>
  );
};

export default AddReviewPage;
