// Local stand-in for a CRM / webhook endpoint, used by scripts/e2e.mjs.
// Records every lead it receives to the file given as argv[2].
import http from "node:http";
import fs from "node:fs";
const out = process.argv[2];
const port = Number(process.argv[3] || 4010);
http
  .createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      fs.appendFileSync(out, JSON.stringify({ auth: req.headers.authorization || null, body: JSON.parse(body || "{}") }) + "\n");
      res.writeHead(200, { "content-type": "application/json" }).end('{"ok":true}');
    });
  })
  .listen(port, () => console.log("mock CRM on", port));
