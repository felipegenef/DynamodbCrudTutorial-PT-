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
