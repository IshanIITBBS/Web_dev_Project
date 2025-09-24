const mongoose = require('mongoose') ;



const Schema = mongoose.Schema ;
const reviewSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // reference to User model
    required: true
  },
  username: {
    type: String,
    required: true   // for easy access without populating
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productschema = new Schema({
  title:{
    type:String,
    required :true 
  },
  imageUrl:{
    type:String,
    required:true 
  },
  price:{
    type:Number,
    required:true 
  },
  description:{
    type:String,
    required:true 
  },
  UserId:{
    type:Schema.Types.ObjectId,
    ref:"User", 
    required:true
  },

   // 🆕 Add reviews
  reviews: [reviewSchema],

  // 🆕 Store average rating for faster queries
  averageRating: {
    type: Number,
    default: 0
  },

  // 🆕 Store number of reviews for quick access
  numReviews: {
    type: Number,
    default: 0
  }
})

module.exports =mongoose.model('Product',productschema) ;
// const getdb = require('../util/database').getdb
// const mongodb = require('mongodb') ;
// const User = require('./user') ;
// module.exports = class Product {
//   constructor(title, imageUrl, price, description,id,userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = description;
//     this._id = id ? mongodb.ObjectId.createFromHexString(id):null ;
//     this.userId = userId ;
//   }
  
//   save(){
//     const db = getdb() ;
//     if(this._id)
//       {
//         return db.collection('products').updateOne({_id:this._id},{$set : this})
//         .then(result=>{
//           console.log(result);
//         })
//         .catch(err=>{
//           console.log(err);
//         })
//       }
      
//    return  db.collection('products').insertOne(this)
//     .then(result=>{
//       console.log(result);
//     })
//     .catch(err=>{
//       console.log(err);
//     })
//   }

//   static fetchall()
//   {
//     const db = getdb() ;
//    return db.collection('products').find().toArray()
//     .then(products=>{return products;})
//     .catch(err=>{console.log(err);})
//   }

//   static findById(prodid)
//   {
//     const db = getdb();
//     return db.collection('products').find({_id: mongodb.ObjectId.createFromHexString(prodid)}).next()
//     .then(product=>{
//       return product ;
//     })
//     .catch(err=>{
//       console.log(err) ;
//       throw err ;
//     })
//   }

//   static deleteById(prodId)
//   {
//     const db = getdb();
//       return db.collection('products').deleteOne({_id:mongodb.ObjectId.createFromHexString(prodId)})
     
//   }
// }


