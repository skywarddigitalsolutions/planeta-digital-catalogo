// sync-sheets-to-json.js
import { readFile, writeFile } from "fs/promises";
import * as path from "path";
import { google } from "googleapis";
import { fileURLToPath } from "url";

// --- Configuración ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPREADSHEET_ID = "1S0OczgfzfS-OCVfXYJwYwej_Lp6FEbfnUzw8kxfFaNg";
const SHEET_NAME = "Productos";
const CRED_PATH = path.resolve(__dirname, "../auth/planeta-digital-460621-6ff0f49282c6.json");
const JSON_PATH = path.resolve(__dirname, "../data/productos.json");

// Ajusta esto según el verde de tu hoja (RGB en rango 0–1)
// Por defecto consideramos "white" = {1,1,1}; cualquier otro fondo lo ignoramos (ya cargado).
function isWhite(bg) {
  // Si no viene formato, asumimos blanco
  if (!bg) return true;

  // valores de #d9ead3 convertidos a 0–1:
  const greenHex = { red: 217 / 255, green: 234 / 255, blue: 211 / 255 };
  const eps = 0.01;  // tolerancia

  // Si es prácticamente ese verde, NO es blanco
  const isThatGreen =
    Math.abs(bg.red - greenHex.red) < eps &&
    Math.abs(bg.green - greenHex.green) < eps &&
    Math.abs(bg.blue - greenHex.blue) < eps;

  if (isThatGreen) return false;

  // finalmente, chequeamos blanco puro
  return bg.red === 1 && bg.green === 1 && bg.blue === 1;
}

async function main() {
  // 1. Autenticación
  const auth = new google.auth.GoogleAuth({
    keyFile: CRED_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheetsAPI = google.sheets({ version: "v4", auth });

  // 2. Leer hoja con formato
  const sheet = await sheetsAPI.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    includeGridData: true,
    ranges: [`${SHEET_NAME}`],
  });

  const gridData = sheet.data.sheets?.[0].data?.[0].rowData;
  if (!gridData || gridData.length < 2) {
    console.error("No se encontraron filas en la sheet.");
    process.exit(1);
  }

  // 3. Cargar JSON existente
  const raw = await readFile(JSON_PATH, "utf-8");
  const json = JSON.parse(raw);
  const existingNames = new Set(json.products.map(p => p.name));

  // 4. Iterar filas (saltamos fila de encabezados)
  const newProducts = [];
  // … dentro de main(), en el for:
  for (let i = 1; i < gridData.length; i++) {
    const row = gridData[i];
    const cells = row.values || [];

    // Solo celdas blancas
    const bg = cells[0]?.effectiveFormat?.backgroundColor;
    if (!isWhite(bg)) continue;

    // Extraer campos
    const name = cells[5]?.formattedValue?.trim() || "";
    const category = cells[6]?.formattedValue?.trim() || "";
    const price = cells[7]?.formattedValue?.replace(/^\s*\$\s*/, "").trim() || "";
    const description = cells[8]?.formattedValue?.trim() || "";

    if (!name.trim()) continue;           // sin título → saltar
    if (existingNames.has(name)) continue;  // duplicate guard

    // Slug y rutas de imagen
    function slugify(str) {
      return str
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");
    }
    const slug = slugify(name);
    const mainImage = `/images/${slug}.webp`;
    const detailImages = [
      mainImage,
      `/images/${slug}_1.webp`,
      `/images/${slug}_2.webp`
    ];

    newProducts.push({
      name,
      category,
      price,
      description: description.replace(/\\n/g, "\n"),
      image: mainImage,
      images: detailImages
    });
  }


  if (newProducts.length === 0) {
    console.log("✅ No hay productos nuevos por cargar.");
    return;
  }

  // 5. Agregar al JSON y escribir
  json.total = (json.total || 0) + newProducts.length;
  json.products = [...json.products, ...newProducts];

  await writeFile(JSON_PATH, JSON.stringify(json, null, 2), "utf-8");
  console.log(`✅ Agregados ${newProducts.length} productos nuevos al JSON.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
