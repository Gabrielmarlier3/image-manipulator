
# 🖼️ Image Manipulator

Projeto fullstack para manipulação de imagens com funcionalidades de **upscale**, **downscale** e **inserção de ruído**.

## 📁 Estrutura do Projeto

```text
image-manipulator/
├── backend/     # Backend em NestJS
└── frontend/    # Frontend em Next.js
```

## 🚀 Tecnologias

- **Frontend**: [Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/)
- **Backend**: [NestJS](https://nestjs.com/), [Sharp](https://sharp.pixelplumbing.com/) para manipulação de imagens
- **Linguagem**: TypeScript

---

## 🛠️ Como rodar o projeto

### ✅ Requisitos

- Node.js 18+
- npm ou pnpm
- (opcional) Yarn

---

### 🧩 Rodando o Backend (NestJS)

Abra um terminal e execute:

```bash
    cd backend/
    npm install
    npm run start
````

> O backend irá rodar por padrão em `http://localhost:3001`

---

### 🧩 Rodando o Frontend (Next.js)

Abra outro terminal e execute:

```bash
    cd frontend/
    npm install
    npm run start
```

> O frontend irá rodar por padrão em `http://localhost:3000`

---

## 🖼️ Funcionalidades

* Upload de imagem
* Upscale com fator ajustável (≥ 1)
* Downscale com fator ajustável (≤ 1)
* Adição de ruído (% ajustável)
* Visualização lado a lado dos resultados

---

## 🙋‍♂️ Autor

Desenvolvido por Gabriel Marliere de Souza ✨

