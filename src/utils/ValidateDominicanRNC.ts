export function ValidateDominicanRNC(rnc: string): boolean {
  const value = rnc.replace(/-/g, "").trim();

  // Debe tener 9 o 11 dígitos
  if (!/^\d{9}$|^\d{11}$/.test(value)) return false;

  // No permitir todos ceros
  if (/^0+$/.test(value)) return false;

  // Si es de 11 dígitos, valida como cédula
  if (value.length === 11) {
    let sum = 0;

    for (let i = 0; i < 10; i++) {
      const num = parseInt(value[i], 10);
      const multiplier = i % 2 === 0 ? 1 : 2;
      let result = num * multiplier;

      if (result > 9) {
        result = Math.floor(result / 10) + (result % 10);
      }

      sum += result;
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(value[10], 10);
  }

  // Si es de 9 dígitos (empresa), solo validación estructural
  return true;
}
