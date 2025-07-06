# Comandos para ejecutar los scripts.
 
### Para subir los productos de la pagina al excel.
node scripts/sort-by-categories.js ./data/productos.json
node scripts/upload-to-sheets.js
node scripts/sync-sheets-to-json