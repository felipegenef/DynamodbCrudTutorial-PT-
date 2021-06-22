const User = require("../../models/User");

async function updateName(req, res) {
  try {
    const { name, id } = req.body;
    const user = await User.update({ name, id });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
async function updateCPF(req, res) {
  try {
    const { cpf, id } = req.body;
    const user = await User.update({ cpf, id });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
async function updatePassword(req, res) {
  try {
    const { password, id } = req.body;
    const user = await User.update({ password, id });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
async function updatePhone(req, res) {
  try {
    const { phone, id } = req.body;
    const user = await User.update({ phone, id });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
async function updateLogin(req, res) {
  try {
    const { login, id } = req.body;
    const user = await User.update({ login, id });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function addAge(req, res) {
  try {
    const { id } = req.body;
    const user = await User.update({ id }, { $ADD: { age: 32 } });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
async function removeName(req, res) {
  try {
    const { id } = req.body;
    const user = await User.update({ id }, { $REMOVE: ["name"] });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
async function setName(req, res) {
  try {
    const { id } = req.body;
    const user = await User.update({ id }, { $SET: { name: "WILL Smith" } });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
module.exports = {
  updateCPF,
  updateLogin,
  updateName,
  updatePassword,
  updatePhone,
  addAge,
  removeName,
  setName,
};
