require("dotenv").config();

const express = require("express");
const app = express();

const connectDB = require("./db/connect");

// Middlewares
app.use(express.json({}));

app.get("/", (req, res) => {
  return res.send(`<h1>All clear</h1>`);
});

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
