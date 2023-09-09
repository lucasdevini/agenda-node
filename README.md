# Agenda Node 
[![NPM](https://img.shields.io/npm/l/react)](https://github.com/lucasdevini/agenda-node/blob/master/LICENSE) 

# Sobre o projeto

Agenda Node é uma aplicação full stack web de cunho autoral que permite a realização, acompanhamento e gerenciamento de agendamentos.

## Layout web
![Tela do form de agendamentos](public/readme_content/images/schedule_form.png)

![Tela dos agendamentos pendentes](public/readme_content/images/peding_schedules.png)

## Funcionalidades
### Usuários:
- Cadastro;
- Realizar agendamento;
- Acompanhamento de agendamentos;
- Redefinção de senha;

### Administrador: 
- Confirmar agendamentos;
- Recusar agendamentos;
- Filtrar agendamentos por data;

# Tecnologias utilizadas
## Back end
- Node.js
## Front end
- Mustache / HTML
- TailwindCSS
- JavaScript / TypeScript
## Banco de dados
- MariaDB

# Como executar o projeto na sua máquina

## Pré-requisitos
- Antes de começar, é necessário que você tenha instalado em sua máquina as seguintes ferramentas: Git, XAMPP, HeidiSQL (ou outra ferramenta semelhante) e Node. Além disso, é interessante ter um editor para melhor visualização dos códigos como o VSCode.

  - link do Git: https://git-scm.com/downloads
  - link do XAMPP: https://www.apachefriends.org/pt_br/index.html
  - link do HeidiSQL: https://www.heidisql.com/download.php
  - link do Node: https://nodejs.org/en/download
  - link do VSCode: https://code.visualstudio.com/Download

- Dentro da pasta htdocs, crie uma pasta para receber os arquivos do projeto. Uma sugestão de nome é agenda_node. 
  - caminho padrão para a pasta htdocs: C:\xampp\htdocs
 
  ![Crianda a pasta agenda_node](public/readme_content/images/create_folder.png)
  
- Além de realizar os passos acima, abra o prompt de comando e digite o seguinte comando para instalar as dependências globais necessárias para rodar o projeto: 

```bash
npm install -g nodemon typescript ts-node
```

![Instalando dependências globais](public/readme_content/images/install_global_dependencies.png)

## Rodando o projeto
- Abra o Git Bash e digite os seguintes comandos nessa ordem: 

```bash
# Acesse a pasta criada para receber os arquivos do projeto no xampp
$ cd C:/xampp/htdocs/agenda_node
```

```bash
# Clone este repositório
$ git clone https://github.com/lucasdevini/agenda-node.git
```

![Digitando comandos no Git Bash](public/readme_content/gifs/gif_gitbash_commands.gif) 

- Abra o XAMPP e dê um start no MySQL

![Dando start no MySQL](public/readme_content/images/xampp.png) 

- Abra o HeidiSQL:
  - clique em Nova
  - Apenas copie as configuraçães do gif abaixo
  - Clique em abrir 

![Criando conexão no HeidiSQL](public/readme_content/gifs/gif_create_connection.gif)

- Ainda dentro do HeidiSQL:
  - Clique com o botão direito sobre a conexão criada
  - Criar novo > Banco de dados
  - Dê o nome ao banco de agenda_node
  - Clique sobre o banco criado e vá até o ícone de pasta na parte superior
  - Procure pelo arquivo agenda_node.sql que está dentro da pasta do projeto
  - Após selecionar o arquivo .sql
 
![Criando banco de dados no HeidiSQL](public/readme_content/gifs/gif_create_database.gif)

- Agora abra a pasta do projeto com o VSCode, ou qualquer outro editor de código:
    - abra o prompt integrado (CTRL + ", no VSCode)
    - digite os seguintes comandos nessa ordem:  

    ```bash
    npm install
    ```

    ```bash
    npm run start-dev
    ```
![Abrindo o VSCode](public/readme_content/gifs/gif_open_vscode.gif)
    
- Abra seu navegador de preferência e digite a seguinte url: localhost/register

![Abrindo a aplicação no navegador](public/readme_content/gifs/gif_open_browser.gif)
 
# Autor

Lucas Vinícius Vieira da Silva

# Projeto em desenvolvimento :construction:
