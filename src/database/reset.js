const dynamoose = require("dynamoose");
dynamoose.aws.sdk.config.update({
  accessKeyId: "AKID",
  secretAccessKey: "SECRET",
  region: "us-east-1",
});

dynamoose.aws.ddb().deleteTable({ TableName: "User" }, (err, resp) => {
  if (err) {
    console.error(err);
  }
  console.log(resp);
});

dynamoose.aws
  .ddb()
  .deleteTable({ TableName: "ProjectNameTable" }, (err, resp) => {
    if (err) {
      console.error(err);
    }
    console.log(resp);
  });

dynamoose.aws.ddb().deleteTable({ TableName: "Game" }, (err, resp) => {
  if (err) {
    console.error(err);
  }
  console.log(resp);
});
