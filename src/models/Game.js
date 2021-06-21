const dynamoose = require("dynamoose");
const User = require("./User");
const gameSchema = new dynamoose.Schema({
  id: {
    type: String,
    required: true,
    hashKey: true,
    default: uuidv4,
  },
  state: String,
  user: User,
});
module.exports = dynamoose.model("Game", gameSchema);
