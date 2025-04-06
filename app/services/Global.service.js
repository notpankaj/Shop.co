const DressTypeModel = require("../models/DressType.model");
const DressStyleModel = require("../models/DressStyle.model");
const KEYS = require("../config/keys");
const Stripe = require("stripe")(KEYS.STRIPE_SK);

class GlobalService {
  /**
   * Get all Dress Types
   */
  static async getAllDressTypes() {
    const list = await DressTypeModel.find({});
    return {
      success: true,
      message: "Dress Types fetched successfully",
      data: list,
    };
  }

  /**
   * Get all Dress Styles
   */
  static async getAllDressStyles() {
    const list = await DressStyleModel.find({});
    return {
      success: true,
      message: "Dress Styles fetched successfully",
      data: list,
    };
  }
  /**
   * Stripe Checkout
   */
  static async stripeCheckout(req) {
    const { products, success_url, cancel_url } = req.body;

    const lineItems = products?.map((product) => {
      const variant = product?.product?.variants?.find(
        (item) => item?._id === product?.variant_id
      );

      const unit_amount = Math.round(variant?.price * 100);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product?.product?.name,
            images: variant?.photos || [],
          },
          unit_amount: unit_amount > 300000 ? 29000 : unit_amount, // Price in cents
        },
        quantity: product.qty,
      };
    });

    const session = await Stripe.checkout?.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: success_url || "http://localhost:5173/success",
      cancel_url: cancel_url || "http://localhost:5173/cancel",
    });

    return {
      success: true,
      message: "Checkout Created successfully",
      data: {
        id: session.id,
        lineItems,
      },
    };
  }
}

module.exports = GlobalService;
