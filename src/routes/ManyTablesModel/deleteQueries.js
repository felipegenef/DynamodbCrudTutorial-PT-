const User = require("../../models/User");

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await User.delete(id);
    res.status(200).send("user deleted");
  } catch (error) {
    res.status(404).send("user not found");
  }
}
async function deleteUsers(req, res) {
  try {
    const { usersList } = req.body;
    //usersList=[id1,id2]

    await User.batchDelete(usersList);
    res.status(200).send("users deleted");
  } catch (error) {
    res.status(404).send("users not found");
  }
}
async function deleteGame(req, res) {
  try {
    const { id } = req.params;
    await User.delete(id);
    res.status(200).send("user deleted");
  } catch (error) {
    res.status(404).send("user not found");
  }
}
async function deleteGames(req, res) {
  try {
    const { usersList } = req.body;
    //usersList=[id1,id2]

    await User.batchDelete(usersList);
    res.status(200).send("users deleted");
  } catch (error) {
    res.status(404).send("users not found");
  }
}
module.exports = { deleteUser, deleteUsers, deleteGame, deleteGames };
