# Agro-Energy Analyst Skill

Este skill é focado na interpretação de dados de energia para gerar insights agroindustriais.

## 🛠️ Procedimento de Análise

1.  **Cálculo de Autoconsumo:** Determinar a porcentagem da energia solar gerada que é consumida instantaneamente na propriedade.
2.  **Monitoramento de Burn Rate (Créditos):**
    - Projetar a duração do saldo de créditos atual com base no consumo médio dos últimos 3 meses.
    - Emitir alertas proativos se o burn rate sugerir esgotamento de créditos antes de períodos de alta geração (verão).
3.  **Análise de Subsídios:** Identificar se a unidade consumidora está aproveitando corretamente os subsídios rurais (IRR, Rural, Cooperativas).

## 🧪 Critérios de Sucesso

- Gerar um gráfico de burn rate que preveja a validade dos créditos com precisão de +/- 1 mês.
- Alertas de subsídio devem incluir a base legal (ex: Resolução ANEEL 1.000).

## 📂 Recursos Disponíveis

- Dashboard de insights em `src/components/Dashboard.tsx` (ou equivalente).
- Modelo de cálculo em `src/utils/energyMath.ts`.

---
*Created for Gemini CLI*
