import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface BillData {
  fileName: string;
  month: string;
  year: string;
  consumoMedido: number; // kWh
  consumoFaturado: number; // kWh
  geracaoSolar: number; // kWh
  creditosSolares: number; // kWh
  energiaInjetada: number; // kWh
  autoconsumo: number; // percentage
  tarifa: number; // R$/kWh
  desconto: number; // R$
  totalFatura: number; // R$
  rawText: string;
}

export async function parsePDF(file: File): Promise<BillData> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  // Extract text from all pages
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  // Parse the extracted text
  const billData = parseTextContent(fullText, file.name);
  
  return billData;
}

function parseTextContent(text: string, fileName: string): BillData {
  // Initialize with default values
  const data: BillData = {
    fileName,
    month: '',
    year: '',
    consumoMedido: 0,
    consumoFaturado: 0,
    geracaoSolar: 0,
    creditosSolares: 0,
    energiaInjetada: 0,
    autoconsumo: 0,
    tarifa: 0,
    desconto: 0,
    totalFatura: 0,
    rawText: text,
  };

  // Helper to parse numbers in Brazilian format (1.234,56 -> 1234.56)
  const parseNum = (val: string) => {
    if (!val) return 0;
    return parseFloat(val.replace(/\./g, '').replace(',', '.'));
  };

  // Extract month and year from text (format MM/YYYY)
  const dateMatch = text.match(/(\d{2})\/(\d{4})/);
  if (dateMatch) {
    data.month = dateMatch[1];
    data.year = dateMatch[2];
  } else {
    // Fallback to file name
    const monthYearMatch = fileName.match(/(\d{2})(\d{2})/);
    if (monthYearMatch) {
      data.month = monthYearMatch[1];
      data.year = `20${monthYearMatch[2]}`;
    }
  }

  // Extract consumption values - Look for CONSUMO FATURADO in history or billing
  const consumoFaturadoMatch = text.match(/CONSUMO\s+FATURADO\s+(\d+(?:\.\d+)?(?:,\d+)?)/i);
  if (consumoFaturadoMatch) {
    data.consumoFaturado = parseNum(consumoFaturadoMatch[1]);
  } else {
    // Try another pattern
    const consumoMatch = text.match(/ENERGIA\s+ELET\s+CONSUMO[^\d]*(\d+(?:\.\d+)?(?:,\d+)?)/i);
    if (consumoMatch) {
      data.consumoFaturado = parseNum(consumoMatch[1]);
    }
  }

  // Extract solar generation - Look for GERAC kWh
  const geracaoMatch = text.match(/GERAC\s+kWh\s+(\d+(?:\.\d+)?(?:,\d+)?)/i);
  if (geracaoMatch) {
    data.geracaoSolar = parseNum(geracaoMatch[1]);
  }

  // Extract solar credits - Look for Saldo Acumulado
  const creditosMatch = text.match(/Saldo\s+Acumulado[^\d]*(\d+(?:\.\d+)?(?:,\d+)?)/i);
  if (creditosMatch) {
    data.creditosSolares = parseNum(creditosMatch[1]);
  }

  // Extract energy injected - Look for ENERGIA INJETADA
  const injetadaMatch = text.match(/ENERGIA\s+INJETADA[^\d]*-\s*(\d+(?:\.\d+)?(?:,\d+)?)/i);
  if (injetadaMatch) {
    data.energiaInjetada = parseNum(injetadaMatch[1]);
  }

  // Calculate autoconsumo
  if (data.geracaoSolar > 0) {
    const consumidoLocalmente = data.geracaoSolar - data.energiaInjetada;
    data.autoconsumo = Math.max(0, Math.min(100, (consumidoLocalmente / data.geracaoSolar) * 100));
  }

  // Extract total bill - Look for R$ followed by value
  const totalMatch = text.match(/R\$\s*(\d+(?:\.\d+)?(?:,\d+)?)/i);
  if (totalMatch) {
    data.totalFatura = parseNum(totalMatch[1]);
  }

  // Extract tariff - Look for price per kWh
  const tarifaMatch = text.match(/(\d,\d{6})/);
  if (tarifaMatch) {
    data.tarifa = parseNum(tarifaMatch[1]);
  }

  return data;
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
