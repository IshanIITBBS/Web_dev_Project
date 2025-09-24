export const addToCart = async (productId, navigate,checkAuthStatus) => {
  try {
     
    const status = await checkAuthStatus();
            if (!status.isLoggedIn) {
               navigate("/login");
            }
       
    
    const csrfRes = await fetch(`${process.env.REACT_APP_API_URL}/get-csrf-token`, {
      credentials: "include", 
    });
    const { csrfToken } = await csrfRes.json();

    
    const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken, 
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



export const deleteFromCart = async (productId, csrf) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-product`, {
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
      return data.success; 
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
