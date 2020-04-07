const express = require("express");

const server = express();

const port = 8000;

server.use("/", (req, res) => {
  res.send("The API is Working!!!");
});

server.listen(port, () => {
  console.log(`The API is runnig on port ${port} `);
});
