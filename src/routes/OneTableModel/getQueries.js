const User = require("../../models/UserOneTableModel");

async function findAll(req, res) {
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
    res.status(500).send(error);
    console.error(error);
  }
}
async function findById(req, res) {
  const { id } = req.body;
  try {
    const user = await User.get({ table: "Users", id });
    res.send(user.toJSON());
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
}
module.exports = { findAll, findById };
