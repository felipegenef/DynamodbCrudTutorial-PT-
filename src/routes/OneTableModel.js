const User = require("../models/UserOneTableModel");
const express = require("express");
const server = express.Router();

server.post("/createUser", async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.create({
      login,
      password,
    });
    console.log(user);
    res.send(user);
  } catch (error) {
    console.error(error);
  }
});

server.get("/FindAllUsers", async (req, res) => {
  try {
    const user = await User.query("table").eq("Users").exec();
    res.send({
      users: user.toJSON(),
      timesQueried: user.timesQueried,
      //quantos documentos batem com a condição
      count: user.count,
      //quantos documentos foram lidos
      queriedCount: user.queriedCount,
      lastKey: user.lastKey,
    });
  } catch (error) {
    console.error(error);
  }
});
module.exports = server;
