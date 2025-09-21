// Orders.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Order.module.css"
import { checkAuthStatus } from "../utils/auth";

const Orders = ({ csrf }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();


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
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders || []);
        } else {
          console.error("Error fetching orders:", data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [csrf]);

  if (loading) return <h2>Loading...</h2>;

 return (
    <main className={styles.main}>
      {orders && orders.length > 0 ? (
        <ul className={styles.orderList}>
          {orders.map((order) => (
            <li key={order._id} className={styles.orderItem}>
              <div className={styles.orderId}>Order ID: {order._id}</div>
              <ul className={styles.products}>
                {order.items.map((product, index) => (
                  <li key={index} className={styles.orderProduct}>
                    {product.product.title} <b>({product.quantity})</b>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <h1 className={styles.empty}>Nothing there!</h1>
      )}
    </main>
  );
};

export default Orders;
