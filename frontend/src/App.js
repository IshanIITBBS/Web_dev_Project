
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Index from './pages/Index'; 
import ProductList from './pages/Products'
import ProductDetail from './pages/Productdetail';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/Cart';
import Orders from './pages/Order';
import AdminProducts from './pages/AdminProducts';
import AddProduct from './pages/Addproduct';
import EditProduct from './pages/Editproduct'
import SignupPage from './pages/SignupPage';
import AddReviewPage from './pages/AddReviewPage.js';
import ShowReviewsPage from './pages/ShowReviewsPage.js';


function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Index />} /> 
        <Route path="/products" element={<ProductList />} /> 
         <Route path="/products/:productId" element={<ProductDetail />} /> 
         <Route path="/login" element={<LoginPage />} /> 
         <Route path="/cart" element={<CartPage />} /> 
         <Route path="/orders" element={<Orders />} /> 
         <Route path="/admin/products" element={<AdminProducts />} /> 
         <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/edit-product/:productId" element={<EditProduct />} /> 
          <Route path="/signup" element={<SignupPage />} /> 
          <Route path="/products/:productId/add-review" element={<AddReviewPage />} />
          <Route path="/products/:productId/reviews" element={<ShowReviewsPage />} />
        <Route path="*" element={<h1>404: Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;