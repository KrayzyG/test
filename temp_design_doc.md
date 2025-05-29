---
**LƯU Ý QUAN TRỌNG (IMPORTANT NOTE):**

Tài liệu này mô tả thiết kế ban đầu của ứng dụng Locket Clone. Kể từ lần cập nhật cuối của tài liệu này, đã có những thay đổi quan trọng đối với dự án:

1.  **Loại bỏ Chức năng Video:** Tất cả các chức năng liên quan đến quay, chọn, chỉnh sửa, tải lên và lịch sử video đã bị **loại bỏ** khỏi ứng dụng. Chức năng hiện tại chỉ tập trung vào chia sẻ ảnh.
2.  **Thay đổi API Backend và Trạng thái Placeholder:**
    *   API endpoint chính để tạo "moment" (chia sẻ ảnh) đã được thay đổi thành `POST /api/v1/moments`. Frontend hiện tại chịu trách nhiệm tải ảnh lên Firebase Storage và gửi `thumbnail_url` (URL của ảnh đã tải lên) cùng với thông tin người nhận (`recipients`) và hiệu ứng (`overlays`) đến endpoint này.
    *   Toàn bộ backend API, bao gồm cả endpoint `/api/v1/moments` mới và tất cả các endpoint gốc khác (ví dụ: `/api/auth/*`, `/api/users/*`, `/api/friends/*`, `/api/photos/*` cũ), hiện đang ở trạng thái **placeholder**. Chúng chỉ trả về dữ liệu giả lập (mock data) và **không có tương tác cơ sở dữ liệu hoặc dịch vụ thực tế**. Người dùng cần tự hoàn thiện phần backend này để ứng dụng hoạt động đầy đủ.
3.  **Chuyển đổi Frontend sang Expo:** Quy trình phát triển frontend đã được chuyển đổi để sử dụng Expo và Expo Development Client.

Do đó, một số phần trong tài liệu này có thể không còn chính xác hoặc đã lỗi thời. Vui lòng tham khảo `README.md` và `SRS_Locket_Clone_v1.1.md` để có thông tin cập nhật nhất về trạng thái hiện tại của dự án.

---
# Thiết kế Backend cho Ứng dụng Locket Clone

## 1. Tổng quan Kiến trúc Backend

Backend của ứng dụng Locket Clone được xây dựng trên nền tảng Node.js với Express và TypeScript, cung cấp một API RESTful và WebSocket cho ứng dụng di động. Kiến trúc được thiết kế theo mô hình phân lớp, đảm bảo tính mô-đun, dễ bảo trì và mở rộng.

## 2. Cấu trúc Dự án Backend

```
/backend
|-- /src
|   |-- /config                 # Cấu hình ứng dụng
|   |   |-- app.config.ts       # Cấu hình chung
|   |   |-- database.config.ts  # Cấu hình cơ sở dữ liệu
|   |   |-- firebase.config.ts  # Cấu hình Firebase
|   |   |-- mail.config.ts      # Cấu hình Nodemailer
|   |   |-- socket.config.ts    # Cấu hình WebSocket
|   |
|   |-- /controllers            # Xử lý logic nghiệp vụ
|   |   |-- auth.controller.ts
|   |   |-- user.controller.ts
|   |   |-- friend.controller.ts
|   |   |-- photo.controller.ts
|   |   |-- device.controller.ts
|   |   |-- notification.controller.ts
|   |
|   |-- /middlewares            # Middleware
|   |   |-- auth.middleware.ts  # Xác thực JWT
|   |   |-- error.middleware.ts # Xử lý lỗi
|   |   |-- upload.middleware.ts # Xử lý tải lên ảnh
|   |   |-- validation.middleware.ts # Xác thực đầu vào
|   |
|   |-- /models                 # Định nghĩa model
|   |   |-- user.model.ts
|   |   |-- friend.model.ts
|   |   |-- photo.model.ts
|   |   |-- photo-recipient.model.ts
|   |   |-- device.model.ts
|   |   |-- notification.model.ts
|   |   |-- user-setting.model.ts
|   |
|   |-- /repositories           # Tương tác với cơ sở dữ liệu
|   |   |-- user.repository.ts
|   |   |-- friend.repository.ts
|   |   |-- photo.repository.ts
|   |   |-- device.repository.ts
|   |   |-- notification.repository.ts
|   |
|   |-- /routes                 # Định nghĩa API routes
|   |   |-- auth.routes.ts
|   |   |-- user.routes.ts
|   |   |-- friend.routes.ts
|   |   |-- photo.routes.ts
|   |   |-- device.routes.ts
|   |   |-- notification.routes.ts
|   |   |-- index.ts            # Tổng hợp tất cả routes
|   |
|   |-- /services               # Logic nghiệp vụ
|   |   |-- auth.service.ts
|   |   |-- user.service.ts
|   |   |-- friend.service.ts
|   |   |-- photo.service.ts
|   |   |-- device.service.ts
|   |   |-- notification.service.ts
|   |   |-- mail.service.ts
|   |   |-- firebase.service.ts
|   |
|   |-- /sockets                # Xử lý WebSocket
|   |   |-- socket.handler.ts
|   |   |-- photo.socket.ts
|   |   |-- friend.socket.ts
|   |
|   |-- /types                  # Định nghĩa TypeScript types
|   |   |-- express.d.ts        # Mở rộng Express Request
|   |   |-- models.d.ts         # Định nghĩa interface cho models
|   |   |-- dto.d.ts            # Data Transfer Objects
|   |
|   |-- /utils                  # Tiện ích
|   |   |-- logger.ts
|   |   |-- error-handler.ts
|   |   |-- jwt.ts
|   |   |-- validators.ts
|   |
|   |-- app.ts                  # Khởi tạo ứng dụng Express
|   |-- server.ts               # Điểm khởi chạy ứng dụng
|
|-- /tests                      # Unit và integration tests
|   |-- /unit
|   |-- /integration
|
|-- /dist                       # Mã đã biên dịch
|-- .env                        # Biến môi trường
|-- .env.example                # Mẫu biến môi trường
|-- package.json                # Cấu hình npm
|-- tsconfig.json               # Cấu hình TypeScript
|-- jest.config.js              # Cấu hình Jest
|-- .eslintrc.js                # Cấu hình ESLint
|-- .prettierrc                 # Cấu hình Prettier
|-- Dockerfile                  # Cấu hình Docker
|-- docker-compose.yml          # Cấu hình Docker Compose
|-- README.md                   # Tài liệu dự án
```

## 3. Công nghệ và Thư viện

### 3.1 Công nghệ Chính

- **Node.js**: Môi trường runtime JavaScript
- **Express**: Framework web cho Node.js
- **TypeScript**: Ngôn ngữ lập trình tĩnh
- **MySQL**: Hệ quản trị cơ sở dữ liệu quan hệ
- **WebSocket**: Giao thức truyền thông hai chiều theo thời gian thực
- **Firebase**: Dịch vụ đám mây cho lưu trữ và thông báo

### 3.2 Thư viện và Công cụ

- **TypeORM/Sequelize**: ORM cho MySQL
- **Socket.io**: Thư viện WebSocket
- **JWT**: Xác thực và phân quyền
- **Nodemailer**: Gửi email
- **Firebase Admin SDK**: Tương tác với Firebase
- **Multer**: Xử lý tải lên tệp
- **Sharp**: Xử lý ảnh
- **Winston**: Ghi log
- **Jest**: Testing framework
- **Supertest**: Testing HTTP
- **Swagger/OpenAPI**: Tài liệu API
- **Helmet**: Bảo mật HTTP headers
- **Compression**: Nén HTTP
- **CORS**: Cross-Origin Resource Sharing
- **Rate Limiter**: Giới hạn số lượng request
- **PM2**: Process Manager cho Node.js

## 4. Chi tiết Kiến trúc

### 4.1 Mô hình Phân lớp

Kiến trúc backend được tổ chức theo mô hình phân lớp:

1. **Routes Layer**: Định nghĩa API endpoints và xác thực đầu vào
2. **Controllers Layer**: Xử lý request và response
3. **Services Layer**: Chứa logic nghiệp vụ
4. **Repositories Layer**: Tương tác với cơ sở dữ liệu
5. **Models Layer**: Định nghĩa cấu trúc dữ liệu

### 4.2 Luồng Xử lý Request

```
Client Request → Routes → Middlewares → Controllers → Services → Repositories → Database
                                                    ↓
                                                Services → External APIs (Firebase, Email)
```

### 4.3 Xác thực và Phân quyền

- **JWT (JSON Web Token)**: Sử dụng cho xác thực người dùng
- **Middleware Auth**: Kiểm tra token và phân quyền
- **Refresh Token**: Cơ chế làm mới token
- **Xác thực hai yếu tố**: Hỗ trợ 2FA cho bảo mật cao

### 4.4 Xử lý Ảnh

1. **Tải lên**: Sử dụng Multer để xử lý multipart/form-data
2. **Xử lý**: Sử dụng Sharp để tối ưu hóa và thay đổi kích thước ảnh
3. **Lưu trữ**: Tải lên Firebase Storage
4. **URL**: Lưu URL ảnh vào cơ sở dữ liệu

### 4.5 WebSocket

Sử dụng Socket.io để xử lý giao tiếp thời gian thực:

1. **Kết nối**: Xác thực người dùng khi kết nối
2. **Phòng (Rooms)**: Mỗi người dùng tham gia phòng riêng
3. **Sự kiện**: Gửi sự kiện khi có ảnh mới hoặc yêu cầu kết bạn

### 4.6 Thông báo Đẩy

Sử dụng Firebase Cloud Messaging (FCM) để gửi thông báo đẩy:

1. **Đăng ký thiết bị**: Lưu token thiết bị vào cơ sở dữ liệu
2. **Gửi thông báo**: Sử dụng Firebase Admin SDK
3. **Loại thông báo**: Ảnh mới, yêu cầu kết bạn, thông báo hệ thống

### 4.7 Gửi Email

Sử dụng Nodemailer để gửi email:

1. **Đặt lại mật khẩu**: Gửi link đặt lại mật khẩu
2. **Xác thực email**: Gửi email xác thực tài khoản
3. **Thông báo**: Gửi thông báo hệ thống

## 5. API Endpoints

### 5.1 Xác thực

```
POST /api/auth/register         # Đăng ký người dùng mới
POST /api/auth/login            # Đăng nhập
POST /api/auth/refresh          # Làm mới token
POST /api/auth/password/reset   # Yêu cầu đặt lại mật khẩu
PUT /api/auth/password/update   # Cập nhật mật khẩu mới
POST /api/auth/verify           # Xác thực email
```

### 5.2 Quản lý người dùng

```
GET /api/users/me               # Lấy thông tin người dùng hiện tại
PUT /api/users/me               # Cập nhật thông tin người dùng
DELETE /api/users/me            # Xóa tài khoản
GET /api/users/search           # Tìm kiếm người dùng
```

### 5.3 Quản lý bạn bè

```
GET /api/friends                # Lấy danh sách bạn bè
POST /api/friends/request       # Gửi yêu cầu kết bạn
GET /api/friends/requests       # Lấy danh sách yêu cầu kết bạn
PUT /api/friends/:id/accept     # Chấp nhận yêu cầu kết bạn
PUT /api/friends/:id/reject     # Từ chối yêu cầu kết bạn
DELETE /api/friends/:id         # Xóa bạn bè
```

### 5.4 Quản lý ảnh

```
POST /api/photos                # Tạo và gửi ảnh mới
GET /api/photos                 # Lấy lịch sử ảnh đã gửi
GET /api/photos/received        # Lấy ảnh đã nhận
GET /api/photos/latest          # Lấy ảnh mới nhất cho widget
DELETE /api/photos/:id          # Xóa ảnh
```

### 5.5 Quản lý thiết bị

```
POST /api/devices               # Đăng ký thiết bị mới cho FCM
PUT /api/devices/:id            # Cập nhật token thiết bị
DELETE /api/devices/:id         # Xóa thiết bị
```

### 5.6 Quản lý thông báo

```
GET /api/notifications          # Lấy danh sách thông báo
PUT /api/notifications/:id/read # Đánh dấu thông báo đã đọc
DELETE /api/notifications/:id   # Xóa thông báo
```

### 5.7 Cài đặt người dùng

```
GET /api/settings               # Lấy cài đặt người dùng
PUT /api/settings               # Cập nhật cài đặt người dùng
```

## 6. WebSocket Events

### 6.1 Kết nối

```
connection                      # Kết nối mới
disconnect                      # Ngắt kết nối
```

### 6.2 Ảnh

```
photo:new                       # Thông báo có ảnh mới
photo:viewed                    # Thông báo ảnh đã được xem
```

### 6.3 Bạn bè

```
friend:request                  # Thông báo yêu cầu kết bạn mới
friend:accept                   # Thông báo chấp nhận kết bạn
friend:reject                   # Thông báo từ chối kết bạn
```

## 7. Xử lý Lỗi

### 7.1 Cấu trúc Phản hồi Lỗi

```json
{
  "status": "error",
  "code": 400,
  "message": "Invalid input",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 7.2 Mã Lỗi HTTP

- **400 Bad Request**: Lỗi đầu vào
- **401 Unauthorized**: Chưa xác thực
- **403 Forbidden**: Không có quyền
- **404 Not Found**: Không tìm thấy tài nguyên
- **409 Conflict**: Xung đột dữ liệu
- **422 Unprocessable Entity**: Dữ liệu hợp lệ nhưng không thể xử lý
- **500 Internal Server Error**: Lỗi máy chủ

### 7.3 Xử lý Lỗi Toàn cục

Sử dụng middleware để xử lý lỗi toàn cục, đảm bảo phản hồi nhất quán.

## 8. Bảo mật

### 8.1 Bảo vệ API

- **HTTPS**: Tất cả giao tiếp qua HTTPS
- **Helmet**: Bảo vệ HTTP headers
- **CORS**: Cấu hình CORS đúng cách
- **Rate Limiting**: Giới hạn số lượng request
- **Input Validation**: Xác thực đầu vào

### 8.2 Bảo mật Dữ liệu

- **Mã hóa mật khẩu**: Sử dụng bcrypt
- **JWT Secret**: Bảo vệ và thay đổi định kỳ
- **Sanitization**: Làm sạch dữ liệu đầu vào
- **SQL Injection Protection**: Sử dụng ORM và Prepared Statements

### 8.3 Bảo mật Firebase

- **Firebase Security Rules**: Cấu hình quy tắc bảo mật
- **Firebase Admin SDK**: Xác thực máy chủ
- **Mã hóa dữ liệu**: Mã hóa dữ liệu nhạy cảm

## 9. Hiệu suất và Mở rộng

### 9.1 Tối ưu hóa Hiệu suất

- **Compression**: Nén HTTP
- **Caching**: Sử dụng Redis cho caching
- **Connection Pooling**: Tối ưu kết nối cơ sở dữ liệu
- **Pagination**: Phân trang kết quả

### 9.2 Mở rộng

- **Horizontal Scaling**: Triển khai nhiều instance
- **Load Balancing**: Cân bằng tải giữa các instance
- **Microservices**: Tách thành các dịch vụ nhỏ hơn khi cần
- **Database Sharding**: Phân vùng cơ sở dữ liệu

### 9.3 Giám sát và Logging

- **Winston**: Ghi log
- **Prometheus**: Giám sát metrics
- **Grafana**: Trực quan hóa metrics
- **Error Tracking**: Sử dụng Sentry hoặc tương đương

## 10. Triển khai

### 10.1 Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### 10.2 Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - mysql
      - redis
    restart: always

  mysql:
    image: mysql:8.0
    volumes:
      - mysql-data:/var/lib/mysql
    env_file: .env
    ports:
      - "3306:3306"

  redis:
    image: redis:alpine
    volumes:
      - redis-data:/data
    ports:
      - "6379:6379"

volumes:
  mysql-data:
  redis-data:
```

### 10.3 CI/CD

- **GitHub Actions/GitLab CI**: Tự động hóa quy trình CI/CD
- **Testing**: Chạy tests tự động
- **Linting**: Kiểm tra code style
- **Build**: Biên dịch TypeScript
- **Deploy**: Triển khai tự động

## 11. Tài liệu API

Sử dụng Swagger/OpenAPI để tạo tài liệu API tự động:

```typescript
// app.ts
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

## 12. Kết luận

Thiết kế backend này cung cấp một nền tảng vững chắc cho ứng dụng Locket Clone, với kiến trúc phân lớp rõ ràng, bảo mật cao và khả năng mở rộng. Việc sử dụng TypeScript giúp phát triển an toàn hơn với kiểm tra kiểu dữ liệu tĩnh, trong khi Express cung cấp một framework linh hoạt và mạnh mẽ cho API. Tích hợp với Firebase cho lưu trữ ảnh, thông báo đẩy và đồng bộ hóa dữ liệu giúp đơn giản hóa việc triển khai các tính năng phức tạp.
