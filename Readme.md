📚 SHOPPING CART WEBSITE 

--------------------------------------------------------------------------------------------------------------------------------

🔹 WEBSITE LINK :- https://68d4df730247e9000719fb73--melodic-eclair-a22fb0.netlify.app/

🔹 USER ID AND PASSWORD :-

  1) USER ID :- xyz@gmail.com
     
     PASSWORD :- 12345

  2) USER ID :- xyz2@gmail.com

      PASSWORD :- 12345

--------------------------------------------------------------------------------------------------------------------------------

🔹 SET UP / INSTALLATION INSTRUCTIONS :-

1) Clone the repo :- git clone https://IshanIITBBS/Web_dev_Project.git

2) cd Web_dev_Project

3) FRONTEND :- 

       a) cd frontend

       b) npm install 

       c) npm start

4) BACKEND :- 
       
       a) cd backend
          
       b) npm install 

       c) npm start

--------------------------------------------------------------------------------------------------------------------------------

🔹 OVERVIEW :- 

A full-stack web application including features of E-Commerce shoping websites  like search product , add product to cart,order products , admin features , give reviews etc .
The project is built with **React (frontend)** and **Node.js (backend)**, and deployed on **Netlify (frontend)**  and **Render** . 

--------------------------------------------------------------------------------------------------------------------------------

🔹 TECH STACK :- 

1) Node.js, Express.js, MongoDB for frontend 
2) React.js for frontend

--------------------------------------------------------------------------------------------------------------------------------


🔹 FEATURES :- 


1) Login/SignUp

![alt text](/images/Login.png)

--------------------------------------------------------------------------------------------------------------------------------

2) Search Products By using their Name / Sort according to price 

3) Add Products to Cart

![alt text](/images/SearchProduct.png)

--------------------------------------------------------------------------------------------------------------------------------

4) See Product Detail 

![alt text](/images/Productdetail.png)

--------------------------------------------------------------------------------------------------------------------------------

5) Add Review 

![alt text](/images/Addreview.png)

--------------------------------------------------------------------------------------------------------------------------------

6) See reviews for a product 

![alt text](/images/Showreview.png)

--------------------------------------------------------------------------------------------------------------------------------

7) See the Cart

8) Delete Items from cart

9) Order the Cart 

![alt text](/images/Cart.png)

--------------------------------------------------------------------------------------------------------------------------------

10) See the orders 

![alt text](/images/Orders.png)

--------------------------------------------------------------------------------------------------------------------------------

11) See the admin Products ( The Products which are uploaded by you )

12) Delete the product

13) Edit product 

![alt text](/images/Adminproducts.png)

--------------------------------------------------------------------------------------------------------------------------------

14) Add a Product 

![alt text](/images/Addproduct.png)

--------------------------------------------------------------------------------------------------------------------------------

## 🔗 Backend Endpoints
| Method | Endpoint           | Description                  |
|--------|------------------|------------------------------|
| POST   | /api/login        | Login to Site              |
| POST   | /api/signup       | Create new account             |
| POST   | /api/logout       | Logout from site        |
| GET    | /api/auth/status    | Get auth status (loggedin=true or false )        |
| GET    | /api/             | Get product List according to search query  and  sort request with applied pagination |
| GET    | /api/products/:productId             | Get detail about a product with id = productId |
| GET    | /api/cart             | Get items in the cart  |
| POST    | /api/cart           | add an item to the cart |
| POST    | /api/orders           | Get the orders |
| POST    | /api/create-order          | create a order from the items in the cart |
| POST    | /api/delete-product          | Delete a product from cart |
| GET    | /api/products/:productId/reviews          | GET reviews about a product |
| POST    | /api/products/:productId/addreview         | add a review about a product |
| GET    | /api/admin/products        | Get admin products (Products uploaded by  you) |
| POST    | /api/admin/add-product       | add a product to the site/db |
| GET    | /api/admin/edit-product/:productId      | Get Info about  a product with id = productId |
| POST    | /api/admin/edit-product      | Edit a product  |
| POST    | /api/admin//delete-product      | Delete Product from site or db  |


--------------------------------------------------------------------------------------------------------------------------------


🔹 Author

👤 MOHD ISHAN

📧 mohd.ishankrj@gmail.com