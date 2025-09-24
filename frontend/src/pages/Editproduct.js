
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthStatus,fetchCsrfToken } from "../utils/auth";
import AddProduct from "../components/Addproduct";
import { useParams } from "react-router-dom";

const Orders = ({ csrf }) => {
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(productId) ;
  
   useEffect(() => {
       async function fetchAuth() {
         const status = await checkAuthStatus();
           if (!status.isLoggedIn) {
              navigate("/login");
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

        useEffect(() => {
  fetch(`http://localhost:5000/admin/edit-product/${productId}`, {
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch product");
        navigate("/admin/products") ;
      }
      return res.json();
    })
    .then((data) => {setProduct(data.product); setLoading(false);})
    .catch((err) => console.error("Error fetching product:", err));
}, [productId]);

if (loading) return <h2>Loading...</h2>;
 return <AddProduct editing={true} product={product} csrfToken={csrfToken} />;
};

export default Orders;
