# Fase 1: build del frontend con Vite
FROM node:22 AS build

WORKDIR /app

# Variable de entorno para Vite (prefijo VITE_ necesario)
ARG VITE_BACKEND_HOST
ENV VITE_BACKEND_HOST=${VITE_BACKEND_HOST}

ARG VITE_BACKEND_HOST_WS
ENV VITE_BACKEND_HOST_WS=${VITE_BACKEND_HOST_WS}

ARG VITE_BACKEND_HOST_WS_PATH
ENV VITE_BACKEND_HOST_WS_PATH=${VITE_BACKEND_HOST_WS_PATH}



# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir el proyecto
RUN npm run build

# Fase 2: imagen final con servidor estático
FROM node:22 AS production

WORKDIR /app

# Instalar servidor estático
RUN npm install -g serve

# Copiar artefacto de build desde la etapa anterior
COPY --from=build /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Lanzar servidor estático
CMD ["serve", "-s", "dist", "-l", "3000", "--single"]

