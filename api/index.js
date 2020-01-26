const {
  pgUser,
  pgHost,
  pgPort,
  pgDatabase,
  pgPassword,
  redisHost,
  redisPort
} = require("./keys");

// Express App Setup
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// PG CLient Setup

const { Pool } = require("pg");

const pgClient = new Pool({
  user: pgUser,
  host: pgHost,
  port: pgPort,
  database: pgDatabase,
  password: pgPassword
});

pgClient.on("error", () => console.log("Lost PG connection"));

pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch(err => console.log(err));

// Redis Client Setup

const redis = require("redis");

const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// Route Handlers

app.get("/", (req, res) => {
  res.send("Hi there!");
});

app.get("/values/all", async (req, res) => {
  const { rows: values } = await pgClient.query("SELECT * FROM values");

  res.json(values);
});

app.get("/values/current", (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.json(values);
  });
});

app.post("/values", async (req, res) => {
  const { index } = req.body;

  if (parseInt(index) > 40) return res.status(422).send("Index too high!");

  redisClient.hset("values", index, "Nothing Yet!");
  redisPublisher.publish("insert", index);

  pgClient.query("INSERT INTO values (number) VALUES ($1)", [index]);

  res.json({ working: true });
});

app.listen(5000, () => console.log("Listening"));
