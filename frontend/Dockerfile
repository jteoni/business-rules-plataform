# Define a imagem base usando a versão oficial do Node
FROM node:16

# Instalar Bun
RUN curl -fsSL https://bun.sh/install | bash

# Adiciona o binário do bun ao PATH
ENV PATH="/root/.bun/bin:${PATH}"

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json bun.lockb ./

# Instala as dependências do projeto
RUN yarn

# Copia os arquivos restantes do projeto para o diretório de trabalho
COPY . .

# Expõe a porta que o servidor de desenvolvimento usa
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["yarn", "run", "dev"]
