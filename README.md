<img width="100%" height="150px" src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" style="object-position:center 50%">

# DynamoDB CRUD Tutorial (PT)

<img class="icon" width="50px" height="50px" src="https://amazon-dynamodb-labs.com/images/Amazon-DynamoDB.png"/>

# Introdução

Para utilizar o DynamoDB e fazer querys existem muitas maneiras de modelar seus dados, porém vou me utilizar de somente dois modelos: Um com **uma tabela por entidade**, o que se assimila mais aos meios mais comuns de modelagem de dados(SQL) , e **outro com somente uma tabela por projeto**, **utilizando da chave da partição(PK) para identificar a entidade do dado persistido e a chave de ordenação(SK) para identificar o id do dado persistido.**

Este ultimo exemplo é amplamente utilizado pela comunidade para modelagemd e dados no dynamoDB , porém é importante enfatizar que **uma partição pode ter ate 10GB de dados**, portanto, cada entidade poderá ter no máximo 10GB de dados antes de que seja necessário a migração para o primeiro modelo.

Para ambos os exemplos estaremos realizando todos os processos de CRUD com o **ORM Dynamoose**.

# Baixar dynamoDB Local

1. Va no site da amazon e baixe o arquivo

[Implantar o DynamoDB localmente em seu computador](https://docs.aws.amazon.com/pt_br/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)

2. dentro do arquivo baixado e ja extraido digite

```jsx
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -port 4567
```

3. coloque o seguinte codigo para rodar seu dynamodbLocal

```jsx
const dynamoose = require("dynamoose");
dynamoose.aws.sdk.config.update({
  accessKeyId: "AKID",
  secretAccessKey: "SECRET",
  region: "us-east-1",
});
dynamoose.aws.ddb.local("http://localhost:4567");
```

# Dynamoose

## Instalar

```jsx
yarn add dynamoose
```

## Criar arquivo de configuração do dynamoose

Para utilizar o dynamo localmente você pode passar quaisquer strings como parametro, porém quando estiver em produção com seu banco na aws, deverá se passar suas credenciais de um usuário IAM

```jsx
const dynamoose = require("dynamoose");

dynamoose.aws.sdk.config.update({
  accessKeyId: "AKID",
  secretAccessKey: "SECRET",
  region: "us-east-1",
});
```

## Criar Modelos (Uma entidade por tabela)

```jsx
const dynamoose = require("dynamoose");
const { v4: uuidv4 } = require("uuid");
const userSchema = new dynamoose.Schema(
  {
    // By default the hashKey will be the first key in the Schema object.
    //hashKey is commonly called a partition key in the AWS documentation.
    id: {
      type: String,
      required: true,
      hashKey: true,
      default: uuidv4,
    },
    login: {
      type: String,
      required: true,
      set: (value) => `${value.toLowerCase().trim()}`,
    },
    name: String,
    age: Number,
    cpf: String,
    phone: String,
    password: { type: String, required: true },
  },
  { saveUnknown: true, timestamps: true }
);

module.exports = dynamoose.model("User", userSchema);
```

## Referenciar outros modelos(Uma entidade por tabela)

```jsx
const dynamoose = require("dynamoose");
const User = require("./User");
const { v4: uuidv4 } = require("uuid");
const gameSchema = new dynamoose.Schema({
  id: {
    type: String,
    required: true,
    hashKey: true,
    default: uuidv4,
  },
  name: { type: String, required: true },
  state: String,
  user: { type: Array, schema: [User] },
});
module.exports = dynamoose.model("Game", gameSchema);
```

## Criar Modelos (Uma tabela por projeto)

```jsx
const dynamoose = require("dynamoose");
const { v4: uuidv4 } = require("uuid");
const userSchema = new dynamoose.Schema(
  {
    // By default the hashKey will be the first key in the Schema object.
    //hashKey is commonly called a partition key in the AWS documentation.
    table: {
      type: String,
      required: true,
      hashKey: true,
      default: "Users",
    },
    id: {
      type: String,
      required: true,
      // By default the rangeKey won't exist.
      //rangeKey is commonly called a sort key in the AWS documentation.
      rangeKey: true,
      default: uuidv4,
    },
    name: String,
    age: Number,
    login: {
      type: String,
      required: true,
      set: (value) => `${value.toLowerCase().trim()}`,
    },
    cpf: String,
    phone: String,
    password: { type: String, required: true },
  },
  { saveUnknown: true, timestamps: true }
);

module.exports = dynamoose.model("ProjectNameTable", userSchema);
```

## Referenciar outros modelos (Uma tabela por projeto)

```jsx
const dynamoose = require("dynamoose");
const User = require("./UserOneTableModel");
const { v4: uuidv4 } = require("uuid");
const gameSchema = new dynamoose.Schema({
  // By default the hashKey will be the first key in the Schema object.
  //hashKey is commonly called a partition key in the AWS documentation.
  table: {
    type: String,
    required: true,
    hashKey: true,
    default: "Game",
  },
  id: {
    type: String,
    required: true,
    // By default the rangeKey won't exist.
    //rangeKey is commonly called a sort key in the AWS documentation.
    rangeKey: true,
    default: uuidv4,
  },
  name: { type: String, required: true },
  state: String,
  user: { type: Array, schema: [User] },
});
module.exports = dynamoose.model("ProjectNameTable", gameSchema);
```

# Create

### Criando um usuário(Uma tabela por projeto)

```jsx
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
```

### Criando um Game(Uma tabela por projeto)

```jsx
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
```

### Criando vários usuários por vez(Uma tabela por projeto)

```jsx
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
```

### Criando vários Games por vez(Uma tabela por projeto)

```jsx
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
```

### Criando um usuário(Uma entidade por tabela)

```jsx
async function createUser(req, res) {
  const { login, password, cpf, name, phone, age } = req.body;
  try {
    const user = await User.create({
      login,
      password,
      cpf,
      age,
      name,
      phone,
    });
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
}
```

### Criando um Game(Uma entidade por tabela)

```jsx
async function createGame(req, res) {
  const { state, user, name } = req.body;
  //user={id:id}
  try {
    const userForInsert = new User(user);
    const userExists = await User.get(userForInsert);
    if (!userExists) return res.status(500).send(`User ${user} does not exist`);
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
```

### Criando vários usuários por vez(Uma entidade por tabela)

```jsx
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
```

### Criando vários Games por vez(Uma entidade por tabela)

```jsx
async function createGames(req, res) {
  const { gamesList } = req.body;
  // {
  //
  //  gamesList: [
  //     {
  //       state: "Launched",
  //       name: "Battlefield3",
  //       user:{id:id1},
  //     },
  //     {
  //       state: "Launched",
  //       name: "COD",
  //       user: {id:id2 },
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
```

# Populate(Uma entidade por tabela)

```jsx
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
```

# Populate(Uma tabela por projeto)

```jsx
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
```

# Delete

## Deletando um usuário (Uma entidade por tabela)

```jsx
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await User.delete(id);
    res.status(200).send("user deleted");
  } catch (error) {
    res.status(404).send("user not found");
  }
}
```

## Deletando um usuário (Uma tabela por projeto)

```jsx
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await User.delete({ id, table: "Users" });
    res.status(200).send("user deleted");
  } catch (error) {
    res.status(404).send("user not found");
  }
}
```

## Deletando muitos por vez(Uma entidade por tabela)

```jsx
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
```

## Deletando muitos por vez(Uma tabela por projeto)

```jsx
async function deleteUsers(req, res) {
  try {
    const { usersList } = req.body;
    //usersList=[{id:id1,table:"Users"},{id:id2,table:"Users"}]

    await User.batchDelete(usersList);
    res.status(200).send("users deleted");
  } catch (error) {
    res.status(404).send("users not found");
  }
}
```

# Update

## Update por ID(Uma entidade por tabela)

modifica o nome do usuário

```jsx
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
```

## Update por ID(Uma tabela por projeto)

modifica o nome do usuário

```jsx
async function updateName(req, res) {
  try {
    const { name, id } = req.body;
    const user = await User.update({ name, id, table: "Users" });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
```

## $SET(Uma entidade por tabela)

muda o nome do usuário encontrado para Bob

```jsx
async function setName(req, res) {
  try {
    const { id } = req.body;
    const user = await User.update({ id }, { $SET: { name: "Bob" } });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
```

## $SET(Uma tabela por projeto)

muda o nome do usuário encontrado para Bob

```jsx
async function setName(req, res) {
  try {
    const { id } = req.body;
    const user = await User.update(
      { id, table: "Users" },

      { $SET: { name: "Bob" } }
    );
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
```

## $ADD(Uma entidade por tabela)

Adiciona 32 na idade

```jsx
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
```

## $ADD(Uma tabela por projeto)

Adiciona 32 na idade

```jsx
async function addAge(req, res) {
  try {
    const { id } = req.body;
    console.log(id);
    const user = await User.update(
      { id, table: "Users" },
      { $ADD: { age: 32 } }
    );
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
```

## $REMOVE(Uma entidade por tabela)

deleta o atributo name do usuário

```jsx
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
```

## $REMOVE(Uma tabela por projeto)

deleta o atributo name do usuário

```jsx
async function removeName(req, res) {
  try {
    const { id } = req.body;
    const user = await User.update(
      { id, table: "Users" },
      { $REMOVE: ["name"] }
    );
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
```

# Querys

### Get(Uma tabela por projeto)

```jsx
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
```

### Get(Uma entidade por tabela)

```jsx
async function findById(req, res) {
  const { id } = req.body;
  try {
    const user = await User.get(id);
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
  }
}
```

### Where(Uma tabela por projeto)

### Pegando usuários com where

```jsx
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
```

### Where(Uma entidade por tabela)

### Pegando usuários com where

```jsx
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
```

### Limit(Uma tabela por projeto)

### Pegando usuários com where e limite de 5 documentos lidos

```jsx
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
```

### Limit(Uma entidade por tabela)

### Pegando usuários com where e limite de 5 documentos lidos

```jsx
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
```

### Atributes(Uma entidade por tabela)

### Pegando nome , id e idade de usuários

```jsx
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
```

### Atributes(Uma tabela por projeto)

### Pegando nome , id e idade de usuários

```jsx
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
```

### Count(Uma entidade por tabela)

### Contando usuários com nome Will

```jsx
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
```

### Count(Uma tabela por projeto)

### Contando usuários com nome Will

```jsx
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
```

### OrderBy(Uma tabela por projeto)

### Ordendando usuários(quando utilizado o operador sera somente pela SK)

```jsx
async function OrderByExample(req, res) {
  try {
    const user = await User.query("table").eq("Users").sort("ascending").exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
```

### OrderBy(Uma entidade por tabela)

Uma vez que a condição sort não funciona para o Scan, vamos utilizar um metodo sort do javascript nativo.

```jsx
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
```

### ALL(Uma entidade por tabela)

### Pegando todos os usuários

```jsx
async function AllExample(req, res) {
  try {
    const user = await User.query("table").eq("Users").all().exec();
    res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
```

### ALL(Uma tabela por projeto)

### Pegando todos os usuários

```jsx
async function AllExample(req, res) {
  try {
    const user = await User.scan().all().exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
```

### Contains(Uma tabela por projeto)

### Pegando todos os usuários que contenham Will no nome

```jsx
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
```

### Contains(Uma entidade por tabela)

### Pegando todos os usuários que contenham Will no nome

```jsx
async function ContainsExample(req, res) {
  try {
    const user = await User.scan().where("name").contains("Will").exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
```

### And(Uma entidade por tabela)

```jsx
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
```

### And(Uma tabela por projeto)

```jsx
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
```

### Equal(Uma tabela por projeto)

```jsx
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
```

### Equal(Uma entidade por tabela)

```jsx
async function EqualExample(req, res) {
  try {
    const user = await User.scan().where("age").eq(32).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
```

### Or(Uma entidade por tabela)

```jsx
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
```

### Or(Uma tabela por projeto)

Uma vez que a condição or não funciona para o Query, e nossa tabela única necessita do query para não gastar leituras em outras tabelas com um scan, vamos utilizar de um filter do javascript para ter o mesmo efeito.

```jsx
async function OrExample(req, res) {
  try {
    const user = await User.query("table").eq("Users").exec();
    //Não há condição Or para query(nossa tabela unica sempre busca entidades por query)
    const filteredUsers = user.filter((u) => u.name === "Will" || u.age === 60);
    res.send(filteredUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
```

### Not(Uma tabela por projeto)

```jsx
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
```

### Not(Uma entidade por tabela)

```jsx
async function NotExample(req, res) {
  try {
    const user = await User.scan().where("age").not().eq(32).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
```

### Exists(Uma entidade por tabela)

busca todos em que o campo age existe

```jsx
async function ExistsExample(req, res) {
  try {
    const user = await User.scan().where("age").exists().exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
```

### Exists(Uma tabela por projeto)

busca todos em que o campo age existe

```jsx
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
```

### Less then(Uma tabela por projeto)

```jsx
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
```

### Less then(Uma entidade por tabela)

```jsx
async function LessThenExample(req, res) {
  try {
    const user = await User.scan().where("age").lt(32).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
```

### Less then or Equal(Uma entidade por tabela)

```jsx
async function LessThenOrEqualExample(req, res) {
  try {
    const user = await User.scan().where("age").le(32).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
```

### Less then or Equal(Uma tabela por projeto)

```jsx
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
```

### Greater(Uma tabela por projeto)

```jsx
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
```

### Greater(Uma entidade por tabela)

```jsx
async function GreaterExample(req, res) {
  try {
    const user = await User.scan().where("age").gt(32).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
```

### Beggins with(Uma entidade por tabela)

```jsx
async function BeginsWithExample(req, res) {
  try {
    const user = await User.scan().where("name").beginsWith("W").exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
```

### Beggins with(Uma tabela por projeto)

```jsx
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
```

### IN(Uma tabela por projeto)

todos os nomes que sejam ou Will ou Bob

```jsx
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
```

### IN(Uma entidade por tabela)

todos os nomes que sejam ou Will ou Bob

```jsx
async function INExample(req, res) {
  try {
    const user = await User.scan().where("name").in(["Will", "Bob"]).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
```

### Between(Uma entidade por tabela)

```jsx
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
```

### Between(Uma tabela por projeto)

```jsx
async function BetweenExample(req, res) {
  try {
    const user = await User.scan().where("age").between(32, 82).exec();
    return res.send(user.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
```

# Documentação oficial do dynamoose

[https://dynamoosejs.com/](https://dynamoosejs.com/)

# Documentação em outros idiomas

## Português

[felipegenef/DynamooseQuerysDocumentation](https://github.com/felipegenef/DynamooseQuerysDocumentation)

## English

[]()
