
import React, { useEffect, useState } from "react";
import { fetchCsrfToken,checkAuthStatus } from "../utils/auth"; 
import { deleteFromCart } from "../utils/cart"; 
import styles from "./Cart.module.css"; 
import { useNavigate } from "react-router-dom";
const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate() ;
  

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
    fetch("http://localhost:5000/cart", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data.products || []);
        setTotalPrice(data.totalPrice || 0);
       // console.log(data.products) ;
      })
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);

  const handleDelete = async (productId) => {
    const updatedCart = await deleteFromCart(productId, csrfToken);
    if (updatedCart) {
     let deletedItem = cartItems.find(item => String(item.productId._id) === String(productId));
       //console.log(deletedItem.quantity) ;
       setTotalPrice(totalPrice - deletedItem.productId.price*deletedItem.quantity);
       setCartItems( cartItems.filter(item => item.productId._id !== productId));
    }
  };

  const handleOrder = async () => {
    try {
      const res = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
      });

      if (res.ok) {
        alert("Order created successfully!");
        setCartItems([]);
        setTotalPrice(0);
      } else {
        const data = await res.json();
        console.error("Order creation failed:", data.message);
      }
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return <h1 className={styles.centered}>Cart is Empty</h1>;
  }

  return (
    <div>
      <ul>
        {cartItems.map((item) => (
          <li key={item.productId._id} className={styles.cartItem}>
            <div>{item.productId.title}</div>
            <div style={{ color: "rgb(60, 0, 255)", fontWeight: "bold" }}>
              Quantity: {item.quantity}
            </div>
            <button
              className={styles.btn}
              onClick={() => handleDelete(item.productId._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h3 className={styles.centered} style={{ color: "#f31f1f" }}>
        Total price = {totalPrice}
      </h3>

      <div className={styles.centered}>
        <button className={styles.btn} onClick={handleOrder}>
          Order Now
        </button>
      </div>
    </div>
  );
};

export default CartPage;
