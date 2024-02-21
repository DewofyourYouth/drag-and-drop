const express = require("express");
const app = express();
let list = { tier1: ["Item 1", "Item 2"], tier2: ["Item 3", "Item 4"] };
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/list", (req, res) => {
  res.json(list);
});

app.post("/list", (req, res) => {
  list = req.body;
  res.json(list);
});

app.listen(3000, () => console.log("Listening on port 3000"));
