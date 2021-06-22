<img width="100%" height="150px" src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" style="object-position:center 50%">

# DynamoDB CRUD Tutorial (PT)

<img class="icon" width="50px" height="50px" src="https://amazon-dynamodb-labs.com/images/Amazon-DynamoDB.png"/>

# Introdução

Para utilizar o DynamoDB e fazer querys, existem muitos modelos de modelagem de dados, porém vou me utilizar de somente dois modelos: Um com **uma tabela por entidade**, o que se assimila mais aos modelos Tradicionais de modelagem de dados, e **um modelo com somente uma tabela por projeto**, **utilizando da chave da partição(PK) para identificar a entidade do dado persistido e a chave de ordenação(SK) para identificar o id do dado persistido.**

Este ultimo modelo é amplamente utilizado pela comunidade para modelagemd e dados no dynamoDB , porém é importante enfatizar que **uma partição pode ter ate 10GB de dados**, portanto, cada entidade poderá ter no máximo 10GB de dados antes de que seja necessário a migração para o primeiro modelo.

Para ambos os modelos estaremos realizando todos os processos de CRUD com o **ORM Dynamoose**.

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
const User = require("./users");
const gameSchema = new dynamoose.Schema({
  id: String,
  state: String,
  user: User,
});
export default Game = dynamoose.model("Game", gameSchema);
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
  state: String,
  user: User,
});
module.exports = dynamoose.model("ProjectNameTable", gameSchema);
```

# Create

### Criando um usuário(Uma tabela por projeto)

```jsx
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
    res.send(user);
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
```

### Criando um usuário(Uma entidade por tabela)

```jsx
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
    res.send(user);
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

### Where

### Pegando usuários com where

```jsx
const response = await User.query("name").eq("Will").exec();
```

### Limit

### Pegando usuários com where e limite de 5

```jsx
const response = await User.query("name").eq("Will").limit(5).exec();
```

### Atributes

### Pegando nome e id de usuários

```jsx
const response = await User.query("name").eq("Will").attributes(["id", "name"]);
```

### Count

### Contando usuários com nome Will

```jsx
const response = await User.query("name").eq("Will").count().exec();
```

### OrderBy

### Ordendando usuários

```jsx
const response = await User.query("name").eq("Will").sort("ascending").exec();
const response = await User.query("name").eq("Will").sort("descending").exec();
```

### ALL

### Pegando todos os usuários

```jsx
const response = await User.query("name")
  .eq("Will")
  .sort("ascending")
  .all()
  .exec();
```

### Contains

### Pegando todos os usuários que contenham Will no nome

```jsx
const response = await User.query("name").contains("Will").exec();
```

## Operadores

### And

```jsx
const condition = new dynamoose.Condition()
  .where("id")
  .eq(1)
  .and()
  .where("name")
  .eq("Bob");
await User.update({ id: id }, { name: name }, { condition });
```

### Equal

```jsx
const condition = new dynamoose.Condition().where("name").eq("Bob");
await User.update({ id: id }, { name: name }, { condition });
```

### Or

```jsx
const condition = new dynamoose.Condition()
  .where("id")
  .eq(1)
  .or()
  .where("name")
  .eq("Bob");
await User.update({ id: id }, { name: name }, { condition });
```

### Not

```jsx
const condition = new dynamoose.Condition().where("id").not().eq(1);
await User.update({ id: id }, { name: name }, { condition });
```

### Where

```jsx
const condition = new dynamoose.Condition()
  .where("id")
  .eq(1)
  .and()
  .where("name")
  .eq("Bob");
await User.update({ id: id }, { name: name }, { condition });
```

### Exists

busca todos em que o campo phoneNumber existe

```jsx
const condition = new dynamoose.Condition().filter("phoneNumber").exists();
await User.get({ condition });
```

### Less then

```jsx
const condition = new dynamoose.Condition().filter("age").lt(5);
await User.update({ id: id }, { name: name }, { condition });
```

### Less then or Equal

```jsx
const condition = new dynamoose.Condition().filter("age").le(5);
await User.update({ id: id }, { name: name }, { condition });
```

### Greater

```jsx
const condition = new dynamoose.Condition().filter("age").gt(5);
await User.update({ id: id }, { name: name }, { condition });
```

### Beggins with

```jsx
const condition = new dynamoose.Condition().filter("name").beginsWith("T");
await User.update({ id: id }, { name: name }, { condition });
```

### Contains

```jsx
const condition = new dynamoose.Condition().filter("name").beginsWith("T");
await User.update({ id: id }, { name: name }, { condition });
```

### IN

todos os nomes que sejam ou Charlie ou Bob

```jsx
const condition = new dynamoose.Condition("name").in(["Charlie", "Bob"]);
await User.update({ id: id }, { name: name }, { condition });
```

### Between

```jsx
//a=5,b=9
const condition = new dynamoose.Condition().filter("age").between(a, b);
await User.update({ id: id }, { name: name }, { condition });
```

# Documentação oficial do dynamoose

[https://dynamoosejs.com/](https://dynamoosejs.com/)

# Documentação em outros idiomas

## Português

[felipegenef/DynamooseQuerysDocumentation](https://github.com/felipegenef/DynamooseQuerysDocumentation)

## English

[]()
