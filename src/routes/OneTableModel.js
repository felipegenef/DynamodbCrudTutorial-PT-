const express = require("express");
const server = express.Router();
const createQueries = require("./OneTableModel/CreateQueries");
const getQueries = require("./OneTableModel/getQueries");
const deleteQueries = require("./OneTableModel/deleteQueries");
const updateQueries = require("./OneTableModel/updateQueries");
//                Insert
server.post("/createUser", createQueries.createUser);
server.post("/createUsers", createQueries.createUsers);
server.post("/createGame", createQueries.createGame);
server.post("/createGames", createQueries.createGames);
//                Select

// BetweenExample,
server.get("/FindAllUsers", getQueries.findAll);
server.get("/FindById", getQueries.findById);
server.get("/FindUserByGame", getQueries.FindUserByGame);
server.get("/WhereExample", getQueries.WhereExample);
server.get("/LimitExample", getQueries.LimitExample);
server.get("/AtributesExample", getQueries.AtributesExample);
server.get("/CountExample", getQueries.CountExample);
server.get("/OrderByExample", getQueries.OrderByExample);
server.get("/AllExample", getQueries.AllExample);
server.get("/ContainsExample", getQueries.ContainsExample);
server.get("/AndExample", getQueries.AndExample);
server.get("/EqualExample", getQueries.EqualExample);
server.get("/OrExample", getQueries.OrExample);
server.get("/NotExample", getQueries.NotExample);
server.get("/ExistsExample", getQueries.ExistsExample);
server.get("/LessThenExample", getQueries.LessThenExample);
server.get("/LessThenOrEqualExample", getQueries.LessThenOrEqualExample);
server.get("/GreaterExample", getQueries.GreaterExample);
server.get("/BeginsWithExample", getQueries.BeginsWithExample);
server.get("/INExample", getQueries.INExample);
server.get("/BetweenExample", getQueries.BetweenExample);
//                Update
server.put("/addAge", updateQueries.addAge);
server.put("/removeName", updateQueries.removeName);
server.put("/setName", updateQueries.setName);
server.put("/updateCPF", updateQueries.updateCPF);
server.put("/updateLogin", updateQueries.updateLogin);
server.put("/updateName", updateQueries.updateName);
server.put("/updatePassword", updateQueries.updatePassword);
server.put("/updatePhone", updateQueries.updatePhone);
//                Delete
server.delete("/user/:id", deleteQueries.deleteUser);
server.delete("/deleteUsers", deleteQueries.deleteUsers);
server.delete("/game/:id", deleteQueries.deleteGame);
server.delete("/deleteGames", deleteQueries.deleteGames);
module.exports = server;
