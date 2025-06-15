export const slugify = (text: string) => 
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export const limpiarCentavos = (precio: string): string => {
  const numero = parseFloat(precio.replace(/\./g, '').replace(',', '.'));
  return Math.floor(numero).toLocaleString('es-AR');
}
