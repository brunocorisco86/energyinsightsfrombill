import { extractTextFromPdf } from "./pdfExtract";
import { parseCopelPdf, ParsedInvoice } from "./copelParser";

// Export the interface for compatibility with components
export interface BillData extends ParsedInvoice {
  // Legacy compatibility fields if needed, but ParsedInvoice is more complete
  fileName: string;
  month: string;
  year: string;
  consumoMedido: number;
  consumoFaturado: number;
  geracaoSolar: number;
  creditosSolares: number;
  energiaInjetada: number;
  autoconsumo: number;
  tarifa: number;
  desconto: number;
  totalFatura: number;
}

/**
 * Main entry point for PDF parsing.
 * Utilizes the layered architecture: pdfExtract -> copelParser.
 */
export async function parsePDF(file: File): Promise<BillData> {
  const rawText = await extractTextFromPdf(file);
  const parsed = parseCopelPdf(rawText);
  
  // Extract month/year for legacy compatibility
  const [m, y] = parsed.referenceMonth.split("/");
  
  // Calculate autoconsumo (legacy compatibility)
  let autoconsumo = 0;
  if (parsed.activeConsumptionKwh > 0) {
    // Percentage of injected energy relative to consumption
    autoconsumo = Math.min((parsed.injectedEnergyKwh / parsed.activeConsumptionKwh) * 100, 999);
  }

  return {
    ...parsed,
    fileName: file.name,
    month: m || "01",
    year: y || "2026",
    consumoMedido: parsed.activeConsumptionKwh,
    consumoFaturado: parsed.activeConsumptionKwh,
    geracaoSolar: parsed.injectedEnergyKwh, // Injetada maps to generation in dashboard terminology
    creditosSolares: parsed.creditBalanceKwh,
    energiaInjetada: parsed.injectedEnergyKwh,
    autoconsumo: autoconsumo,
    tarifa: 0, // Calculated separately if needed
    desconto: 0,
    totalFatura: parsed.totalValue,
  };
}

// Helper function to extract multiple values from text
export function extractValues(text: string, patterns: Record<string, RegExp>): Record<string, number> {
  const result: Record<string, number> = {};

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result[key] = parseFloat(match[1].replace(',', '.'));
    }
  }

  return result;
}
