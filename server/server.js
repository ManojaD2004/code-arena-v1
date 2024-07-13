const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const upload = require("./upload");

dotenv.config({ path: "./.env.local" });
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json({ limit: "100mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

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

app.post("/testupload", upload.single("file"), (req, res) => {
  try {
    console.log(req.file);
    res.status(200);
    res.send("Done");
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send(error);
  }
});

app.post("/testapi", (req, res) => {
  try {
    console.log(req.body);
    res.status(200);
    res.send("Done");
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send(error);
  }
});

app.post("/api/memory-dump", (req, res) => {
  try {
    const userid = req.query.userid
    console.log(req.body);
    res.status(200);
    res.send("Done");
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send({ status: "failure", fileId: null });
  }
});

app.listen(PORT, () => {
  console.log(`Listening to Port: ${PORT}`);
});
