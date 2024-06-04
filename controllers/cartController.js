import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const getCart = async (userId) => {
    const cartAggregation = await Cart.aggregate([
        {
          $match: {
            owner: userId,
          },
        },
        {
          $unwind: "$items",
        },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $project: {
            // _id: 0,
            product: { $first: "$product" },
            quantity: "$items.quantity",
          
          },
        },
        {
          $group: {
            _id: "$_id",
            items: {
              $push: "$$ROOT",
            },
            coupon: { $first: "$coupon" }, // get first value of coupon after grouping
            cartTotal: {
              $sum: {
                $multiply: ["$product.price", "$quantity"], // calculate the cart total based on product price * total quantity
              },
            },
          },
        },
       
      
     
      ]);

      return (
        cartAggregation[0] ?? {
          _id: null,
          items: [],
          cartTotal: 0,
         
        }
      );

};
export const getUserCart = asyncHandler(async (req, res) => {
    let cart = await getCart(req.user._id);
  
    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart fetched successfully"));
  });
export const addItemOrUpdateItemQuantity = async(req,res,next)=>{
    const { productId } = req.params;
    const { quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    let cart = await Cart.findOne({
        owner: req.user._id,
      });
      if(!cart){
        cart = await Cart.create({
            owner:req.user._id,
            items:[]
        })
      }
    if (!product) {
        return next( new ErrorHandler(404, "Product does not exist"));
      }

      if (quantity > product.stock_quantity) {
        // if quantity is greater throw an error
       return next(new ErrorHandler(
            400,
            product.stock_quantity > 0
              ? "Only " +
                product.stock_quantity +
                " products are remaining. But you are adding " +
                quantity
              : "Product is out of stock"
          )) 
      }
      const addedProduct = cart.items?.find(
        (item) => item.productId.toString() === productId
      );

      if(addedProduct){
        addedProduct.quantity = quantity;
      }
      else {
        // if its a new product being added in the cart push it to the cart items
        cart.items.push({
          productId,
          quantity,
        });
      }

      await cart.save({validateBeforeSave:true});
      const newCart = await getCart(req.user._id);
      res
    .status(200)
    .json(newCart, "Item added successfully");
}
export const removeItemFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
  
    const product = await Product.findById(productId);
  
    // check for product existence
    if (!product) {
      throw new ApiError(404, "Product does not exist");
    }
  
    const updatedCart = await Cart.findOneAndUpdate(
      {
        owner: req.user._id,
      },
      {
        // Pull the product inside the cart items
        // ! We are not handling decrement logic here that's we are doing in addItemOrUpdateItemQuantity method
        // ! this controller is responsible to remove the cart item entirely
        $pull: {
          items: {
            productId: productId,
          },
        },
      },
      { new: true }
    );
  
    let cart = await getCart(req.user._id);
  
    
  
    return res
      .status(200)
      .json({cart:cart,message:"Cart item removed successfully"});
  });
export  const clearCart = asyncHandler(async (req, res) => {
    await Cart.findOneAndUpdate(
      {
        owner: req.user._id,
      },
      {
        $set: {
          items: [],
          
        },
      },
      { new: true }
    );
    const cart = await getCart(req.user._id);
  
    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart has been cleared"));
  });
