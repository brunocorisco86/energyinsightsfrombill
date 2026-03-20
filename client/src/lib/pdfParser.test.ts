import { describe, it, expect } from 'vitest';
import { extractValues } from './pdfParser';

describe('extractValues', () => {
  it('should extract multiple values from text based on patterns', () => {
    const text = 'Consumo: 150.50 Geração: 200,75';
    const patterns = {
      consumo: /Consumo:\s*([\d.]+)/,
      geracao: /Geração:\s*([\d,]+)/
    };

    const result = extractValues(text, patterns);

    expect(result).toEqual({
      consumo: 150.50,
      geracao: 200.75
    });
  });

  it('should handle Brazilian number formats (comma to dot)', () => {
    const text = 'Valor: 1234,56';
    const patterns = {
      valor: /Valor:\s*([\d,]+)/
    };

    const result = extractValues(text, patterns);

    expect(result.valor).toBe(1234.56);
  });

  it('should return empty object if no matches are found', () => {
    const text = 'Nothing here';
    const patterns = {
      value: /Value:\s*(\d+)/
    };

    const result = extractValues(text, patterns);

    expect(result).toEqual({});
  });

  it('should skip patterns that do not match or lack capture group', () => {
    const text = 'Match: 100 NoMatch: ABC';
    const patterns = {
      match: /Match:\s*(\d+)/,
      noMatch: /NoMatch:\s*(\d+)/,
      noGroup: /Match:\s*\d+/
    };

    const result = extractValues(text, patterns);

    expect(result).toEqual({
      match: 100
    });
  });

  it('should use the first capture group if multiple are present', () => {
    const text = 'Values: 10 20';
    const patterns = {
      val: /Values:\s*(\d+)\s*(\d+)/
    };

    const result = extractValues(text, patterns);

    // According to the implementation: if (match && match[1])
    expect(result.val).toBe(10);
  });
});
