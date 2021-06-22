const dynamoose = require("dynamoose");
dynamoose.aws.sdk.config.update({
  accessKeyId: "AKID",
  secretAccessKey: "SECRET",
  region: "us-east-1",
});

dynamoose.aws.ddb.local("http://localhost:4567");
