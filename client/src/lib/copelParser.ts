/**
 * Parser for Copel energy bills.
 * Optimized for text extracted via pdfjs-dist with space-joining.
 */

export interface ParsedInvoice {
  clientName: string;
  consumptionUnit: string;
  referenceMonth: string;
  dueDate: string;
  totalValue: number;
  activeConsumptionKwh: number;
  injectedEnergyKwh: number;
  creditBalanceKwh: number;
  creditMonthKwh: number;
  peakKwh: number;
  reservedKwh: number;
  teValue: number;
  tusdValue: number;
  cofinsBase: number;
  cofinsValue: number;
  pisValue: number;
  tariffFlag: string;
  irrigatorSubsidyCanceled: boolean;
  rawText?: string;
}

/**
 * Parses numbers in Brazilian format (e.g., "1.234,56" -> 1234.56).
 */
export function brNum(val: string | undefined): number {
  if (!val) return 0;
  return parseFloat(val.replace(/\./g, "").replace(",", "."));
}

/**
 * Utility to pick first match from regex.
 */
function pick(text: string, regex: RegExp): string | undefined {
  const match = text.match(regex);
  return match ? match[1] : undefined;
}

export function parseCopelPdf(t: string): ParsedInvoice {
  // 1. Unidade Consumidora (UC) - Exact 9 digits
  const consumptionUnit = pick(t, /\b(\d{9})\b/) || "0";

  // 2. Due Date (Keyword anchored or first DD/MM/YYYY)
  const dueDate =
    pick(t, /Vencimento:?\s*(\d{2}\/\d{2}\/20\d{2})/) ||
    pick(t, /\b(\d{2}\/\d{2}\/20\d{2})\b/) ||
    "01/01/2026";

  // 3. Client Name
  const clientName =
    pick(t, /Nome:\s*([^\n\r]+?)(?:\s{2,}|Endereço|CPF|$)/m) ||
    pick(t, /Nome:\s*(\S+(?:\s+\S+){0,4})/) ||
    "Desconhecido";

  // 4. Reference Month (Anchored to keyword or near due date)
  const referenceMonth =
    pick(t, /M[eê]s\s+de\s+Refer[eê]ncia:?\s*((?:0[1-9]|1[0-2])\/20\d{2})/) ||
    pick(t, /((?:0[1-9]|1[0-2])\/20\d{2})\s+Vencimento/) ||
    pick(t, new RegExp(`((?:0[1-9]|1[0-2])\\/20\\d{2})\\s+${dueDate.replace(/\//g, "\\/")}`)) ||
    "01/2026";

  // 5. Meter Readings (Complex line: TP RS TP ... deltas) - Handle Brazilian numeric format with commas
  const leit = t.match(
    /CONSUMO kWh\s+CONSUMO kWh\s+GERAC kWh\s+TP\s+RS\s+TP\s+[\d.]+\s+[\d.]+\s+[\d.]+\s+[\d.]+\s+[\d.]+\s+[\d.]+\s+\d+\s+\d+\s+\d+\s+([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)/
  );
  const activeConsumptionKwh = leit ? brNum(leit[1]) : 0;
  const peakKwh = leit ? brNum(leit[2]) : 0;
  const injectedEnergyKwh = leit ? brNum(leit[3]) : 0;

  // 6. SCEE Balances (Handling optional accents)
  const creditMonthKwh = brNum(
    pick(t, /Saldo\s+M[eê]s\s+no\s+\(TP\)\s+Todos\s+os\s+Per[ií]odos\s+([\d.,]+)/) || ""
  );
  const creditBalanceKwh = brNum(
    pick(t, /Saldo\s+Acumulado\s+no\s+\(TP\)\s+Todos\s+os\s+Per[ií]odos\s+([\d.,]+)/) || ""
  );

  // 7. Real Economic Value (COFINS/PIS Base)
  let cofinsBase = 0;
  let cofinsValue = 0;
  let pisValue = 0;
  const cofinsMatch = t.match(
    /COFINS\s+PIS\s+([\d.]+,\d+)\s+[\d.]+,\d+\s+[\d.,]+%\s+[\d.,]+%\s+([\d.,]+)\s+([\d.,]+)/
  );
  if (cofinsMatch) {
    cofinsBase = brNum(cofinsMatch[1]);
    cofinsValue = brNum(cofinsMatch[2]);
    pisValue = brNum(cofinsMatch[3]);
  }
  const totalValue = cofinsBase + cofinsValue + pisValue;

  // 8. TE and TUSD Values
  const teMatchA = t.match(
    /ENERGIA\s+ELET\s+CONSUMO\s+kWh\s+[\d.,]+\s+[\d.,]+\s+[\d.,]+\s+([\d.,]+)\s+([\d.,]+)/
  );
  const teMatchB = t.match(
    /ENERGIA\s+ELET\b[^\n]*?\s+kWh\s+[\d.,]+\s+[\d.,]+\s+[\d.,]+\s+([\d.,]+)\s+([\d.,]+)/
  );
  const teValue = brNum(teMatchA ? teMatchA[1] : (teMatchB ? teMatchB[1] : "0"));
  const tusdValue = brNum(teMatchA ? teMatchA[2] : (teMatchB ? teMatchB[2] : "0"));

  // 9. Tariff Flag
  const allFlagsMatches = t.matchAll(/Vermelha P[12]|Amarela|Verde/gi);
  const allFlags = Array.from(allFlagsMatches);
  let tariffFlag = "Verde";
  if (allFlags.length > 0) {
    tariffFlag = allFlags[allFlags.length - 1][0];
  }

  // 10. Compliance (Irrigator Subsidy)
  const irrigatorSubsidyCanceled = /Desconto\s+ao\s+(?:Irrigante|Aquicultor)\s+cancelado/i.test(t);

  return {
    clientName,
    consumptionUnit,
    referenceMonth,
    dueDate,
    totalValue,
    activeConsumptionKwh,
    injectedEnergyKwh,
    creditBalanceKwh,
    creditMonthKwh,
    peakKwh,
    reservedKwh: 0, // Placeholder
    teValue,
    tusdValue,
    cofinsBase,
    cofinsValue,
    pisValue,
    tariffFlag,
    irrigatorSubsidyCanceled,
    rawText: t,
  };
}
