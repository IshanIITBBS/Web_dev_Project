
export const onDelete = async (productId, csrfToken) => {
  try {
    const response = await fetch("http://localhost:5000/admin/delete-product", {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete product");
    }

    return data; 
  } catch (error) {
    console.error("Delete product error:", error);
    return { success: false, message: error.message };
  }
};
