# Todo App

Một ứng dụng quản lý công việc đầy đủ giữa frontend và backend, được xây dựng bằng NestJS, Next.js, Prisma và MySQL.

## ✨ Tính năng chính

- Tạo, xem, cập nhật và xóa công việc
- Tìm kiếm và lọc công việc theo từ khóa và trạng thái
- Xóa mềm và quản lý thùng rác
- Khôi phục công việc đã xóa hoặc xóa vĩnh viễn
- Giao diện responsive phù hợp cả máy tính và điện thoại
- Cấu trúc code tách rõ giữa frontend và backend

## 🧱 Công nghệ sử dụng

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios
- Lucide Icons

### Backend
- NestJS
- TypeScript
- Prisma ORM
- MySQL
- Jest cho testing

## 📁 Cấu trúc dự án

```text
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── tasks/
│       ├── dto/
│       │   ├── create-task.dto.ts
│       │   ├── get-tasks-filter.dto.ts
│       │   └── update-task.dto.ts
│       ├── tasks.controller.ts
│       ├── tasks.module.ts
│       └── tasks.service.ts
├── test/
├── package.json
└── tsconfig.json

frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── trash/page.tsx
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskListCards.tsx
│   │   ├── TaskListTable.tsx
│   │   └── TaskListToolbar.tsx
│   ├── constants/
│   │   └── taskStatus.tsx
│   ├── hooks/
│   │   ├── useTaskForm.ts
│   │   └── useTaskList.ts
│   ├── services/
│   │   └── api.ts
│   └── types/
│       └── index.ts
├── package.json
└── tsconfig.json
```

## 🚀 Hướng dẫn chạy dự án

### 1. Yêu cầu hệ thống

Trước khi chạy dự án, hãy đảm bảo máy của bạn đã cài:

- Node.js 18+ hoặc 20+
- npm hoặc pnpm
- MySQL Server
- Git

> Nếu bạn chưa cài Node.js, hãy truy cập: https://nodejs.org/

### 2. Clone dự án về máy

```bash
git clone <repository-url>
cd todo-app
```

### 3. Cài đặt dependencies cho backend

```bash
cd backend
npm install
```

### 4. Cài đặt dependencies cho frontend

```bash
cd ../frontend
npm install
```

### 5. Cấu hình database MySQL

Trước tiên, hãy tạo một database trong MySQL, ví dụ:

```sql
CREATE DATABASE todo_app;
```

Sau đó tạo file `.env` trong thư mục `backend`:

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/todo_app"
PORT=3001
```

Nếu bạn dùng tài khoản khác thay vì `root`, hãy đổi lại cho phù hợp.

### 6. Chạy Prisma migration

Trong thư mục `backend`:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Lệnh này sẽ:
- tạo bảng dữ liệu trong MySQL
- sinh Prisma Client cho dự án

### 7. Khởi động backend

```bash
cd backend
npm run start:dev
```

Sau khi chạy thành công, backend sẽ chạy tại:

```text
http://localhost:3001/api
```

### 8. Khởi động frontend

Mở một terminal mới và chạy:

```bash
cd frontend
npm run dev
```

Sau khi chạy thành công, frontend sẽ chạy tại:

```text
http://localhost:3000
```

### 9. Truy cập ứng dụng

- Giao diện frontend: http://localhost:3000
- API backend: http://localhost:3001/api
- Vì dự án chưa dùng Swagger, bạn có thể test API bằng Postman hoặc VS Code REST Client

### 10. Các lỗi thường gặp

#### Lỗi kết nối database
- Kiểm tra lại `DATABASE_URL`
- Đảm bảo MySQL đang chạy
- Đảm bảo database `todo_app` đã được tạo

#### Lỗi Prisma Client
```bash
cd backend
npx prisma generate
```

#### Lỗi cổng đã được dùng
Nếu cổng `3000` hoặc `3001` đã bị chiếm, hãy đổi lại cổng hoặc dừng process đang dùng.

## 🔗 Tổng quan API

Sau khi khởi động backend, bạn có thể mở Swagger UI tại:

```text
http://localhost:3001/docs
```

### Tasks
- `GET /api/tasks` - Lấy danh sách công việc có phân trang
- `POST /api/tasks` - Tạo công việc mới
- `GET /api/tasks/:id` - Lấy thông tin một công việc
- `PATCH /api/tasks/:id` - Cập nhật công việc
- `DELETE /api/tasks/:id` - Xóa mềm công việc
- `GET /api/tasks/trash` - Lấy danh sách công việc trong thùng rác
- `PATCH /api/tasks/:id/restore` - Khôi phục công việc
- `DELETE /api/tasks/:id/permanent` - Xóa vĩnh viễn công việc

## 🧪 Chạy test

Chạy test backend:

```bash
cd backend
npm test
```

## 📝 Ghi chú

- Công việc bị xóa sẽ được đưa vào thùng rác thay vì bị xóa ngay lập tức.
- Hệ thống có job tự động dọn dẹp các công việc đã bị xóa quá hạn.

## 📄 Giấy phép

Dự án này được tạo cho mục đích học tập và phát triển cá nhân.
