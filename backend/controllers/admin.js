const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    editing:false,
    loggedIn:req.session.loggedIn
  });
};



exports.editproduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ product:product });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Fetching product failed" });
    });
};


exports.posteditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const desc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" }); 
      }

      if (product.UserId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = desc;
      return product.save();
    })
    .then(result => {
      if (result) {
        res.json({success:true}) ;
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" }); 
    });
};


exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title:title,
    imageUrl:imageUrl,
    price:price,
    description:description,
    UserId:req.user._id 
  }) ;
  product.save()
  .then(result=>{
    res.json({success:true}) ;
  })
  .catch(err=>{
    console.log(err) ;
  })
};

exports.getProducts = (req, res, next) => {
   //console.log("hehe") ;
Product.find({"UserId":req.user._id})
  .then(products=>{
      res.json({
      prods: products
    });
  })
  .catch(err=>console.log(err))
};



exports.deleteproduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findByIdAndDelete(prodId)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        deletedProduct: result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    });
}
