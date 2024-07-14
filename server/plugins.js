const { exec } = require("child_process");
const sql = require("./db");

async function executePluginV1(plugin, filenameLoc, anaId, userid) {
  if (plugin === "imageinfo") {
    filenameLoc = filenameLoc.slice(1);
    exec(
      `docker run --rm --user=$(id -u):$(id -g) -v ./uploads_dumps:/uploads_dumps phocean/volatility -f '${filenameLoc}' imageinfo`,
      async (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          await sql`UPDATE analysis SET analysis_status = 'failed' WHERE id = ${anaId}`;
          return;
        }
        function parseTextToJson(text) {
          const lines = text.trim().split("\n");
          const json = {};

          lines.forEach((line) => {
            const [key, value] = line.split(" : ").map((str) => str.trim());
            json[key] = value;
          });

          return json;
        }
        await sql`UPDATE analysis SET analysis_status = 'completed' WHERE id = ${anaId}`;
        const outText = JSON.stringify(parseTextToJson(stdout));
        await sql`INSERT INTO analysis_data (user_id, analysis_id, analysis_data) VALUES (${userid}, ${anaId}, ${outText})`;
        console.log(outText);
        // console.error(`stderr: ${stderr}`);
      }
    );
  }
}

async function executePluginV2(
  plugin,
  filenameLoc,
  profileName,
  anaId,
  userid
) {
  if (plugin === "pslist") {
    filenameLoc = filenameLoc.slice(1);
    exec(
      `docker run --rm --user=$(id -u):$(id -g) -v ./uploads_dumps:/uploads_dumps -ti phocean/volatility -f '${filenameLoc}' --profile ${profileName} pslist`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      }
    );
  } else if (plugin === "hivelist") {
    filenameLoc = filenameLoc.slice(1);
    exec(
      `docker run --rm --user=$(id -u):$(id -g) -v ./uploads_dumps:/uploads_dumps -ti phocean/volatility -f '${filenameLoc}' --profile ${profileName} hivelist`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      }
    );
  }
}

module.exports = { executePluginV1, executePluginV2 };
