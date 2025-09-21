export const addToCart = async (productId, navigate,checkAuthStatus) => {
  try {
     
    const status = await checkAuthStatus();
            if (!status.isLoggedIn) {
               navigate("/login");
            }
       
    // 1. get csrf token
    const csrfRes = await fetch("http://localhost:5000/get-csrf-token", {
      credentials: "include", // important for session cookies
    });
    const { csrfToken } = await csrfRes.json();

    // 2. add to cart
    const response = await fetch("http://localhost:5000/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken, // ✅ header name matches csurf default
      },
      credentials: "include",
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(" Added to cart!");
    } else {
      alert(" " + data.message);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Something went wrong!");
  }
};


// utils/cart.js

export const deleteFromCart = async (productId, csrf) => {
  try {
    const response = await fetch("http://localhost:5000/delete-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrf, 
      },
      credentials: "include",
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();

    if (response.ok) {
      return data.success; // return updated cart from backend
    } else {
      alert(data.message || "Failed to delete product");
      return null;
    }
  } catch (error) {
    console.error("Error deleting:", error);
    alert("Something went wrong!");
    return null;
  }
};
