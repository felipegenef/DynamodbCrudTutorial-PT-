require("./database/init");
const OneTableModel = require("./routes/OneTableModel");
const ManyTableModel = require("./routes/ManyTablesModel");
const morgan = require("morgan");
const express = require("express");
const server = express();

require("dotenv").config();
server.use(morgan("dev"));
server.use(express.json());

server.use("/OneTableModel", OneTableModel);

server.use("/ManyTableModel", ManyTableModel);

//               SERVER                     //

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`app started on port ${PORT}`);
});
