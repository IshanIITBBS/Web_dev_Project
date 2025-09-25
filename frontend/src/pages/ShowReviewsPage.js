import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ShowReviewsPage.module.css";

const ShowReviewsPage = () => {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [productTitle, setProductTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/reviews`, {
      credentials: "include", 
    })
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setProductTitle(data.title);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <h2>Loading reviews...</h2>;

  return (
    <main className={styles.showReviewsPage}>
      <h1>Reviews for "{productTitle}"</h1>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      <ul className={styles.reviewList}>
        {reviews.map((rev) => (
          <li key={rev._id} className={styles.reviewItem}>
            <strong>{rev.username}</strong> - ⭐ {rev.rating}
            <p>{rev.comment}</p>
            <small>{new Date(rev.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ShowReviewsPage;
