import { promises, readFileSync } from "fs";
import { join } from "path";
import { Argv } from "../types";

const generateHtmlStr = ({
  cssInject,
  jsManifest,
}: {
  jsManifest: string;
  cssInject: string;
}) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    ${cssInject}
  </head>
  <body>
    <div id="app"></div>
    ${jsManifest}
  </body>
  </html>`;

export const generateHtml = async (_argv: Argv) => {
  if (process.env.SPA) {
    console.log(
      "当前构建开启 SPA 模式，将生成 html 文件用于独立部署，默认关闭 dynamic 选项"
    );
    // spa 模式下生成 html 文件直接部署
    const { loadConfig, getCwd } = await import("../utils");
    const { jsOrder, cssOrder } = loadConfig();
    const cwd = getCwd();
    const manifest = JSON.parse(     readFileSync(join(cwd, "./build/client/asset-manifest.json"), {        encoding: "utf-8",      })    );
    let jsManifest = "";
    jsOrder.forEach((item) => {
      jsManifest += `<script src=${manifest[item]}></script>`;
    });
    let cssInject = "";
    cssOrder.forEach((item) => {
      cssInject += `<link rel='stylesheet' href=${manifest[item]} />`;
    });
    await promises.writeFile(
      join(cwd, "./build/index.html"),
      generateHtmlStr({
        cssInject,
        jsManifest,
      })
    );
  }
};
