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
