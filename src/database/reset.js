const dynamoose = require("dynamoose");
dynamoose.aws.sdk.config.update({
  accessKeyId: "AKID",
  secretAccessKey: "SECRET",
  region: "us-east-1",
});
dynamoose.aws.ddb.local("http://localhost:4567");

const Tables = ["Users", "ProjectNameTable", "Game"];

Tables.forEach((table) =>
  dynamoose.aws.ddb().deleteTable({ TableName: table }, (err, resp) => {
    if (err) {
      console.log(`Error deleting table ${table} \nLogs:\n`, err);
    } else {
      console.log(`Deleted table ${table} sucessfully`);
    }
  })
);
// dynamoose.aws.ddb().deleteTable({ TableName: "User" }, (err, resp) => {
//   if (err) {
//     console.error(err);
//   }
//   console.log(resp);
// });

// dynamoose.aws
//   .ddb()
//   .deleteTable({ TableName: "ProjectNameTable" }, (err, resp) => {
//     if (err) {
//       console.error(err);
//     }
//     console.log(resp);
//   });

// dynamoose.aws.ddb().deleteTable({ TableName: "Game" }, (err, resp) => {
//   if (err) {
//     console.error(err);
//   }
//   console.log(resp);
// });
