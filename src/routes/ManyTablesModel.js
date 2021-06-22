const express = require("express");
const server = express.Router();
const createQueries = require("./ManyTablesModel/CreateQueries");
const getQueries = require("./ManyTablesModel/getQueries");
const deleteQueries = require("./ManyTablesModel/deleteQueries");
const updateQueries = require("./ManyTablesModel/updateQueries");
//                Insert
server.post("/createUser", createQueries.createUser);
server.post("/createUsers", createQueries.createUsers);
//                Select
server.get("/FindAllUsers", getQueries.findAll);
server.get("/FindById", getQueries.findById);
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
server.delete("/:id", deleteQueries.deleteUser);
server.delete("/deleteUsers", deleteQueries.deleteUsers);
module.exports = server;
