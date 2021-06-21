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
