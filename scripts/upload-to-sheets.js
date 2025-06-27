import { readFile } from "fs/promises";
import * as path from "path";
import { google } from "googleapis";
import { fileURLToPath } from "url";  
// --- Configuración ---
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const SPREADSHEET_ID = "1S0OczgfzfS-OCVfXYJwYwej_Lp6FEbfnUzw8kxfFaNg";
const SHEET_NAME = "Productos";
const CRED_PATH = path.resolve(
  __dirname,
  "../auth/planeta-digital-460621-6ff0f49282c6.json"
);
const GH_USER = "skywarddigitalsolutions";
const GH_REPO = "planeta-digital-catalogo";
const GH_BRANCH = "main";
const PUBLIC_IMG_BASE = `https://raw.githubusercontent.com/${GH_USER}/${GH_REPO}/${GH_BRANCH}/public/images/`;

async function main() {
    const auth = new google.auth.GoogleAuth({
        keyFile: CRED_PATH,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const raw = await readFile(
    path.resolve(__dirname, "../data/productos.json"),
    "utf-8"
    );
    const { products } = JSON.parse(raw);
       
    const MAX_IMG = 5;

    const headers = [
    ...Array.from({ length: MAX_IMG }, (_, i) => `Imagen ${i + 1}`),
    "Nombre",
    "Categoría",
    "Precio",
    "Descripción",
    ];

    const rows = [
    headers,
    ...products.map(p => {
        // Creamos hasta MAX_IMG fórmulas IMAGE
        const imgFormulas = (p.images || [])
        .slice(0, MAX_IMG)
        .map(url => {
            const fileName = url.split("/").pop();
            const publicUrl = `${PUBLIC_IMG_BASE}${fileName}`;
            return `=IMAGE("${publicUrl}";4;100;100)`;
        });

        // Si hay menos de 5, rellenamos con celdas vacías
        while (imgFormulas.length < MAX_IMG) {
        imgFormulas.push("");
        }

        return [
        ...imgFormulas,
        p.name,
        p.category,
        p.price,
        p.description.replace(/\n/g, " "),
        ];
    })
    ];

    await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: rows },
    });
    console.log(`✅ Volcados ${products.length} productos en ${SHEET_NAME}!`);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
