# Guia de Desenvolvimento e Depuração — AgroEnergy Insight Builder

Este guia é destinado a desenvolvedores e agentes (IA) que trabalham na evolução do sistema.

## 🛠️ Ambiente de Desenvolvimento

Para testar as funcionalidades principais, especialmente a importação de documentos:

1.  **Inicialização:**
    -   Certifique-se de que o **Backend** e o **Frontend** estejam rodando.
    -   O backend é responsável pelo processamento pesado e o frontend pela visualização dos insights.

2.  **Importação de Dados de Teste:**
    -   Utilize os PDFs de amostra localizados em `/data/raw`.
    -   Estes arquivos cobrem diferentes cenários (Primeira e Segunda via, diferentes meses de 2025/2026).

3.  **Depuração do Parser (PDF Import):**
    -   **Verbosidade:** Ao implementar ou testar mudanças no parser de PDF, inicie a execução com o **nível máximo de log (Debug/Verbose)**.
    -   **Alinhamento:** Use os logs para verificar se os campos extraídos (Consumo, Créditos Gerados, Tarifas, Subsídios) batem exatamente com o conteúdo visual do PDF.
    -   **Eventuais Erros:** Problemas comuns de importação geralmente estão ligados a mudanças no layout da fatura ou fontes não detectadas pelo `pdf.js`.

## 🧪 Verificação de Funcionamento

Após a importação, verifique se os dashboards refletem:
- O autoconsumo calculado.
- O histórico de créditos solares.
- Os alertas de subsídios de energia.

---
*Atualizado em: 19 de março de 2026*
