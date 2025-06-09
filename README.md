# Sistema de Controle de Manutenções de Veículos

## Descrição

Este projeto é um sistema web desenvolvido para facilitar o controle centralizado das manutenções de veículos em frotas. Ele permite cadastrar, listar, editar e excluir manutenções, gerar relatórios personalizados, e realizar importação/exportação de dados via arquivos Excel.

O sistema ajuda a evitar atrasos e custos desnecessários, otimizando a gestão da frota e fornecendo indicadores claros sobre manutenções e custos.

---

## Funcionalidades

- Cadastro de manutenções com informações como placa, data, serviço, custo e observações.
- Listagem e filtragem de registros por data e placa.
- Edição e exclusão simples dos registros.
- Dashboard com visão geral da quantidade total de manutenções e indicadores de serviços específicos (pneus, elétrica, checagem, etc.).
- Indicadores financeiros de custos diários, semanais e mensais.
- Geração de relatórios customizados para análise por período e veículo.
- Exportação e importação de dados em arquivos Excel, facilitando integração com outras ferramentas.

---

## Tecnologias Utilizadas

- **Backend:** Python (Flask ou Django)
- **Frontend:** HTML, CSS e JavaScript
- **Banco de Dados:** SQLite ou PostgreSQL
- **Bibliotecas para Excel:** Pandas e openpyxl
- **Deploy:** Render (hospedagem online)

---

## Instalação e Uso

### Pré-requisitos

- Python 3.8+
- Pip (gerenciador de pacotes Python)
- Banco de dados SQLite ou PostgreSQL configurado

### Passos para rodar localmente

1. Clone o repositório:


   git clone https://github.com/LeandroFerraz31/sistem-manutencao.git
   cd sistem-manutencao


2. Crie e ative um ambiente virtual (opcional, mas recomendado):


   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate     # Windows


3. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure as variáveis de ambiente (se aplicável) para conexão ao banco de dados.

5. Execute as migrações do banco (se houver):

   ```bash
   flask db upgrade  # ou comando equivalente conforme framework usado
   ```

6. Inicie o servidor:

   ```bash
   flask run  # ou python app.py / python manage.py runserver
   ```

7. Acesse a aplicação em: `http://localhost:5000`

---

## Deploy

O sistema está hospedado na plataforma Render e pode ser acessado via:
[https://sistem-manutencao.onrender.com](https://sistem-manutencao.onrender.com)

---

## Contribuição

Contribuições são bem-vindas! Para contribuir, siga os passos:

1. Fork este repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`).
3. Faça commit das suas alterações (`git commit -m 'Adicionar nova funcionalidade'`).
4. Envie para a branch principal do seu fork (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## Contato

Leandro Ferraz
Email: [leandro.santos@universo.univates.br](mailto:leandro.santos@universo.univates.br)
GitHub: [https://github.com/LeandroFerraz31](https://github.com/LeandroFerraz31)

---

Obrigado por visitar o projeto!
Fique à vontade para testar, contribuir e enviar feedback.

```

