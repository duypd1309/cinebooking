# Cinebooking - Ứng dụng đặt vé xem phim

![Cinebooking](https://files.catbox.moe/uv38wo.png)

---

## Mô tả dự án

Cinebooking là hệ thống đặt vé xem phim trực tuyến được xây dựng với công nghệ **Next.js** cho frontend và **Express.js** cho backend, sử dụng **MySQL** làm cơ sở dữ liệu.

Ứng dụng cho phép người dùng:

- Đăng ký, đăng nhập
- Xem danh sách phim, lịch chiếu, rạp
- Đặt vé và thanh toán (chức năng có thể mô phỏng)
- Quản lý người dùng, địa điểm, rạp chiếu, phim và suất chiếu (phần admin)

---

## Công nghệ sử dụng

- Frontend: Next.js (React)
- Backend: Express.js (Node.js)
- Database: MySQL
- Authentication: JWT
- Styling: Tailwind CSS

---

## Cấu trúc thư mục

    cinebooking/
    ├── frontend/        # Mã nguồn frontend Next.js
    ├── backend/         # Mã nguồn backend Express.js
    ├── cinebooking_schema.sql   # Script tạo bảng và seed dữ liệu MySQL
    ├── .gitignore
    ├── README.md
    └── ...

---

## Hướng dẫn cài đặt và chạy dự án

### 1. Chuẩn bị cơ sở dữ liệu

- Cài đặt MySQL (phiên bản phù hợp)
- Tạo database mới
- Import file `cinebooking_schema.sql` để tạo bảng và dữ liệu mẫu

### 2. Cấu hình biến môi trường

Tạo file `.env` ở mỗi thư mục `frontend` và `backend` dựa theo `.env.example` có sẵn, ví dụ:

- **backend/.env**

  ```env
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=yourpassword
  DB_NAME=cinebooking
  DB_PORT=3306
  JWT_SECRET=your_jwt_secret_key
  CLIENT_URL=http://localhost:3000
  ```

- **frontend/.env**

  ```env
  NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
  ```

### 3. Cài đặt và chạy backend

```bash
cd backend
npm install
npm start
```

Backend sẽ chạy mặc định trên port 5000 (hoặc port bạn cấu hình)

### 4. Cài đặt và chạy frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy mặc định trên port 3000
