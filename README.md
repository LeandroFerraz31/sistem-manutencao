# 🚛 Sistema de Controle de Manutenções de Veículos

---

## ✨ Visão geral para o cliente

Este projeto foi desenvolvido para **centralizar o controle das manutenções de veículos**, que antes era feito em **três processos separados** e agora está reunido em **um único sistema web**.  

### 📌 Para que serve?  
- **Cadastro de manutenções**: Informe data, placa, motorista, tipo de serviço, valor e outros dados.  
- **Listagem e gestão**: Veja todas as manutenções cadastradas, edite ou exclua registros.  
- **Relatórios e análises**: Filtre manutenções por período e placa, gere relatórios e exporte para Excel.  
- **Importação e exportação**: Trabalhe facilmente com planilhas Excel – ideal para integração com outros sistemas ou relatórios financeiros.  
- **Dashboard e “Colinha”**: Acompanhe indicadores importantes e consulte dados de forma rápida.

### 💡 Impacto positivo  
- **Facilita o trabalho**: tudo em um só lugar.  
- **Economia de tempo**: processos otimizados.  
- **Maior organização e confiabilidade**: dados claros, exportáveis e bem apresentados.  
- **Interface amigável**: simples, fácil de usar e responsiva.

---

## 🛠️ Parte técnica do projeto

### 🔙 Backend  
- **Python + Flask**:  
  - Rotas (API RESTful) para **cadastrar**, **editar**, **excluir**, **listar** e **gerar relatórios** de manutenções.  
  - Banco de dados **SQLite** para armazenamento simples e prático.  
  - Validações de dados (datas, campos obrigatórios, valores numéricos).  
  - Manipulação de arquivos **Excel** usando **pandas** e **xlsxwriter**:  
    - **Exportação**: gera planilhas prontas para análise.  
    - **Importação**: lê planilhas e importa os dados diretamente para o banco.  
  - Suporte a CORS para o frontend acessar a API de forma segura.

### 🔝 Frontend  
- **HTML5 + CSS3 + JavaScript**  
- **Bibliotecas**:  
  - **Axios** para requisições HTTP.  
  - **Chart.js** para gráficos de desempenho.  
  - **SheetJS (xlsx.js)** para importação/exportação de arquivos Excel diretamente do navegador.  
- **Funcionalidades principais**:  
  - Formulários de cadastro e edição de manutenções.  
  - Tabelas dinâmicas com edição e exclusão.  
  - Dashboard com contadores e gráficos de manutenções.  
  - “Colinha” para copiar dados importantes.  
  - Relatórios filtrados por período e placa.

---

## ⚙️ Como rodar o projeto

### 🔗 Pré-requisitos

- **Python 3.10+**  
- **pip** para gerenciar dependências  
- **Editor de código** (como VS Code)

### 🚀 Passos para rodar

1️⃣ Clone o repositório ou baixe os arquivos do projeto.  
2️⃣ Instale as dependências:  
```bash
pip install -r requirements.txt
```
### 💡 Ideias finais e sugestões de melhoria

💻 Melhorar a segurança: adicionar autenticação (login) para proteger as rotas e dados sensíveis.

📈 Mais relatórios e filtros: implementar filtros adicionais (por tipo de serviço, por motorista, por local).

🌐 Hospedagem na nuvem: deploy em serviços como Render, Railway ou Heroku para acesso em qualquer lugar.

🎨 Aprimorar o visual: adaptar o layout para dispositivos móveis (responsividade total).

🔧 APIs externas: integração com outros sistemas de gestão de frota ou ERP.

📝 Documentação de API: criar documentação em Swagger ou Postman para facilitar uso externo.

