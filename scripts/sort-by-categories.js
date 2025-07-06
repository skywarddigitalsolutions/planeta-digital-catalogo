#!/usr/bin/env node
// sort-by-categories.js

import { readFileSync, writeFileSync } from 'fs';           // síncrono
// o, si prefieres promesas, haz:
// import { readFile, writeFile } from 'fs/promises';

import path from 'path';
import { fileURLToPath } from 'url';

// 1️⃣ Reconstruir __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// 2️⃣ Permitir ruta por parámetro o fallback a ../data/productos.json
const [, , inputArg] = process.argv;
const inputFile = inputArg
  ? path.resolve(process.cwd(), inputArg)
  : path.resolve(__dirname, '..', 'data', 'productos.json');

// 3️⃣ Leer y parsear (síncrono)
const raw  = readFileSync(inputFile, 'utf8');
const data = JSON.parse(raw);

// 4️⃣ Ordenar el array de productos por categoría
data.products.sort((a, b) =>
  a.category.localeCompare(b.category, 'es', { sensitivity: 'base' })
);

// 5️⃣ Escribir JSON formateado
const outputFile = path.resolve(__dirname, '..', 'data', 'productos-ordenados.json');
writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf8');

console.log(`🏷  ${data.products.length} productos ordenados por categoría.`);
console.log(`🔍  Archivo generado: ${outputFile}`);
