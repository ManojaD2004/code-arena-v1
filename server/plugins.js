const { exec } = require("child_process");
const sql = require("./db");

function parseTextToJsonV1(text) {
  const lines = text.trim().split("\n");
  const json = {};

  lines.forEach((line) => {
    const [key, value] = line.split(" : ").map((str) => str.trim());
    json[key] = value;
  });

  return json;
}

function parseTextToJsonV2(text) {
  const data = JSON.parse(text);
  const json = [];
  for (let i = 0; i < data.rows.length; i++) {
    const newJson = {};
    for (let j = 0; j < data.columns.length; j++) {
      if (j === 0) {
        newJson[data.columns[j]] = "0x" + data.rows[i][j].toString(16);
      } else {
        newJson[data.columns[j]] = data.rows[i][j];
      }
    }
    json.push(newJson);
  }
  return json;
}

async function executePluginV1(plugin, filenameLoc, anaId, userid) {
  filenameLoc = filenameLoc.slice(1);
  exec(
    `docker run --rm --user=$(id -u):$(id -g) -v ./uploads_dumps:/uploads_dumps phocean/volatility -f '${filenameLoc}' ${plugin}`,
    async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        await sql`UPDATE analysis SET analysis_status = 'failed' WHERE id = ${anaId}`;
        return;
      }
      await sql`UPDATE analysis SET analysis_status = 'completed' WHERE id = ${anaId}`;
      const outText = JSON.stringify(parseTextToJsonV1(stdout));
      await sql`INSERT INTO analysis_data (user_id, analysis_id, analysis_data) VALUES (${userid}, ${anaId}, ${outText})`;
      console.log(outText);
      // console.error(`stderr: ${stderr}`);
    }
  );
}

async function executePluginV2(
  plugin,
  filenameLoc,
  profileName,
  anaId,
  userid
) {
  filenameLoc = filenameLoc.slice(1);
  exec(
    `docker run --rm --user=$(id -u):$(id -g) -v ./uploads_dumps:/uploads_dumps phocean/volatility -f '${filenameLoc}' --profile ${profileName} ${plugin} --output=json`,
    async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        await sql`UPDATE analysis SET analysis_status = 'failed' WHERE id = ${anaId}`;
        return;
      }
      await sql`UPDATE analysis SET analysis_status = 'completed' WHERE id = ${anaId}`;
      // console.log(stdout);
      // console.log(stderr);
      const outText = JSON.stringify(parseTextToJsonV2(stdout));
      await sql`INSERT INTO analysis_data (user_id, analysis_id, analysis_data) VALUES (${userid}, ${anaId}, ${outText})`;
      // console.log(outText);
    }
  );
}

async function executePluginV3(
  plugin,
  filenameLoc,
  profileName,
  pid,
  anaId,
  userid
) {
  filenameLoc = filenameLoc.slice(1);
  exec(
    `docker run --rm --user=$(id -u):$(id -g) -v ./uploads_dumps:/uploads_dumps phocean/volatility -f '${filenameLoc}' --profile ${profileName} ${plugin} -p ${pid} --output=json`,
    async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        await sql`UPDATE analysis SET analysis_status = 'failed' WHERE id = ${anaId}`;
        return;
      }
      await sql`UPDATE analysis SET analysis_status = 'completed' WHERE id = ${anaId}`;
      console.log(stdout);
      // console.log(stderr);
      const outText = JSON.stringify(parseTextToJsonV2(stdout));
      await sql`INSERT INTO analysis_data (user_id, analysis_id, analysis_data) VALUES (${userid}, ${anaId}, ${outText})`;
      // console.log(outText);
    }
  );
}

module.exports = { executePluginV1, executePluginV2, executePluginV3 };
