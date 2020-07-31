const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const expressjwt = require("express-jwt");

const app = express();
const PORT = process.env.API_PORT || 8888;

const jwtCheck = expressjwt({
  secret: "secretKey",
  algorithms: ["HS256"],
});

const users = [
  { id: 1, username: "admin", password: "admin" },
  { id: 2, username: "guest", password: "guest" },
];

app.get("/status", (req, res) => {
  const localTime = new Date().toLocaleTimeString();
  res.status(200).send(`server time is ${localTime}`);
});

app.get("/resource", (req, res) => {
  res.status(200).send("This is public so you can see this :)");
});

app.get("/resource/secret", jwtCheck, (req, res) => {
  res.status(200).send("you should be logged to see this :)");
});

app.get("*", (req, res) => {
  res.status(404);
  res.send("page not found");
});

app.use(bodyParser.json());
app.use(cors());

app.post("/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(404).send(`you need to provide a user name and a password`);
    return;
  }
  const user = users.find((u) => {
    return u.username === req.body.username && u.password === req.body.password;
  });

  if (!user) {
    res.status(404).send("user not found");
    return;
  }

  const token = jwt.sign(
    {
      sub: user.id,
      username: user.username,
    },
    "secretKey"
  );

  res.status(200).send({ accessToken: token });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
