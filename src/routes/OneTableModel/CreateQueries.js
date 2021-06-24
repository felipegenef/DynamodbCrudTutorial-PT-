const User = require("../../models/UserOneTableModel");
const Game = require("../../models/GameOneTableModel");

async function createUser(req, res) {
  const { login, password, cpf, name, phone, age } = req.body;
  try {
    const user = await User.create({
      login,
      password,
      cpf,
      name,
      age,
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
  //     age1,
  //     phone1
  //   },
  //   {
  //     login2,
  //     password2,
  //     cpf2,
  //     age2,
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

async function createGame(req, res) {
  const { state, user, name } = req.body;
  //user={id,table:"Users"}
  try {
    const userForInsert = new User(user);
    const userExists = await User.get(userForInsert);
    if (!userExists)
      return res.status(500).send(`User ${user.id} does not exist`);
    const game = await Game.create({
      state,
      name,
      user: [userForInsert],
    });
    console.log(game);
    res.send(game);
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
}

async function createGames(req, res) {
  const { gamesList } = req.body;
  // {
  //
  //  gamesList: [
  //     {
  //       state: "Launched",
  //       name: "Battlefield3",
  //       user: { id: "25419715-37b6-4e42-81d4-8cb4b332187f", table: "Users" },
  //     },
  //     {
  //       state: "Launched",
  //       name: "COD",
  //       user: { id: "25419715-37b6-4e42-81d4-8cb4b332187f", table: "Users" },
  //     },
  //   ],
  // };
  try {
    for (let counter = 0; counter < gamesList.length; counter++) {
      const game = gamesList[counter];
      const userForInsert = new User(game.user);
      const userExists = await User.get(userForInsert);
      console.log(userExists);
      if (!userExists)
        return res.status(500).send(`User ${game.user.id} does not exist`);
      game.user = [userForInsert];
    }

    const games = await Game.batchPut(gamesList);
    console.log(games);
    res.send(games);
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
}

module.exports = { createUser, createUsers, createGame, createGames };
