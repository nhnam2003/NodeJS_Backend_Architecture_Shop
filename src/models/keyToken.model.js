"use stric";

const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
  },
  {
    collection: "Key",
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("KeyToken", keyTokenSchema);
