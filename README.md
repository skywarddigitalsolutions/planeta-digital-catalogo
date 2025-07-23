# Comandos para ejecutar los scripts.
 
### Para subir los productos del excel a la pagina.
node scripts/sync-sheets-to-json
### Para ordenar por categoria los productos.
- node scripts/sort-by-categories.js ./data/productos.json

---
### Para subir los productos de la pagina al excel.
- node scripts/upload-to-sheets.js
