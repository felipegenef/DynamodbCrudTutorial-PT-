const User = require("../../models/UserOneTableModel");

async function createUser(req, res) {
  const { login, password, cpf, name, phone } = req.body;
  try {
    const user = await User.create({
      login,
      password,
      cpf,
      name,
      phone,
    });
    console.log(user);
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
}
async function createUsers(req, res) {
  const { usersList } = req.body;
  // usersList = [
  //   {
  //     login1,
  //     password1,
  //     cpf1,
  //     name1,
  //     phone1
  //   },
  //   {
  //     login2,
  //     password2,
  //     cpf2,
  //     name2,
  //     phone2
  //   },
  // ];
  try {
    const users = await User.batchPut(usersList);
    console.log(users);
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
}
module.exports = { createUser, createUsers };
