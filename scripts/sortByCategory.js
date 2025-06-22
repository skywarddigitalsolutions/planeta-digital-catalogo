// scripts/sortByCategory.js
const fs   = require("fs");
const path = require("path");

// 1️⃣ Ruta al JSON original, ubicado en ../data/productos.json
const inputFile = path.resolve(__dirname, "..", "data", "productos.json");

// 2️⃣ Leer y parsear
const raw  = fs.readFileSync(inputFile, "utf8");
const data = JSON.parse(raw);

// 3️⃣ Ordenar el array de productos por categoría (alfabético, sin importar mayúsculas)
data.products.sort((a, b) =>
  a.category.localeCompare(b.category, "es", { sensitivity: "base" })
);

// 4️⃣ Escribir un nuevo JSON formateado
const outputFile = path.resolve(__dirname, "..", "data", "productos-ordenados.json");
fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), "utf8");

console.log(`🏷  ${data.products.length} productos ordenados por categoría.`);
console.log(`🔍  Archivo generado: ${outputFile}`);
