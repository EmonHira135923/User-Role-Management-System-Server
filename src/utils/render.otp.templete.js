import fs from "fs";
import path from "path";

export const renderTemplate = (fileName, data) => {
  const filePath = path.join(process.cwd(), "src", "templates", fileName);
  let html = fs.readFileSync(filePath, "utf-8");

  Object.keys(data).forEach((key) => {
    html = html.replaceAll(`{{${key}}}`, data[key]);
  });

  return html;
};