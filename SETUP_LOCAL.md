# 📖 Guia Passo a Passo — Rodar Localmente

Este guia detalha todos os passos necessários para rodar a aplicação **AgroEnergy Insight Builder** na sua máquina local.

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de que você tem instalado:

### 1. **Node.js** (versão 18 ou superior)

**Windows/Mac:**
- Baixe em: https://nodejs.org/
- Escolha a versão LTS (recomendado)
- Execute o instalador e siga as instruções

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verificar instalação:**
```bash
node --version
npm --version
```

### 2. **pnpm** (gerenciador de pacotes)

**Windows/Mac/Linux:**
```bash
npm install -g pnpm
```

**Verificar instalação:**
```bash
pnpm --version
```

### 3. **Git** (para clonar o repositório)

**Windows:**
- Baixe em: https://git-scm.com/download/win

**Mac:**
```bash
brew install git
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install git
```

**Verificar instalação:**
```bash
git --version
```

---

## 📥 Passo 1: Clonar o Repositório

Abra o terminal/prompt de comando e execute:

```bash
git clone https://github.com/brunocorisco86/energyinsightsfrombill.git
cd energyinsightsfrombill
```

Ou, se você já tem o projeto em uma pasta:

```bash
cd /caminho/para/agroenergy-insight-builder
```

---

## 📦 Passo 2: Instalar Dependências

No terminal, na pasta do projeto, execute:

```bash
pnpm install
```

Isso irá:
- Baixar todas as dependências necessárias
- Criar a pasta `node_modules/`
- Gerar o arquivo `pnpm-lock.yaml`

**Tempo estimado:** 2-5 minutos (depende da sua conexão)

**Saída esperada:**
```
✓ Packages: +XXX
Done in X.Xs using pnpm vX.X.X
```

---

## ✅ Passo 3: Verificar Instalação

Verifique se tudo foi instalado corretamente:

```bash
pnpm run check
```

Isso irá verificar os tipos TypeScript. Você deve ver:

```
> agroenergy-insight-builder@1.0.0 check
> tsc --noEmit
```

Se não houver erros, está tudo certo! ✅

---

## 🚀 Passo 4: Iniciar o Servidor de Desenvolvimento

Execute o comando:

```bash
pnpm run dev
```

Você verá uma saída como:

```
> agroenergy-insight-builder@1.0.0 dev
> vite --host

  VITE v7.1.9  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.X.X:3000/
```

---

## 🌐 Passo 5: Acessar a Aplicação

Abra seu navegador e acesse:

```
http://localhost:3000/
```

Você deve ver a página inicial com:
- Logo "AgroEnergy Insight Builder"
- Área de upload de PDFs
- Mensagem de boas-vindas

---

## 📂 Passo 6: Testar com PDFs de Amostra

### Opção A: Usar PDFs Inclusos

1. Na aplicação, clique na área de upload ou arraste arquivos
2. Navegue até: `client/public/sample-pdfs/`
3. Selecione um ou mais PDFs (ex: `PrimeiraViaCopel0325.pdf`)
4. Clique em "Processar Faturas"
5. Aguarde o processamento (2-3 segundos)
6. Veja o dashboard com os dados analisados

### Opção B: Usar Seus Próprios PDFs

1. Prepare seus PDFs de faturas Copel
2. Arraste-os para a aplicação
3. Clique em "Processar Faturas"
4. Os dados serão extraídos e analisados

---

## 📊 Passo 7: Explorar o Dashboard

Após processar os PDFs, você verá:

### **KPI Cards** (no topo)
- Consumo Total (kWh)
- Geração Solar (kWh)
- Créditos Solares (kWh)
- Gasto Total (R$)

### **Gráficos** (no meio)
- Consumo vs Geração (barras)
- Autoconsumo Médio (pizza)
- Evolução de Créditos (linha)
- Valor das Faturas (barras)

### **Tabela Detalhada** (embaixo)
- Período, Consumo, Geração, Créditos, Autoconsumo, Total

---

## 🛑 Passo 8: Parar o Servidor

Para parar o servidor, no terminal pressione:

```
Ctrl + C
```

---

## 🔄 Próximas Vezes

Para rodar novamente:

```bash
cd /caminho/para/agroenergy-insight-builder
pnpm run dev
```

Acesse em: `http://localhost:3000/`

---

## 🐛 Troubleshooting

### **Erro: "Port 3000 is already in use"**

A porta 3000 está sendo usada por outro programa. Opções:

**Opção 1:** Liberar a porta
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

**Opção 2:** Usar outra porta
```bash
pnpm run dev -- --port 3001
```

Depois acesse: `http://localhost:3001/`

---

### **Erro: "pnpm: command not found"**

pnpm não está instalado. Execute:

```bash
npm install -g pnpm
```

---

### **Erro: "node_modules not found"**

Dependências não foram instaladas. Execute:

```bash
pnpm install
```

---

### **PDFs não são processados**

1. Verifique se o arquivo é um PDF válido
2. Abra o console do navegador (F12) e procure por erros
3. Tente com os PDFs de amostra primeiro
4. Verifique se o navegador permite acesso a arquivos locais

---

### **Aplicação muito lenta**

1. Feche outras abas/programas
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Reinicie o servidor: `Ctrl+C` e `pnpm run dev`

---

## 📝 Comandos Úteis

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

# Instalar dependências
pnpm install

# Atualizar dependências
pnpm update
```

---

## 📁 Estrutura de Pastas

```
agroenergy-insight-builder/
├── client/
│   ├── public/
│   │   ├── sample-pdfs/          ← PDFs de amostra
│   │   └── favicon.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── PDFUploader.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── lib/
│   │   │   └── pdfParser.ts
│   │   ├── pages/
│   │   │   └── Home.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── package.json
├── pnpm-lock.yaml
├── USAGE.md
├── QUICK_START.md
└── SETUP_LOCAL.md (este arquivo)
```

---

## 🎯 Resumo Rápido

| Passo | Comando | Tempo |
|-------|---------|-------|
| 1. Clonar | `git clone ...` | 1 min |
| 2. Instalar | `pnpm install` | 3-5 min |
| 3. Verificar | `pnpm run check` | 30 seg |
| 4. Rodar | `pnpm run dev` | 1 min |
| 5. Acessar | `http://localhost:3000/` | Imediato |
| 6. Testar | Upload de PDF | 2-3 seg |

**Tempo total:** ~10-15 minutos

---

## ✨ Pronto!

Você agora tem a aplicação rodando localmente! 🎉

Se encontrar algum problema, consulte a seção **Troubleshooting** acima.

---

## 📚 Documentação Adicional

- `USAGE.md` - Guia completo de uso
- `QUICK_START.md` - Início rápido
- `IMPLEMENTATION_SUMMARY.md` - Detalhes técnicos
- `docs/Development.md` - Guia de desenvolvimento

---

**Versão**: 1.0.0  
**Última atualização**: 19 de março de 2026  
**Status**: ✅ Testado e funcionando
