
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthStatus,fetchCsrfToken } from "../utils/auth";
import AddProduct from "../components/Addproduct";

const Orders = ({ csrf }) => {
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
     }, []);
    
      useEffect(() => {
         async function getToken() {
           const token = await fetchCsrfToken();
           if (token) setCsrfToken(token);
         }
         getToken();
       }, []);


 return <AddProduct editing={false} product={{}} csrfToken={csrfToken} />;
};

export default Orders;
