const User = require("../../models/UserOneTableModel");
const Game = require("../../models/GameOneTableModel");
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
    return res.status(500).send(error);
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
    return res.status(500).send(error);
  }
}

async function FindUserByGame(req, res) {
  const { gameId } = req.body;
  // gameId={id:id1,table:"Game"}
  try {
    const searchGame = new Game(gameId);
    const game = await Game.get(searchGame);
    if (!game) return res.status(500).send("Game not found");
    const withoutPopulate = game.toJSON();
    //isso faz o user ser populado
    const withPopulate = await game.populate();
    return res.send({ withPopulate, withoutPopulate });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function WhereExample(req, res) {
  try {
    const user = await User.query("table")
      .eq("Users")
      .where("name")
      .eq("Will")
      .exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function LimitExample(req, res) {
  try {
    //limite de leituras no banco
    const user = await User.query("table")
      .eq("Users")
      .where("name")
      .eq("Will")
      .limit(10)
      .exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function AtributesExample(req, res) {
  try {
    const user = await User.query("table")
      .eq("Users")
      .where("name")
      .eq("Will")
      .attributes(["id", "name", "age"])
      .exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function CountExample(req, res) {
  try {
    const numberOfusers = await User.query("table")
      .eq("Users")
      .where("name")
      .eq("Will")
      .count()
      .exec();
    res.send(numberOfusers);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

async function OrderByExample(req, res) {
  try {
    const user = await User.query("table").eq("Users").sort("ascending").exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function AllExample(req, res) {
  try {
    const user = await User.query("table").eq("Users").all().exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function ContainsExample(req, res) {
  try {
    const user = await User.query("table")
      .eq("Users")
      .where("name")
      .contains("Will")
      .exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function AndExample(req, res) {
  try {
    const user = await User.query("table")
      .eq("Users")
      .where("name")
      .contains("Will")
      .and()
      .where("age")
      .eq(32)
      .exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function EqualExample(req, res) {
  try {
    const user = await User.query("table")
      .eq("Users")
      .where("age")
      .eq(32)
      .exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function OrExample(req, res) {
  try {
    const user = await User.query("table").eq("Users").exec();
    //Não há condição Or para query(nossa tabela unica sempre busca entidades por query)
    const filterdUsers = user.filter((u) => u.name === "Will" || u.age === 60);
    res.send(filterdUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function NotExample(req, res) {
  try {
    const user = await User.query("table")
      .eq("Users")
      .where("age")
      .not()
      .eq(32)
      .exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function ExistsExample(req, res) {
  try {
    const user = await User.query("table")
      .eq("Users")
      .where("age")
      .exists()
      .exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function LessThenExample(req, res) {
  try {
    const user = await User.query("table")
      .eq("Users")
      .where("age")
      .lt(32)
      .exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function LessThenOrEqualExample(req, res) {
  try {
    const user = await User.query("table")
      .eq("Users")
      .where("age")
      .le(32)
      .exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function GreaterExample(req, res) {
  try {
    const user = await User.query("table")
      .eq("Users")
      .where("age")
      .gt(32)
      .exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function BeginsWithExample(req, res) {
  try {
    const user = await User.query("table")
      .eq("Users")
      .where("name")
      .beginsWith("W")
      .exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function INExample(req, res) {
  try {
    const user = await User.query("table")
      .eq("Users")
      .where("name")
      .in(["Will", "Bob"])
      .exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function BetweenExample(req, res) {
  try {
    const user = await User.query("table")
      .eq("Users")
      .where("age")
      .between(32, 82)
      .exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
module.exports = {
  findAll,
  findById,
  FindUserByGame,
  WhereExample,
  LimitExample,
  AtributesExample,
  CountExample,
  OrderByExample,
  AllExample,
  ContainsExample,
  AndExample,
  EqualExample,
  OrExample,
  NotExample,
  ExistsExample,
  LessThenExample,
  LessThenOrEqualExample,
  GreaterExample,
  BeginsWithExample,
  INExample,
  BetweenExample,
};
