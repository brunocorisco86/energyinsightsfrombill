# ✅ Checklist de Setup — AgroEnergy Insight Builder

Use este checklist para garantir que tudo está configurado corretamente.

---

## 📋 Pré-requisitos

- [ ] **Node.js instalado** (versão 18+)
  ```bash
  node --version
  ```
  Esperado: `v18.x.x` ou superior

- [ ] **npm instalado**
  ```bash
  npm --version
  ```
  Esperado: `v9.x.x` ou superior

- [ ] **pnpm instalado**
  ```bash
  pnpm --version
  ```
  Esperado: `v10.x.x` ou superior
  
  Se não tiver, instale:
  ```bash
  npm install -g pnpm
  ```

- [ ] **Git instalado**
  ```bash
  git --version
  ```
  Esperado: `git version 2.x.x` ou superior

---

## 📥 Instalação

### Passo 1: Clonar o Repositório

- [ ] Abra o terminal/prompt de comando

- [ ] Navegue até a pasta onde quer o projeto
  ```bash
  cd ~/Documentos
  # ou qualquer outra pasta
  ```

- [ ] Clone o repositório
  ```bash
  git clone https://github.com/brunocorisco86/energyinsightsfrombill.git
  ```

- [ ] Entre na pasta do projeto
  ```bash
  cd energyinsightsfrombill
  ```

- [ ] Verifique se está na pasta correta
  ```bash
  ls -la
  # Deve ver: package.json, client/, docs/, skills/, etc.
  ```

### Passo 2: Instalar Dependências

- [ ] Execute o comando de instalação
  ```bash
  pnpm install
  ```

- [ ] Aguarde a conclusão (2-5 minutos)

- [ ] Verifique se a pasta `node_modules/` foi criada
  ```bash
  ls -la | grep node_modules
  ```

- [ ] Verifique se o arquivo `pnpm-lock.yaml` foi criado
  ```bash
  ls -la pnpm-lock.yaml
  ```

### Passo 3: Verificar Instalação

- [ ] Execute a verificação de tipos
  ```bash
  pnpm run check
  ```

- [ ] Verifique se não há erros
  ```
  Esperado: Sem mensagens de erro
  ```

---

## 🚀 Executar a Aplicação

### Passo 4: Iniciar o Servidor

- [ ] Execute o comando de desenvolvimento
  ```bash
  pnpm run dev
  ```

- [ ] Aguarde a mensagem de sucesso
  ```
  Esperado:
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.X.X:3000/
  ```

- [ ] Verifique se a porta 3000 está disponível
  - Se receber erro "Port 3000 is already in use", veja a seção **Troubleshooting**

### Passo 5: Acessar a Aplicação

- [ ] Abra seu navegador (Chrome, Firefox, Safari, Edge)

- [ ] Acesse a URL
  ```
  http://localhost:3000/
  ```

- [ ] Verifique se a página carregou
  - [ ] Vê o logo "AgroEnergy Insight Builder"
  - [ ] Vê a área de upload de PDFs
  - [ ] Vê a mensagem de boas-vindas

---

## 📊 Testar a Funcionalidade

### Passo 6: Processar um PDF

- [ ] Clique na área de upload ou arraste um arquivo

- [ ] Navegue até `client/public/sample-pdfs/`

- [ ] Selecione um PDF (ex: `PrimeiraViaCopel0325.pdf`)

- [ ] Clique em "Processar Faturas"

- [ ] Aguarde o processamento (2-3 segundos)

- [ ] Verifique se o dashboard apareceu
  - [ ] Vê os 4 KPI Cards (Consumo, Geração, Créditos, Gasto)
  - [ ] Vê os 4 Gráficos
  - [ ] Vê a tabela com dados detalhados

### Passo 7: Testar com Múltiplos PDFs

- [ ] Clique em "Adicionar mais faturas"

- [ ] Selecione 2-3 PDFs diferentes

- [ ] Clique em "Processar Faturas"

- [ ] Verifique se os dados foram adicionados
  - [ ] Os gráficos mostram múltiplos meses
  - [ ] A tabela tem múltiplas linhas

---

## 🔧 Verificações Técnicas

- [ ] **TypeScript sem erros**
  ```bash
  pnpm run check
  ```
  Esperado: Sem erros

- [ ] **Projeto compila**
  ```bash
  pnpm run build
  ```
  Esperado: Sem erros, pasta `dist/` criada

- [ ] **Código formatado**
  ```bash
  pnpm run format
  ```
  Esperado: Sem erros

---

## 🐛 Troubleshooting

### ❌ Erro: "pnpm: command not found"

- [ ] Instale pnpm globalmente
  ```bash
  npm install -g pnpm
  ```

- [ ] Verifique a instalação
  ```bash
  pnpm --version
  ```

### ❌ Erro: "Port 3000 is already in use"

**Opção 1: Liberar a porta**

- [ ] Identifique o processo usando a porta
  ```bash
  # Windows
  netstat -ano | findstr :3000
  
  # Mac/Linux
  lsof -i :3000
  ```

- [ ] Mate o processo
  ```bash
  # Windows
  taskkill /PID <PID> /F
  
  # Mac/Linux
  kill -9 <PID>
  ```

- [ ] Reinicie o servidor
  ```bash
  pnpm run dev
  ```

**Opção 2: Usar outra porta**

- [ ] Execute com porta diferente
  ```bash
  pnpm run dev -- --port 3001
  ```

- [ ] Acesse em
  ```
  http://localhost:3001/
  ```

### ❌ Erro: "node_modules not found"

- [ ] Instale as dependências
  ```bash
  pnpm install
  ```

- [ ] Aguarde a conclusão

### ❌ PDFs não são processados

- [ ] Verifique se o arquivo é um PDF válido

- [ ] Abra o console do navegador (F12)

- [ ] Procure por mensagens de erro

- [ ] Tente com os PDFs de amostra primeiro

- [ ] Reinicie o servidor
  ```bash
  # Ctrl+C para parar
  # Depois execute novamente
  pnpm run dev
  ```

### ❌ Aplicação muito lenta

- [ ] Feche outras abas/programas

- [ ] Limpe o cache do navegador (Ctrl+Shift+Delete)

- [ ] Reinicie o servidor

- [ ] Tente em outro navegador

---

## ✨ Sucesso!

Se todas as caixas acima estão marcadas ✅, a aplicação está funcionando corretamente!

---

## 📞 Próximos Passos

- [ ] Leia `USAGE.md` para entender todas as funcionalidades

- [ ] Leia `IMPLEMENTATION_SUMMARY.md` para detalhes técnicos

- [ ] Explore o código em `client/src/`

- [ ] Faça modificações conforme necessário

---

## 🎯 Comandos Rápidos

```bash
# Iniciar desenvolvimento
pnpm run dev

# Parar o servidor
Ctrl + C

# Verificar tipos
pnpm run check

# Compilar para produção
pnpm run build

# Preview da build
pnpm run preview

# Formatar código
pnpm run format

# Reinstalar dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

**Versão**: 1.0.0  
**Última atualização**: 19 de março de 2026  
**Status**: ✅ Testado e funcionando
