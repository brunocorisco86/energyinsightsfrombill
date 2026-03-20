# Copel PDF Specialist Skill

Este skill é focado na extração precisa e validação de dados de faturas de energia da Copel.

## 🛠️ Procedimento de Extração

1.  **Leitura do PDF:** Use as bibliotecas `pdf.js` e `jspdf` para ler o conteúdo das faturas.
2.  **Identificação de Campos Chave:**
    -   **Consumo (kWh):** Identificar o consumo medido vs faturado.
    -   **Geração Solar (Créditos):** Extrair a energia injetada e o saldo de créditos.
    -   **Tarifas e Subsídios:** Localizar os descontos de subsídios e as bandeiras tarifárias.
3.  **Depuração com Alta Verbosidade:** Sempre inicie o processo com logs de nível `DEBUG` para validar cada regex ou padrão de texto detectado.

## 🧪 Critérios de Sucesso

- O volume de energia injetada deve corresponder exatamente ao saldo de créditos gerados.
- O autoconsumo deve ser calculado como: `(Energia Gerada Total) - (Energia Injetada) + (Energia Consumida Localmente)`.

## 📂 Recursos Disponíveis

- Arquivos de amostra em `/data/raw`.
- Parser atualizado em `src/parser/copel.js` (ou local equivalente).

---
*Created for Gemini CLI*
