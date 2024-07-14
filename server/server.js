const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const upload = require("./upload");
const { executePluginV1, executePluginV2, executePluginV3 } = require("./plugins");
const sql = require("./db");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 5 });

dotenv.config({ path: "./.env.local" });
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json({ limit: 1024 * 1024 * 1024 * 2 }));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: 1024 * 1024 * 1024 * 2 }));

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
  (req, res, next) => {
    try {
      upload.single("file")(req, res, next);
    } catch (error) {
      console.log(error);
      res.status(400);
      res.send({ status: "failure", fileId: null });
    }
  },
  async (req, res) => {
    try {
      console.log("Hi");
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

app.post("/api/analyze", async (req, res) => {
  try {
    const fileId = req.body.fileId;
    const plugin = req.body.plugin;
    const profileName = req.body.profileName;
    const userid = req.query.userid;
    const pid = req.body.pid;
    const fileNameLocRow =
      await sql`SELECT * FROM memory_dump WHERE id = ${fileId}`;
    if (fileNameLocRow.length === 0) {
      console.log("No Memory Dump!");
      res.status(400);
      return res.send({ status: "analysis_failed", analysisId: null });
    }
    const anaId = `${userid}_${plugin}_${uid.rnd()}`;
    await sql`INSERT INTO analysis (id, user_id, memory_dump_id, analysis_status) VALUES (${anaId}, ${fileNameLocRow[0].user_id}, ${fileNameLocRow[0].id}, 'in_progress')`;
    if (plugin === "imageinfo" || plugin === "kdbgscan") {
      executePluginV1(
        plugin,
        fileNameLocRow[0].memory_dump_loc,
        anaId,
        fileNameLocRow[0].user_id
      );
    } else if (
      plugin === "pslist" ||
      plugin === "psscan" ||
      plugin === "pstree" ||
      plugin === "psxview"
    ) {
      executePluginV2(
        plugin,
        fileNameLocRow[0].memory_dump_loc,
        profileName,
        anaId,
        fileNameLocRow[0].user_id
      );
    } else if (
      plugin === "handles" ||
      plugin === "dlllist" 
    ) {
       executePluginV3(
         plugin,
         fileNameLocRow[0].memory_dump_loc,
         profileName,
         pid,
         anaId,
         fileNameLocRow[0].user_id
       );
    }
      res.status(200);
    res.send({ status: "analysis_started", analysisId: anaId });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send({ status: "analysis_failed", analysisId: null });
  }
});

app.get("/api/analysis/:analysisId/status", async (req, res) => {
  try {
    const anaId = req.params.analysisId;
    const result = await sql`SELECT * FROM analysis WHERE id = ${anaId}`;
    res.status(200);
    res.send({ status: result[0].analysis_status });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send({ status: "error" });
  }
});

app.get("/api/analysis/:analysisId/results", async (req, res) => {
  try {
    const anaId = req.params.analysisId;
    console.log(anaId);
    const result2 = await sql`SELECT * FROM analysis WHERE id = ${anaId}`;
    // console.log(result2);
    if (result2[0].analysis_status !== "completed") {
      res.status(200);
      return res.send({ status: result2[0].analysis_status, results: null });
    }
    const result1 =
      await sql`SELECT * FROM analysis_data WHERE analysis_id = ${anaId}`;
    console.log(result1);
    res.status(200);
    res.send({ status: "success", results: result1[0].analysis_data });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send({ status: "error", results: null });
  }
});

app.get("/api/analyses", async (req, res) => {
  try {
    const userid = req.query.userid;
    const result1 =
      await sql`SELECT * FROM analysis WHERE user_id = (SELECT id FROM users WHERE username = ${userid});`;
    const utcDate = new Date(result1[0].date_time);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + istOffset);
    const istDateString = istDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    result1[0].date_time = istDateString;
    res.status(200);
    res.send({ analyses: result1 });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send({ analyses: null });
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
