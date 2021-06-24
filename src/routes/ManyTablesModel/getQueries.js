const User = require("../../models/User");
const Game = require("../../models/Game");
const dynamoose = require("dynamoose");
async function findAll(req, res) {
  try {
    const user = await User.scan().exec();
    return res.send({
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
    return res.status(500).send(error);
  }
}

async function findById(req, res) {
  const { id } = req.body;
  try {
    const user = await User.get(id);
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

async function FindUserByGame(req, res) {
  const { gameId } = req.body;
  // gameId={id:id1}
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
    const condition = new dynamoose.Condition().where("name").eq("Will");
    const user = await User.scan(condition).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function LimitExample(req, res) {
  try {
    const condition = new dynamoose.Condition().where("name").eq("Will");
    const user = await User.scan(condition).limit(3).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function AtributesExample(req, res) {
  try {
    const condition = new dynamoose.Condition().where("name").eq("Will");
    const user = await User.scan(condition)
      .attributes(["id", "name", "age"])
      .exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function CountExample(req, res) {
  try {
    const condition = new dynamoose.Condition().where("name").eq("Will");

    const numberOfUsers = await User.scan(condition).count().exec();
    return res.send(numberOfUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

async function OrderByExample(req, res) {
  try {
    const user = await User.scan().exec();
    user.sort((a, b) => a - b);
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function AllExample(req, res) {
  try {
    const user = await User.scan().all().exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function ContainsExample(req, res) {
  try {
    const user = await User.scan().where("name").contains("Will").exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function AndExample(req, res) {
  try {
    const user = await User.scan()
      .where("name")
      .contains("Will")
      .and()
      .where("age")
      .eq(32)
      .exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function EqualExample(req, res) {
  try {
    const user = await User.scan().where("age").eq(32).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function OrExample(req, res) {
  try {
    const user = await User.scan()
      .where("name")
      .contains("Will")
      .or()
      .where("age")
      .eq(32)
      .exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function NotExample(req, res) {
  try {
    const user = await User.scan().where("age").not().eq(32).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function ExistsExample(req, res) {
  try {
    const user = await User.scan().where("age").exists().exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function LessThenExample(req, res) {
  try {
    const user = await User.scan().where("age").lt(32).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function LessThenOrEqualExample(req, res) {
  try {
    const user = await User.scan().where("age").le(32).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function GreaterExample(req, res) {
  try {
    const user = await User.scan().where("age").gt(32).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function BeginsWithExample(req, res) {
  try {
    const user = await User.scan().where("name").beginsWith("W").exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function INExample(req, res) {
  try {
    const user = await User.scan().where("name").in(["Will", "Bob"]).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
async function BetweenExample(req, res) {
  try {
    const user = await User.scan().where("age").between(32, 82).exec();
    return res.send(user.toJSON());
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
