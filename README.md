# Vitrine Digital — Front-end

Painel web para gerenciar uma vitrine digital: conteúdo exibido em TVs e telas de lojas. Pelo painel você cadastra mídias (imagens e vídeos), produtos e tabelas de preço, monta templates e playlists e vincula cada playlist aos dispositivos de exibição.

Cada playlist pode ser aberta em qualquer tela pela rota pública `/view/:code`, usando um código de 5 dígitos. O painel também tem dashboard com informações do sistema, gestão de usuários, planos e FAQ.

> Este repositório contém só o front-end. Ele consome uma API REST separada, configurada pela variável `REACT_APP_API_URL`.

## Como iniciar

Pré-requisitos: Node.js 18+ e npm.

```bash
# instalar as dependências
npm install

# criar o arquivo de ambiente
echo REACT_APP_API_URL=http://localhost:8080 > .env.development

# rodar em modo desenvolvimento (http://localhost:3000)
npm run start:dev
```

Outros scripts:

| Script | Descrição |
| --- | --- |
| `npm run start:prod` | Roda usando o `.env.production` |
| `npm run build:dev` / `npm run build:prod` | Gera o build de produção na pasta `build/` |
| `npm test` | Executa os testes |

## Stack

- **React 18** + **TypeScript** (Create React App)
- **Material UI 6** (com MUI X Data Grid e Date Pickers)
- **Redux Toolkit** + **RTK Query** para estado e chamadas à API
- **React Router 7** para as rotas
- **React Hook Form** + **Yup** para formulários e validação
- **react-beautiful-dnd**, **react-dropzone** e **react-toastify** para a interface
