const fs = require("node:fs");
const path = require("node:path");
const xlsx = require("xlsx");

const inputPath = process.argv[2] || path.join(process.cwd(), "public", "data", "restaurants.xlsx");
const outputPath = process.argv[3] || path.join(process.cwd(), "src", "data", "restaurants.json");

if (!fs.existsSync(inputPath)) {
  console.error(`Missing file: ${inputPath}`);
  process.exit(1);
}

const workbook = xlsx.readFile(inputPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

fs.writeFileSync(outputPath, JSON.stringify(rows, null, 2));
console.log(`Wrote ${rows.length} rows to ${outputPath}`);
