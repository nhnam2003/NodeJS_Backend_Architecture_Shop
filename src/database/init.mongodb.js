`use strict`;
const mongoose = require(`mongoose`);
const { countConnect } = require("../helper/check.connect");

const connectString = "mongodb://localhost:27017/ShopDev";

class Database {
  constructor() {
    this.connect();
  }
  //connect
  connect(type = `mongodb`) {
    if (1 === 1) {
      mongoose.set(`debug`, true);
      mongoose.set(`debug`, { color: true });
    }
    mongoose
      .connect(connectString)
      .then((_) => {
        console.log("Connect Mongodb Success", countConnect());
      })
      .catch((err) => console.log("Error connect Mongodb", err));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;
