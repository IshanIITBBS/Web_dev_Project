import React, { useState } from "react";
import styles from "./Addproduct.module.css";

const AddProduct = ({ editing = false, product = {}, csrfToken }) => {
  const [title, setTitle] = useState(product.title || "");
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "");
  const [price, setPrice] = useState(product.price || "");
  const [description, setDescription] = useState(product.description || "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = editing
      ? "http://localhost:5000/admin/edit-product"
      : "http://localhost:5000/admin/add-product";

    const payload = {
      title,
      imageUrl,
      price,
      description,
      ...(editing && { productId: product._id }),
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(editing ? "Product updated!" : "Product added!");
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      setMessage("Server error!");
    }
  };

  return (
    <main className={styles.main}>
      <form className={styles.productForm} onSubmit={handleSubmit}>
        {message && <p className={styles.message}>{message}</p>}

        <div className={styles.formControl}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.formControl}>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>

        <div className={styles.formControl}>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className={styles.formControl}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button className={styles.btn} type="submit">
          {editing ? "Update Product" : "Add Product"}
        </button>
      </form>
    </main>
  );
};

export default AddProduct;
