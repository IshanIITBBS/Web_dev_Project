import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";
import styles from "./Productdetail.module.css";
import { checkAuthStatus } from "../utils/auth";
const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/products/${productId}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [productId]);

  if (!product) return <h2 className={styles.loading}>Loading...</h2>;



  return (
    <main className={styles.productDetail}>
      <h1 className={styles.detailTitle}>{product.title}</h1>
      <hr className={styles.divider} />
      <div className={styles.detailImageWrapper}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className={styles.detailImage}
        />
      </div>
      <h2 className={styles.detailPrice}>${product.price}</h2>
      <p className={styles.detailDescription}>{product.description}</p>
      <div className={styles.detailActions}>
        <button
          className={styles.btn}
          onClick={() => addToCart(product._id, navigate,checkAuthStatus)}
        >
          Add to Cart
        </button>
      </div>
    </main>
  );
};

export default ProductDetail;
