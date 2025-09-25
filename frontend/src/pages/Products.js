import  { useEffect, useState } from "react";
import styles from "./Products.module.css";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";
import { checkAuthStatus } from "../utils/auth";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [searchval, setSearchval] = useState("") ;
 
  useEffect(() => {
    setLoading(true);
    fetch(
      `${process.env.REACT_APP_API_URL}/?page=${currentPage}&limit=5&sort=${sortOrder}&search=${searchval}`, {
      credentials: "include", 
    }
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.prods || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [currentPage, sortOrder, searchval]);
    



  if (loading) return <h2>Loading...</h2>;

  return (
    <main>
      <div className={styles.controls}>
    <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value); 
      }}
    />
    <button
      className={styles.searchBtn}
      onClick={() => {
        setSearchval(search); 
        setCurrentPage(1);
      }}>🔍</button>
    <select
      value={sortOrder}
      onChange={(e) => {
        setSortOrder(e.target.value);
        setCurrentPage(1);
      }}
    >
      <option value="asc">Price: Low → High</option>
      <option value="desc">Price: High → Low</option>
    </select>
</div>
      
      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product) => (
            <article
              className={`${styles.card} ${styles.productItem}`}
              key={product._id}
            >
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
              <div className={styles.cardContent}>
                <h2 className={styles.productPrice}>Rs {product.price}</h2>
                <p className={styles.productDescription}>
                  {product.description}
                </p>
              </div>
               
              <div className={styles.cardActions}>
                <button
                  className={styles.btn}
                  onClick={() =>
                    addToCart(product._id, navigate, checkAuthStatus)
                  }
                >
                  Add to Cart
                </button>

                <Link
                  to={`/products/${product._id}`}
                  className={`${styles.btn} ${styles.btnDetails}`}
                >
                  Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h1>No Products Found!</h1>
      )}

      
      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          ◀ Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={styles.pageBtn}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next ▶
        </button>
      </div>
    </main>
  );
}

export default ProductList;
