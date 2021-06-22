const User = require("../../models/User");

async function findAll(req, res) {
  try {
    const user = await User.scan().exec();
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
}
async function findById(req, res) {
  const { id } = req.body;
  try {
    const user = await User.get(id);
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
  }
}
module.exports = { findAll, findById };
