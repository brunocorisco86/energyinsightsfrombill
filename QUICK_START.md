# 🚀 Quick Start — AgroEnergy Insight Builder

## ⚡ Começar em 30 segundos

### 1. Servidor já está rodando?
```bash
# Verifique em http://localhost:3000/
curl http://localhost:3000/
```

### 2. Se precisar reiniciar
```bash
cd /home/ubuntu/agroenergy-insight-builder
pnpm run dev
```

### 3. Usar a aplicação
1. Abra **http://localhost:3000/** no navegador
2. Arraste e solte um PDF ou clique para selecionar
3. Clique em "Processar Faturas"
4. Veja o dashboard com os dados analisados

## 📂 Dados de Amostra

Teste com os PDFs inclusos:
```
client/public/sample-pdfs/
```

Existem 15 faturas de amostra prontas para uso.

## 🎯 O que funciona

✅ Upload de PDFs  
✅ Extração de dados de faturas Copel  
✅ Dashboard com gráficos  
✅ Análise de autoconsumo  
✅ Histórico de créditos  
✅ Comparação de períodos  

## 📖 Documentação Completa

Veja `USAGE.md` para guia detalhado.

## 🔍 Verificar Status

```bash
# TypeScript check
pnpm run check

# Build
pnpm run build

# Format
pnpm run format
```

---

**Pronto para usar!** 🎉
