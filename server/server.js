const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env.local" });
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/home", (req, res) => {
  try {
    res.status(200);
    res.send("Hello Tiger");
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Listening to Port: ${PORT}`);
});
