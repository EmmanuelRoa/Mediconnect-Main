export interface ParsedDominicanAddress {
  direccion: string;
  municipio: string;
  provincia: string;
}

export function ParseDominicanAddress(address: string): ParsedDominicanAddress {
  // Remove "República Dominicana" from the end if present
  const cleanAddress = address.replace(/, República Dominicana$/i, "").trim();

  // Split by commas and clean each part
  const parts = cleanAddress
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (parts.length >= 3) {
    // Format: "Street, Municipality, Province"
    return {
      direccion: parts[0],
      municipio: parts[1],
      provincia: parts[2],
    };
  } else if (parts.length === 2) {
    // Format: "Street, Municipality/Province"
    return {
      direccion: parts[0],
      municipio: parts[1],
      provincia: parts[1], // Use same for both if only 2 parts
    };
  } else {
    // Fallback for single part
    return {
      direccion: parts[0] || address,
      municipio: "",
      provincia: "",
    };
  }
}
