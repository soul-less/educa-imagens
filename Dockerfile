# Estágio 1: Construção e Atualização do HTML usando Node.js
FROM node:22-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia todos os arquivos do repositório para dentro do diretório de trabalho
COPY . .

# Executa o script para buscar todas as imagens .webp e injetar no index.html
RUN node atualizar_galeria.js

# Estágio 2: Servidor Web usando Nginx (Leve e rápido)
FROM nginx:alpine

# Remove os arquivos padrão do Nginx para evitar conflitos
RUN rm -rf /usr/share/nginx/html/*

# Copia o projeto inteiro processado do estágio anterior para a pasta pública do Nginx
# Isso inclui o index.html atualizado, a pasta /imagens e os arquivos originais
COPY --from=builder /app /usr/share/nginx/html

# Configura as permissões para o Nginx ler os arquivos corretamente
RUN chown -R nginx:nginx /usr/share/nginx/html

# Expõe a porta 80, que é a porta padrão para o Coolify fazer o roteamento
EXPOSE 82

# Inicia o Nginx no modo em primeiro plano
CMD ["nginx", "-g", "daemon off;"]
