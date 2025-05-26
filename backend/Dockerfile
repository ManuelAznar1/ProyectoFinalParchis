FROM node:22

WORKDIR /app

# Variable de entorno para Vite (prefijo VITE_ necesario)
ARG DB_HOST
ENV DB_HOST=${DB_HOST}

ARG DB_USER
ENV DB_USER=${DB_USER}

ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}

ARG DB_NAME
ENV DB_NAME=${DB_NAME}

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto del servidor (ajustado a tu backend)
EXPOSE 3001

# Comando para ejecutar tu servidor
CMD ["node", "server.js"]

