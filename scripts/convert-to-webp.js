import fs from "fs-extra";
import path from "path";
import sharp from "sharp";

const allowedExtensions = [".jpg", ".jpeg", ".png"];
const errores = [];

async function convertToWebp(inputDir, outputDir) {
  const entries = await fs.readdir(inputDir, { withFileTypes: true });

  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name);

    if (entry.isDirectory()) {
      await convertToWebp(inputPath, outputDir);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      const baseName = path.basename(entry.name, ext);

      // Aseguramos que exista la carpeta de salida
      await fs.ensureDir(outputDir);

      if (allowedExtensions.includes(ext)) {
        // Convertir imágenes JPG/PNG a WEBP
        const webpOutputPath = path.join(outputDir, `${baseName}.webp`);
        try {
          await sharp(inputPath).toFormat("webp").toFile(webpOutputPath);
          console.log(`✔ Convertido: ${inputPath} → ${webpOutputPath}`);
        } catch (error) {
          console.error(`✖ Error al convertir ${inputPath}:`, error);
          errores.push(inputPath);
        }
      } else {
        // Ignorar archivos webp y otras extensiones
        console.log(`➤ Ignorado: ${inputPath}`);
      }
    }
  }
}

// Entrada de argumentos por línea de comandos
const inputFolder = process.argv[2];
const outputFolder = process.argv[3];

if (!inputFolder || !outputFolder) {
  console.error("⚠️  Uso: node convert-to-webp.js <carpeta_entrada> <carpeta_salida>");
  process.exit(1);
}

convertToWebp(path.resolve(inputFolder), path.resolve(outputFolder))
  .then(async () => {
    if (errores.length > 0) {
      const erroresPath = path.resolve("errores-conversion.json");
      await fs.writeJson(erroresPath, { errores }, { spaces: 2 });
      console.warn(`⚠️  Algunas imágenes no se pudieron procesar. Ver: ${erroresPath}`);
    } else {
      console.log("✅ Proceso completado correctamente.");
    }
  })
  .catch((error) => {
    console.error("✖ Error en el proceso:", error);
    process.exit(1);
  });
