# Gunakan node image sebagai base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json dan yarn.lock
COPY package.json yarn.lock ./

# Install dependencies menggunakan Yarn
RUN yarn install

# Copy seluruh kode ke dalam container
COPY . .

# Build aplikasi React untuk production
RUN yarn build

# Stage untuk menjalankan aplikasi
FROM node:18-alpine

# Install `serve` untuk menyajikan aplikasi
RUN yarn global add serve

# Set working directory
WORKDIR /app

# Copy build hasil dari stage sebelumnya ke direktori kerja
COPY --from=build /app/dist /app/dist

# Expose port 5700
EXPOSE 1001

# Jalankan `serve` untuk menyajikan aplikasi
CMD ["serve", "-s", "dist", "-l", "1001"]
