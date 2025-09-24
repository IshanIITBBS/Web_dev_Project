import React, { useEffect, useState } from "react";
import styles from "./Index.module.css"; // CSS module import
import { addToCart } from "../utils/cart";
import { useNavigate } from "react-router-dom";
import { checkAuthStatus } from "../utils/auth";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:5000/") // 👈 your backend route
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.prods || []); // backend sends { prods: [...] }
        setLoading(false);
        //console.log(products[0].averageRating) ;
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <main>
      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product, index) => (
            <article className={`${styles.card} ${styles.productItem}`} key={index}>
              <header className={styles.cardHeader}>
                <h1 className={styles.productTitle}>{product.title}</h1>
              </header>

              <div className={styles.cardImage}>
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className={styles.image}
                />
              </div>

              <div className={styles.cardContent}>
                <h2 className={styles.productPrice}>Rs {product.price}</h2>
                <p className={styles.productDescription}>{product.description}</p>
              </div>
               <div className={styles.starRating}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={i < Math.round(product.averageRating) ? styles.filledStar : styles.emptyStar}
                  >
                    ★
                  </span>
                ))}
                 
                <span className={styles.ratingText}>
                  ({product.numReviews || 0} reviews)
                </span>
              </div>
               <p className={styles.averageRating}>
                     ⭐ Average Rating: {product.averageRating ? product.averageRating.toFixed(1) : "No ratings yet"}
                </p>
              <div className={styles.cardActions}>
                <button
                  className={styles.btn}
                  onClick={() => addToCart(product._id, navigate,checkAuthStatus)}
                >
                  Add to Cart
                </button>
              </div>

            </article>
          ))}
        </div>
      ) : (
        <h1>No Products Found!</h1>
      )}
    </main>
  );
}

export default ProductList;
