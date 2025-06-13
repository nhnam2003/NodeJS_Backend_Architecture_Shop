"use stric";

const mongoose = require("mongoose");

var keyTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Shop", },
    publicKey: { type: String, required: true, },
    privateKey: { type: String, required: true, },
    refreshTokensUsed: { type: Array, default: [], },
    refreshToken: { type: String, required: true }
  },
  {
    collection: "Key",
    timestamps: true,
  }
);

module.exports = mongoose.model("KeyToken", keyTokenSchema);
