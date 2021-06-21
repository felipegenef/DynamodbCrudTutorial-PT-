const User = require("../models/User");
const express = require("express");
const server = express.Router();
server.post("/createUser", async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.create({
      login,
      password,
    });
    res.send(user);
  } catch (error) {
    console.error(error);
  }
});

server.get("/FindAllUsers", async (req, res) => {
  try {
    let user = await User.scan().exec();
    user = await User.scan().exec();
    console.log(user);
    res.send({
      users: user.toJSON(),
      timesScanned: user.timesScanned,
      //quantos documentos batem com a condição
      count: user.count,
      //quantos documentos foram lidos
      scannedCount: user.scannedCount,
      lastKey: user.lastKey,
    });
  } catch (error) {
    console.error(error);
  }
});
module.exports = server;
