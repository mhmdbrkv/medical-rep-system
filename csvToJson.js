import xlsx from "xlsx";
import fs from "fs";

// Load Excel file
const workbook = xlsx.readFile("Sales Analysis Report (sale.report) (1).xlsx");

// Get first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert to JSON
const rawData = xlsx.utils.sheet_to_json(sheet);

// Optional: normalize keys
const data = rawData.map((row) => ({
  customer: row["Customer"],
  order: row["Order"],
  orderDate: row["Order Date"],
  product: row["Product Variant"],
  qtyOrdered: row["Qty Ordered"],
  untaxedTotal: row["Untaxed Total"],
}));

// Save JSON file
fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

console.log("✅ Excel converted to JSON successfully");
