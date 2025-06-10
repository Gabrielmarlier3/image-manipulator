
# 🖼️ Image Manipulator

Projeto fullstack para manipulação de imagens com funcionalidades de **upscale**, **downscale** e **inserção de ruído**, além de processamento de vídeo e áudio.

## 📁 Estrutura do Projeto

```text
image-manipulator/
├── backend/     # Backend em NestJS
└── frontend/    # Frontend em Next.js
````

## 🚀 Tecnologias

* **Frontend**

    * [Next.js](https://nextjs.org/)
    * [TailwindCSS](https://tailwindcss.com/)
    * [Radix UI](https://www.radix-ui.com/)

* **Backend**

    * [NestJS](https://nestjs.com/)
    * [Sharp](https://sharp.pixelplumbing.com/) para manipulação de imagens
    * [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) + [@ffmpeg-installer/ffmpeg](https://github.com/transitive-bullshit/ffmpeg-static) para vídeo e áudio

* **Linguagem**: TypeScript

---

## 🛠️ Como rodar o projeto

### ✅ Requisitos

* Node.js 18+
* npm ou pnpm (ou Yarn)

---

### 🧩 Rodando o Backend (NestJS)

```bash
cd backend/
npm install
npm run start
```

> O backend irá rodar por padrão em `http://localhost:3001`

---

### 🧩 Rodando o Frontend (Next.js)

```bash
cd frontend/
npm install
npm run start
```

> O frontend irá rodar por padrão em `http://localhost:3000`

---

## 🖼️ Funcionalidades

* **Imagens**

    * Upload de imagem
    * Upscale com fator ajustável (≥ 1)
    * Downscale com fator ajustável (≤ 1)
    * Adição de ruído (% ajustável)
    * Visualização lado a lado dos resultados

* **Vídeo**

    * Upload de vídeo
    * Upscale/downscale para resolução customizada
    * Filtro preto e branco (grayscale)
    * Texto centralizado como marca d’água

* **Áudio**

    * Upload de áudio
    * Gravador de áudio via navegador
    * Visualização em tempo real do espectro de frequência
    * Efeito de eco com parâmetros ajustáveis
    * Aumento de volume

---

## 🙋‍♂️ Autor

Desenvolvido por Gabriel Marliere de Souza ✨

