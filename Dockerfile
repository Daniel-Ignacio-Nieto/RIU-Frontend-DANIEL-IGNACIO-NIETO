# Etapa 1: Construcción de la aplicación Angular
FROM node:18 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de Node
RUN npm install

# Copia el código fuente al contenedor
COPY . .

# Construye la aplicación Angular en modo producción
RUN npm run build --configuration=production

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copia los archivos construidos a la carpeta de Nginx
COPY --from=build /app/dist/super-heroes/browser /usr/share/nginx/html

# Copia la configuración personalizada de Nginx al contenedor
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 (puerto por defecto para Nginx)
EXPOSE 80

# Arranca Nginx
CMD ["nginx", "-g", "daemon off;"]
