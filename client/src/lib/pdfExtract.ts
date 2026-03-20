import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

// Set up the worker source locally to avoid version mismatch issues
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Extracts all text from a PDF file using pdfjs-dist.
 * Joins items with spaces to maintain a flat string structure for easier parsing with regex.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" "); // Maintain single space joining as per documentation

    fullText += pageText + "\n";
  }

  return fullText;
}
