# Sistema de Pré-Matrícula Acadêmica

Sistema web desenvolvido para gerenciamento do processo de pré-matrícula acadêmica. A aplicação permite que alunos consultem disciplinas disponíveis, registrem interesse em cursá-las e acompanhem suas solicitações. A Secretaria Acadêmica pode gerenciar alunos, disciplinas, interesses, matrículas e relatórios administrativos.

## Tecnologias Utilizadas

### Frontend

* React
* JavaScript
* CSS3
* Material Symbols
* Firebase Authentication

### Backend

* Laravel
* PHP
* API REST
* Eloquent ORM

### Banco de Dados

* PostgreSQL

## Funcionalidades

### Aluno

* Login com conta Google institucional
* Consulta de disciplinas disponíveis
* Registro de interesse em disciplinas
* Consulta de interesses registrados
* Retirada de interesse
* Visualização do perfil

### Secretaria Acadêmica

* Dashboard administrativo
* Gerenciamento de alunos
* Gerenciamento de disciplinas
* Consulta de interesses
* Confirmação de matrículas
* Geração de relatórios detalhados
* Impressão de relatórios por disciplina

## Estrutura do Projeto

```txt
sistema-pre-matricula-academica/
├── backend/
├── frontend/
├── docs/
├── README.md
└── .gitignore
```

## Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/sistema-pre-matricula-academica.git
cd sistema-pre-matricula-academica
```

### 2. Configurar o backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

O backend ficará disponível em:

```txt
http://127.0.0.1:8000
```

### 3. Configurar o frontend

Em outro terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm start
```

O frontend ficará disponível em:

```txt
http://localhost:3000
```

## Autenticação

O sistema utiliza Firebase Authentication para autenticação com conta Google. Apenas e-mails institucionais com domínio `@uesb.edu.br` devem ter acesso ao sistema.

Também existe modo de demonstração para facilitar testes acadêmicos.

## Relatórios

O sistema gera relatórios administrativos com informações sobre:

* total de alunos cadastrados;
* total de disciplinas;
* interesses registrados;
* matrículas confirmadas;
* disciplinas mais procuradas;
* alunos inscritos por disciplina;
* vagas disponíveis;
* situação dos interesses e matrículas.

## Objetivo Acadêmico

Este projeto foi desenvolvido como trabalho da disciplina de Desenvolvimento de Sistemas Web, com o objetivo de aplicar conceitos de frontend, backend, banco de dados, autenticação, API REST e organização de sistemas web.

## Autores

* Ivana Souza Santos
* João Paulo Sandes Brito
* João Vitor Oliveira

## Instituição

Universidade Estadual do Sudoeste da Bahia — UESB
Curso de Ciência da Computação
Disciplina: Desenvolvimento de Sistemas Web
