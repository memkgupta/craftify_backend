import { Schema,model } from "mongoose";
const cartSchema = new Schema(
    {
      owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      items: {
        type: [
          {
            productId: {
              type: Schema.Types.ObjectId,
              ref: "Product",
            },
            quantity: {
              type: Number,
              required: true,
              min: [1, "Quantity can not be less then 1."],
              default: 1,
            },
          },
        ],
        default: [],
      },
      
    },
  
    { timestamps: true }
  );
  
  const Cart = model("Cart",cartSchema);
  export default Cart;