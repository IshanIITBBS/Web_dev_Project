
import styles from "./AdminProducts.module.css";
import { checkAuthStatus } from "../utils/auth";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCsrfToken } from "../utils/auth";
import { onDelete } from "../utils/admin";


const AdminProducts = () => {
   const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
     const [csrfToken, setCsrfToken] = useState("");
    const navigate = useNavigate();
     
      useEffect(() => {
        async function fetchAuth() {
          const status = await checkAuthStatus();
            if (!status.isLoggedIn) {
               navigate("/login");
            }
        }
        fetchAuth();
      }, [navigate]);

      useEffect(() => {
          async function getToken() {
            const token = await fetchCsrfToken();
            if (token) setCsrfToken(token);
          }
          getToken();
        }, []);

    
    useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/admin/products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        }) 
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.prods || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
          setLoading(false);
        });
    }, []);


    const handleDelete = async (id) => {
    const result = await onDelete(id, csrfToken);
    if (result.success) {
      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted");
    } else {
      alert("Error: " + result.message);
    }
  };

  
    if (loading) return <h2>Loading...</h2>;

  return (
    <main className={styles.main}>
      {products && products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product) => (
            <article key={product._id} className={styles.card}>
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
                <p className={styles.productDescription}>
                  {product.description}
                </p>
              </div>

              <div className={styles.cardActions}>
                <a
                  href={`/admin/edit-product/${product._id}`}
                  className={styles.btn}
                >
                  Edit
                </a>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleDelete(product._id)
                  }}
                >
                  <input type="hidden" name="_csrf" value={csrfToken} />
                  <input type="hidden" value={product._id} name="productId" />
                  <button className={styles.btn} type="submit">
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h1 className={styles.empty}>No Products Found!</h1>
      )}
    </main>
  );
};

export default AdminProducts;
