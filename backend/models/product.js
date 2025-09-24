const mongoose = require('mongoose') ;



const Schema = mongoose.Schema ;
const reviewSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  
    required: true
  },
  username: {
    type: String,
    required: true   
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

   
  reviews: [reviewSchema],

 
  averageRating: {
    type: Number,
    default: 0
  },

  numReviews: {
    type: Number,
    default: 0
  }
})

module.exports =mongoose.model('Product',productschema) ;



