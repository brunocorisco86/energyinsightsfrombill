# AgroEnergy Insight Builder — Copel

Dashboard para análise de faturas de energia Copel com geração solar distribuída. Uma ferramenta voltada para o setor agroindustrial para monitoramento de autoconsumo, burn rate de créditos e alertas de subsídio.

## 🚀 Funcionalidades

- **Análise de Autoconsumo:** Visualização clara do quanto da energia gerada está sendo consumida localmente.
- **Burn Rate de Créditos:** Monitoramento da taxa de consumo dos créditos de energia solar acumulados.
- **Alertas de Subsídio:** Identificação de oportunidades e alertas sobre subsídios de energia.
- **Processamento de Faturas:** Upload e leitura de faturas da Copel para extração automática de dados.

## 🛠️ Tecnologias

- **Frontend:** React com Vite
- **Estilização:** CSS (Cabinet Grotesk & Satoshi fonts)
- **Manipulação de PDF:** jspdf, pdf.js
- **Visualização:** html2canvas para capturas e dashboards

## 📁 Dados de Amostra

Para testes e demonstração, faturas de exemplo em formato PDF (Primeira e Segunda via) estão disponíveis no diretório:
`data/raw/`

## 🛠️ Workflow de Desenvolvimento e Testes

Para garantir o funcionamento correto e depurar o parser de PDFs:

1.  **Rodar o Projeto:** Inicie o Backend e o Frontend (certifique-se de que os serviços estão devidamente configurados).
2.  **Importação de Documentos:** Carregue as faturas localizadas em `/data/raw` para verificar a precisão do processamento.
3.  **Verbocidade (Debug):** Recomenda-se iniciar o processo com **alta verbosidade nos logs** para alinhar e identificar eventuais problemas na implementação da extração de dados dos PDFs (Parser).

## 📂 Estrutura de Conhecimento

Para mais detalhes sobre o futuro e desenvolvimento do projeto, consulte a pasta `docs/`:

- [Roadmap](docs/Roadmap.md): Visão de longo prazo e marcos do projeto.
- [Next Steps](docs/NextSteps.md): Próximas tarefas imediatas e melhorias técnicas.
- [Development & Debugging](docs/Development.md): Instruções para desenvolvedores e agentes sobre como rodar e testar o sistema.

---
*Created with Perplexity Computer*
