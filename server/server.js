const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const upload = require("./upload");
const sql = require("./db");

dotenv.config({ path: "./.env.local" });
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json({ limit: "2000mb" }));
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

async function createUserIfNotExist(req, res, next) {
  try {
    const userid = req.query.userid;
    console.log(userid);
    if (userid === null || userid === undefined) {
      res.status(400);
      return res.send({ status: "failure", fileId: null });
    }
    let result = await sql`SELECT * FROM users WHERE username = ${userid};`;
    if (result.length === 0) {
      const newUser = {
        username: userid,
      };
      result = await sql`INSERT INTO users ${sql(newUser, "username")};`;
      result = await sql`SELECT * FROM users WHERE username = ${userid};`;
    }
    console.log(result);
    res.user = { user_id: result[0].id };
    next();
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send({ status: "failure", fileId: null });
  }
}

app.post(
  "/api/memory-dump",
  createUserIfNotExist,
  upload.single("file"),
  async (req, res) => {
    try {
      const newFile = {
        user_id: res.user.user_id,
        memory_dump_loc: "./uploads_dumps/" + req.file.filename,
      };
      const fileIdRow = await sql`INSERT INTO memory_dump ${sql(
        newFile,
        "user_id",
        "memory_dump_loc"
      )} RETURNING *`;
      console.log(req.file);
      console.log({ status: "success", fileId: fileIdRow[0].id });
      res.status(201);
      res.send({ status: "success", fileId: fileIdRow[0].id });
    } catch (error) {
      console.log(error);
      res.status(400);
      res.send({ status: "failure", fileId: null });
    }
  }
);

app.post("/api/analyze", (req, res) => {
  try {
    const fileId = req.body.fileId;
    const plugin = req.body.plugin;
    if (plugin === "imageinfo") {
    } else if (plugin === "imageinfo") {
    }
    res.status(200);
    res.send({ status: "analysis_failed", analysisId: null });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send({ status: "analysis_failed", analysisId: null });
  }
});

app.listen(PORT, () => {
  console.log(`Listening to Port: ${PORT}`);
});

// app.post("/testupload", upload.single("file"), (req, res) => {
//   try {
//     console.log(req.file);
//     res.status(200);
//     res.send("Done");
//   } catch (error) {
//     console.log(error);
//     res.status(400);
//     res.send(error);
//   }
// });
