# Sử dụng Node.js phiên bản phù hợp
FROM node:16

# Tạo và đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng mà ứng dụng sẽ chạy
EXPOSE 5000

# Khởi chạy ứng dụng
CMD ["npm", "start"]
