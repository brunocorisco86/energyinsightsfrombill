import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

  // Extract month and year from file name or text
  const monthYearMatch = fileName.match(/(\d{2})(\d{2})/);
  if (monthYearMatch) {
    const month = monthYearMatch[1];
    const year = monthYearMatch[2];
    data.month = month;
    data.year = `20${year}`;
  }

  // Extract consumption values
  const consumoMedidoMatch = text.match(/Consumo\s+Medido[^\d]*(\d+(?:[.,]\d+)?)/i);
  if (consumoMedidoMatch) {
    data.consumoMedido = parseFloat(consumoMedidoMatch[1].replace(',', '.'));
  }

  const consumoFaturadoMatch = text.match(/Consumo\s+Faturado[^\d]*(\d+(?:[.,]\d+)?)/i);
  if (consumoFaturadoMatch) {
    data.consumoFaturado = parseFloat(consumoFaturadoMatch[1].replace(',', '.'));
  }

  // Extract solar generation and credits
  const geracaoMatch = text.match(/Geração\s+(?:Solar|Distribuída)[^\d]*(\d+(?:[.,]\d+)?)/i);
  if (geracaoMatch) {
    data.geracaoSolar = parseFloat(geracaoMatch[1].replace(',', '.'));
  }

  const creditosMatch = text.match(/Crédito[^\d]*(\d+(?:[.,]\d+)?)/i);
  if (creditosMatch) {
    data.creditosSolares = parseFloat(creditosMatch[1].replace(',', '.'));
  }

  const injetadaMatch = text.match(/Injetada[^\d]*(\d+(?:[.,]\d+)?)/i);
  if (injetadaMatch) {
    data.energiaInjetada = parseFloat(injetadaMatch[1].replace(',', '.'));
  }

  // Calculate autoconsumo (percentage of generated energy consumed locally)
  if (data.geracaoSolar > 0) {
    const consumidoLocalmente = data.geracaoSolar - data.energiaInjetada;
    data.autoconsumo = (consumidoLocalmente / data.geracaoSolar) * 100;
  }

  // Extract tariff
  const tarifaMatch = text.match(/Tarifa[^\d]*R\$\s*(\d+(?:[.,]\d+)?)/i);
  if (tarifaMatch) {
    data.tarifa = parseFloat(tarifaMatch[1].replace(',', '.'));
  }

  // Extract discount/subsidy
  const descontoMatch = text.match(/Desconto[^\d]*R\$\s*(\d+(?:[.,]\d+)?)/i);
  if (descontoMatch) {
    data.desconto = parseFloat(descontoMatch[1].replace(',', '.'));
  }

  // Extract total bill
  const totalMatch = text.match(/Total\s+(?:a\s+Pagar|da\s+Fatura)[^\d]*R\$\s*(\d+(?:[.,]\d+)?)/i);
  if (totalMatch) {
    data.totalFatura = parseFloat(totalMatch[1].replace(',', '.'));
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
