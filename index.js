const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const http = require("http");
const https = require("https");
const fs = require("fs");
const timeout = require("connect-timeout");
const path = require("path");
const jsonParser = bodyParser.json();
const ftpClient = require("ftp-client");
const ftp = require("basic-ftp");
const { resolve } = require("path");
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json("welcome coder!");
});

app.get("/ftp", async (req, res) => {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: envVar,
      user: envVar,
      password: envVar,
      secure: false,
    });
    console.log(await client.list());
    await client.downloadToDir(
      "download/",
      "/htdocs/barliliana/delivery/system/library/autoprint/html-to-pdf"
    );
  } catch (err) {
    console.log(err);
  }
  // qui dovremmo cancellare tutti i files
  client.close();
  const filesList = [];
  fs.readdir("download/", (err, files) => {
    files.forEach(file => {
      filesList.push(file);
    });
    res.json({ files: filesList });
  });
});

app.post("/download", jsonParser, (req, res) => {
  const fileName = req.body.fileName;
  const file = `./download/${fileName}`;
  res.download(file); // Set disposition and send it.
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
