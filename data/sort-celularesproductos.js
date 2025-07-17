// sort-celularesproductos.js
const fs = require('fs');
const path = require('path');

// 1. Lee el JSON original
const inputPath = path.resolve(__dirname, 'celularesproductos.json');
const raw = fs.readFileSync(inputPath, 'utf-8');
const data = JSON.parse(raw);

// 2. Función para parsear el precio correctamente
function parsePrice(str) {
  return parseFloat(
    str
      .replace(/[^\d,\.]/g, '') // conservar dígitos, coma y punto
      .replace(/\./g, '')       // eliminar separadores de miles
      .replace(/,/g, '.')       // coma → punto decimal
  ) || 0;
}

// 3. Ordena el array: primero por marca, luego por precio
const sorted = data.sort((a, b) => {
  const brandA = a.name.split(' ')[0].toLowerCase();
  const brandB = b.name.split(' ')[0].toLowerCase();
  if (brandA !== brandB) {
    return brandA.localeCompare(brandB);
  }
  return parsePrice(a.price) - parsePrice(b.price);
});

// 4. Vuelca el resultado a un nuevo JSON
const outputPath = path.resolve(__dirname, 'celularesproductos.sorted.json');
fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 2), 'utf-8');

console.log('¡Listo! Creamos celularesproductos.sorted.json con marcas agrupadas y precios ordenados.');
