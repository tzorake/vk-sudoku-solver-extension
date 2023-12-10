import https from "https";
import fs from "fs";
import path from "path";

import { Buffer } from "buffer";
import express from "express";
import * as cheerio from "cheerio";

const app = express();
app.use(express.static(path.resolve()));

let urlSet = false;

app.get("/sudoku", (req, res) => {
  const htmlContent = fs.readFileSync("index.html", "utf8");
  console.info(htmlContent.length);
  const $ = cheerio.load(htmlContent);
  $("body").append(`<script type="module" src="./inject.js"></script>`);
  const updatedHtmlContent = $.html();

  res.send(updatedHtmlContent);
});

app.post("/set-url", (req, res) => {
  if (!urlSet) {
    const fileUrl = Buffer.from(req.query.encodedUrl, "base64").toString("utf-8");
    const url = new URL(fileUrl);
    const storage = path.resolve().replace(/\\/g, "/");
    const downloadPath = storage + url.pathname;
  
    download(fileUrl, downloadPath);
  
    https.get(fileUrl, (response) => {
      let content = "";
    
      response.on("data", (chunk) => {
        content += chunk;
      });
    
      response.on("end", () => {
        const $ = cheerio.load(content);
    
        $("script").each((index, element) => {
          const scriptSrc = $(element).attr("src");
          if (scriptSrc) {
            const relativePath = scriptSrc.substring(1);
            download(new URL(relativePath, url.protocol + url.host).toString(), `${storage}${relativePath}`);
          }
        });
    
        $(`link[rel="stylesheet"]`).each((index, element) => {
          const cssHref = $(element).attr("href");
          if (cssHref) {
            const relativePath = cssHref.substring(1);
            download(new URL(relativePath, url.protocol + url.host).toString(), `${storage}${relativePath}`);
          }
        });
      });
    }).on("error", (err) => {
      console.error(`Error downloading file: ${err.message}`);
    });
  
    urlSet = true;
  }
  res.json({ ok: 200 });
});

// https://stackoverflow.com/questions/13542667/create-directory-when-writing-to-file-in-node-js
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function download(fileUrl, localPath) {
  ensureDirectoryExistence(localPath);

  const file = fs.createWriteStream(localPath);

  https.get(fileUrl, (response) => {
    response.pipe(file);
    file.on("finish", () => {
      file.close(() => {
        console.log(`File downloaded successfully: ${localPath}`);
      });
    });
  }).on("error", (err) => {
    fs.unlink(localPath, () => {
      console.error(`Error downloading file ${fileUrl}: ${err.message}`);
    });
  });
}

app.listen(6969);