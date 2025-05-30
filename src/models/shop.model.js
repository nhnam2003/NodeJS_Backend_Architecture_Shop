const mongoose = require("mongoose"); // Erase if already required

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,

    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [`active`, `inactive`],
      default: 'inactive',
    },
    verify: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "Shop",
  }
);

//Export the model
module.exports = mongoose.model("Shop ", userSchema);
