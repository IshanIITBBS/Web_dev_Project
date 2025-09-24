const mongoose = require('mongoose') 

const Schema = mongoose.Schema ;

const User = new Schema({
    email:{
        type:String,
        required:true 
    },
    password:{
        type:String,
        required:true 
    },
    cart :{
        items :[{
             productId :{
                type : Schema.Types.ObjectId,
                ref:"Product",
                required:true 
            },
            quantity:{
                type :Number,
                required:true 
            }
        }]
    }

})

User.methods.addToCart = function(product){
    let cart = { items : []} ;
           if(this.cart)
            {
                cart=this.cart ;
            }  
            let cartproductIndex = cart.items.findIndex(item=>{    
               return   item.productId.toString()==product._id.toString(); 
            })
            if(cartproductIndex!=-1)
                {
                    cart.items[cartproductIndex].quantity += 1 ;
                }
             else
             {
                cart.items.push({productId : product._id,
                    quantity:1                 
                })
             }
           this.cart = cart ;
           return this.save();
}

User.methods.deleteCartItem = function(prodId)
{
       this.cart.items = this.cart.items.filter(item=>{ 
        return item.productId != prodId ;
        })
    //    console.log(this.cart.items) ;
        return   this.save() ;
}

User.methods.clearCart = function()
{
    this.cart.items=[];
    this.save();
}
module.exports = mongoose.model('User',User) ;
