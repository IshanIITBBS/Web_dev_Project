const Product = require('../models/product');
const Order = require('../models/order')
const User = require('../models/user')

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        loggedIn:req.session.loggedIn
      });
    })
    .catch(err => console.log(err))
};

// exports.getProduct = (req, res, next) => {
//   const prodId = req.params.productId
//   Product.findById(prodId)
//     .then(product => {
//       res.render('shop/product-detail',
//          { product: product, 
//           pageTitle: product.title, 
//           path: '/products',
//           loggedIn:req.session.loggedIn
//          });
//     })
//     .catch(err => console.log(err));
// }

// controllers/shop.js
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product); 
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    });
};

// exports.postcart = (req, res, next) => {
//   const prodId = req.body.productId ;
//   Product.findById(prodId)
//   .then(product=>{
//     return req.user.addToCart(product) ;
//   })
//   .then(result=>{
//     res.redirect('/cart');
//   })
//   .catch(err=>{
//     console.log(err) ;
//   })
// }

exports.postcart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      res.json({ message: "Added to cart", cart: result }); // ✅ send JSON
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    });
};

// exports.getIndex = (req, res, next) => { 
//   Product.find()
//     .then(products => {
//       res.render('shop/index', {
//         prods: products,
//         pageTitle: 'Shop',
//         path: '/',
//         loggedIn:req.session.loggedIn
//       });
//     })
//     .catch(err => console.log(err));
// };

// controllers/shop.js
// exports.getIndex = (req, res, next) => {
//   Product.find()
//     .then(products => {
//       res.json({
//         prods: products,
//         pageTitle: 'Shop',
//         loggedIn: req.session ? req.session.loggedIn : false
//       });
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: "Failed to fetch products" });
//     });
// };
// Example: GET /?page=2&limit=6&sort=asc&search=apple
exports.getIndex = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;   // default page 1
    const limit = parseInt(req.query.limit) || 5; // default 6 per page
    const skip = (page - 1) * limit;

    const sort = req.query.sort === "asc" ? { price: 1 } : 
                 req.query.sort === "desc" ? { price: -1 } : {};

    const search = req.query.search ? {
      title: { $regex: req.query.search, $options: "i" } // case-insensitive search
    } : {};

    // fetch filtered, sorted, paginated products
    const products = await Product.find(search)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(search);
    //console.log(products[0].price)
    res.json({
      prods: products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      loggedIn: req.session ? req.session.loggedIn : false
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};



exports.getCart = (req, res, next) => {
    //console.log("Got a cart request") ;
    let totalprice = 0;  let products=[] ;
    req.user.populate('cart.items.productId')
    .then(user => {
       products = user.cart.items ;
      products = products.filter(p=>{
        return p.productId!=null 
      }) ;
      user.cart.items = products ;
      return user.save() ;
    })
    .then(result=>{

      for(let product of products)
        {
          totalprice += (product.productId.price*product.quantity)
        }
      
      res.json({
        products: products,
        totalPrice: totalprice,
      });
    })
    .catch(err => console.log(err))
 
};

exports.deleteCartproduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteCartItem(prodId)
    .then(user => {
      res.json({
        success: true,
        message: "Item deleted",
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Server error while deleting product",
      });
    });
}

exports.getPostOrder=(req,res,next)=>{
  req.user.populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items.map(i=>{
      return { quantity : i.quantity , product:{...i.productId._doc} }
    })
    const order = new Order({
       items:products ,   
      
      user : {
        email:req.user.email,
        userId:req.user._id  
      }
    })
    return order.save() ;
  })
  .then(result=>{
    return req.user.clearCart();
  })
  .then(result=>{
    res.json({success:true}) ;
  })
  .catch(err=>{console.log(err);})
}

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId':req.user._id})
  .then(orders=>{
    res.json({orders:orders})
  })
  .catch(err=>{
    console.log(err) ;
  })
 
};

exports.getloginreq = (req,res,next)=>{
  res.render('shop/loginreq',{
    pageTitle : 'Login required',
    path:'/loginreq',
    loggedIn:req.session.loggedIn
  }) ;
}


exports.addReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Make sure user info is present
    if (!req.user) return res.status(401).json({ message: "User not logged in" });

    const review = {
      user: req.user._id,       // user id from session
      username: req.user.email,  // username from session
      rating,
      comment,
      createdAt: new Date()
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add review" });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // find the product
    const product = await Product.findById(productId).select("title reviews averageRating numReviews");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
 ;
    res.json({
      productId: product._id,
      title: product.title,
      reviews: product.reviews || [],
      averageRating: product.averageRating || 0,
      numReviews: product.numReviews || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'    
//   });
// };
