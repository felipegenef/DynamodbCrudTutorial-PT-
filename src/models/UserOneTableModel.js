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
