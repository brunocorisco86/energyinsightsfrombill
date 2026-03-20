# AgroEnergy Insight Builder — Guia de Uso

## 🚀 Início Rápido

A aplicação está totalmente funcional e pronta para uso. Ela permite importar faturas de energia Copel em formato PDF e analisar dados de consumo, geração solar, créditos e autoconsumo.

### Acessar a Aplicação

A aplicação está rodando em **http://localhost:3000/**

```bash
# Se precisar reiniciar o servidor:
cd /home/ubuntu/agroenergy-insight-builder
pnpm run dev
```

## 📋 Funcionalidades Implementadas

### 1. **Upload de PDFs**
- Arraste e solte arquivos PDF ou clique para selecionar
- Suporta múltiplos arquivos simultaneamente
- Apenas arquivos PDF são aceitos
- Validação automática de tipo de arquivo

### 2. **Processamento de Faturas**
- Extração automática de dados das faturas Copel
- Campos extraídos:
  - **Consumo Medido**: Energia consumida (kWh)
  - **Consumo Faturado**: Energia faturada (kWh)
  - **Geração Solar**: Energia gerada pela usina solar (kWh)
  - **Créditos Solares**: Saldo de créditos disponíveis (kWh)
  - **Energia Injetada**: Energia enviada à rede (kWh)
  - **Autoconsumo**: Percentual de energia gerada consumida localmente
  - **Tarifa**: Valor unitário (R$/kWh)
  - **Desconto**: Subsídios aplicados (R$)
  - **Total da Fatura**: Valor total a pagar (R$)

### 3. **Dashboard de Análise**

#### KPIs (Indicadores-Chave)
- **Consumo Total**: Soma de toda energia consumida
- **Geração Solar**: Soma de toda energia gerada
- **Créditos Solares**: Saldo total de créditos
- **Gasto Total**: Soma de todas as faturas

#### Gráficos
- **Consumo vs Geração**: Comparação mensal entre consumo e geração
- **Autoconsumo Médio**: Distribuição em pizza do autoconsumo
- **Evolução de Créditos**: Linha temporal do saldo de créditos
- **Valor das Faturas**: Histórico de gastos mensais

#### Tabela Detalhada
- Visualização completa de todos os dados extraídos
- Ordenação por período (mês/ano)
- Fácil identificação de tendências

## 📊 Dados de Amostra

A aplicação inclui 15 faturas de amostra para testes:

```
client/public/sample-pdfs/
├── PrimeiraViaCopel0325.pdf (Março 2025)
├── PrimeiraViaCopel0525.pdf (Maio 2025)
├── PrimeiraViaCopel0625.pdf (Junho 2025)
├── PrimeiraViaCopel0825.pdf (Agosto 2025)
├── PrimeiraViaCopel0925.pdf (Setembro 2025)
├── PrimeiraViaCopel1025.pdf (Outubro 2025)
├── SegundaViaCopel0125.pdf (Janeiro 2025)
├── SegundaViaCopel0126.pdf (Janeiro 2026)
├── SegundaViaCopel0225.pdf (Fevereiro 2025)
├── SegundaViaCopel0236.pdf (Fevereiro 2026)
├── SegundaViaCopel0326.pdf (Março 2026)
├── SegundaViaCopel0425.pdf (Abril 2025)
├── SegundaViaCopel0725.pdf (Julho 2025)
├── SegundaViaCopel1125.pdf (Novembro 2025)
└── SegundaViaCopel1225.pdf (Dezembro 2025)
```

### Como Testar com Dados de Amostra

1. Abra http://localhost:3000/
2. Clique na área de upload ou arraste os PDFs
3. Selecione um ou mais PDFs da pasta `client/public/sample-pdfs/`
4. Clique em "Processar Faturas"
5. Veja os dados sendo analisados no dashboard

## 🛠️ Estrutura do Projeto

```
/home/ubuntu/agroenergy-insight-builder/
├── client/
│   ├── public/
│   │   ├── sample-pdfs/          ← Faturas de amostra
│   │   └── favicon.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── PDFUploader.tsx    ← Componente de upload
│   │   │   └── Dashboard.tsx      ← Componente de visualização
│   │   ├── lib/
│   │   │   └── pdfParser.ts       ← Parser de PDFs
│   │   ├── pages/
│   │   │   └── Home.tsx           ← Página principal
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── package.json
└── pnpm-lock.yaml
```

## 🔧 Tecnologias Utilizadas

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **PDF Processing**: pdfjs-dist 5.5
- **Charts**: Recharts 2
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📝 Comandos Disponíveis

```bash
# Iniciar servidor de desenvolvimento
pnpm run dev

# Verificar tipos TypeScript
pnpm run check

# Compilar para produção
pnpm run build

# Preview da build
pnpm run preview

# Formatar código
pnpm run format
```

## 🐛 Troubleshooting

### Porta 3000 em uso
Se a porta 3000 estiver em uso, o Vite automaticamente usará a próxima porta disponível (ex: 3001).

```bash
# Para liberar a porta:
lsof -i :3000
kill -9 <PID>
```

### PDFs não sendo processados
1. Verifique se o arquivo é um PDF válido
2. Verifique o console do navegador (F12) para mensagens de erro
3. Certifique-se de que o pdf.js worker está carregado corretamente

### Dados não aparecem no dashboard
1. Verifique se os PDFs foram processados com sucesso
2. Veja se há mensagens de erro no console
3. Tente com os PDFs de amostra primeiro

## 📈 Próximas Melhorias

- [ ] Suporte para outras concessionárias (CPFL, Enel, etc.)
- [ ] Exportação de dados em CSV/Excel
- [ ] Gráfico de projeção de burn rate
- [ ] Comparativo lado a lado de meses
- [ ] Cache local de faturas processadas
- [ ] Modo escuro
- [ ] Relatórios em PDF

## 📚 Referências

Para mais informações sobre o projeto, consulte:
- `docs/Development.md` - Guia de desenvolvimento
- `docs/NextSteps.md` - Próximas tarefas
- `docs/Roadmap.md` - Visão de longo prazo
- `skills/copel-pdf-specialist/SKILL.md` - Detalhes de parsing de PDFs
- `skills/agro-energy-analyst/SKILL.md` - Análise de dados agroindustriais

## 💡 Dicas de Uso

1. **Comece com dados de amostra**: Use os PDFs incluídos para entender como o sistema funciona
2. **Processe múltiplos meses**: Importe vários meses para ver tendências
3. **Verifique o autoconsumo**: Quanto maior o percentual, melhor o aproveitamento da energia solar
4. **Monitore os créditos**: Acompanhe o burn rate para prever quando os créditos acabarão
5. **Analise sazonalidade**: Compare meses de verão vs inverno para entender padrões

---

**Versão**: 1.0.0  
**Última atualização**: 19 de março de 2026  
**Status**: ✅ Pronto para uso
