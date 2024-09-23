# Fase 1: Usa una imagen de Node.js para construir la aplicación
FROM node:18-alpine AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código de la aplicación
COPY . .

# Compila la aplicación de React para producción
RUN npm run build

# Fase 2: Usa Nginx para servir la aplicación estática
FROM nginx:alpine

# Copia los archivos construidos desde la primera fase al servidor Nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expone el puerto 80 para servir la aplicación
EXPOSE 80

# Comando por defecto para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
