const mongoose = require(`mongoose`);
const os = require("os");

const countConnect = () => {
  const numberConnect = mongoose.connections.length;
  console.log(`Number of connections :: ${numberConnect}`);
};

const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnection = numCores * 5;
    console.log(`Active connection : ${numConnection}`);
    console.log(`NumCores: ${numCores}`);
    console.log(`Memory Usage : ${memoryUsage/1024/1024} MB`);
    
    if (numConnection > maxConnection) {
      console.log("Connection overload detected");
    }
  }, 5000);
};

module.exports = { countConnect, checkOverLoad };
