# Usa una imagen base de Node.js con soporte para TypeScript
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias necesarias (incluye dev si es necesario)
RUN npm install

# Copia el resto de la aplicación al contenedor
COPY . .

# Genera los binarios de Prisma para el entorno de producción
RUN npx prisma generate

# Construye la aplicación de NestJS (compila el código TypeScript a JavaScript)
RUN npm run build

# Expone el puerto en el que corre tu aplicación NestJS
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]
