# Base image sử dụng Node 20
FROM node:20

# Tạo thư mục làm việc
WORKDIR /app

# Copy file cấu hình để cài thư viện
COPY package*.json ./

# Cài thư viện trong môi trường Docker
RUN npm install

# Copy toàn bộ mã nguồn và file môi trường
COPY . .
COPY .env .env

# Rebuild lại bcrypt phù hợp với Linux (Docker)
RUN npm rebuild bcrypt --build-from-source

# Mở cổng backend
EXPOSE 4000

# Lệnh chạy ứng dụng
CMD ["node", "app.js"]
