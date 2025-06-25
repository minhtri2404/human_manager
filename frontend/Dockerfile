# Giai đoạn build
FROM node:20 as build

# Thư mục làm việc trong container
WORKDIR /app

# Cài đặt dependency
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn và build
COPY . .
RUN npm run build

# Giai đoạn serve với nginx
FROM nginx:alpine

# Copy bản build từ giai đoạn trước vào thư mục nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose cổng 80
EXPOSE 80

# Khởi động nginx
CMD ["nginx", "-g", "daemon off;"]
