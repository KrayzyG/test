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
# Tài liệu Thiết kế Chi tiết - Ứng dụng Locket Clone

**Phiên bản:** 1.0  
**Ngày cập nhật:** 23/04/2025  
**Công nghệ sử dụng:** React Native Expo, Node.js, Express, TypeScript, MySQL, Firebase, Nodemailer  

---

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Thiết kế Cơ sở dữ liệu](#2-thiết-kế-cơ-sở-dữ-liệu)
3. [Kiến trúc Backend](#3-kiến-trúc-backend)
4. [Kiến trúc Frontend](#4-kiến-trúc-frontend)
5. [Cấu trúc Dự án](#5-cấu-trúc-dự-án)
6. [Bảo trì và Mở rộng](#6-bảo-trì-và-mở-rộng)
7. [Kết luận](#7-kết-luận)

---

## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu này mô tả thiết kế chi tiết cho ứng dụng Locket Clone, một ứng dụng di động cho phép người dùng chia sẻ ảnh trực tiếp với bạn bè thông qua widget trên màn hình chính của thiết bị di động. Thiết kế này bao gồm cơ sở dữ liệu, backend, frontend, cấu trúc dự án, và chiến lược bảo trì và mở rộng.

### 1.2 Phạm vi

Tài liệu thiết kế này bao gồm:
- Thiết kế cơ sở dữ liệu MySQL
- Kiến trúc backend Node.js Express TypeScript
- Kiến trúc frontend React Native Expo TypeScript
- Cấu trúc dự án tối ưu
- Chiến lược bảo trì và mở rộng

### 1.3 Tổng quan Hệ thống

Locket Clone là một ứng dụng di động cho phép người dùng chia sẻ khoảnh khắc cuộc sống của họ với bạn bè và người thân thông qua các bức ảnh hiển thị trực tiếp trên widget màn hình chính. Hệ thống bao gồm các thành phần chính sau:

1. **Ứng dụng di động (Client)**
   - Phát triển bằng React Native Expo và TypeScript
   - Hỗ trợ iOS và Android
   - Bao gồm widget cho màn hình chính

2. **Backend API**
   - Node.js với Express và TypeScript
   - RESTful API cho CRUD và xác thực
   - WebSocket Server cho thông báo thời gian thực

3. **Cơ sở dữ liệu**
   - MySQL làm RDBMS chính
   - Cấu trúc quan hệ cho dữ liệu người dùng và kết nối
   - Firebase Realtime Database hoặc Firestore cho đồng bộ hóa dữ liệu giữa các thiết bị

4. **Dịch vụ đám mây**
   - **Lưu trữ ảnh**: Firebase Storage
   - **Push notification**: Firebase Cloud Messaging (FCM)
   - **Gửi email**: Nodemailer
   - **Phân tích và giám sát**: Firebase Analytics

---

## 2. Thiết kế Cơ sở dữ liệu

### 2.1 Mô hình Thực thể - Mối quan hệ (ER Diagram)

```
+----------------+       +----------------+       +----------------+
|     users      |       |    friends     |       |     photos     |
+----------------+       +----------------+       +----------------+
| PK id          |<----->| PK id          |       | PK id          |
|    username    |       | FK user_id     |       | FK sender_id   |
|    email       |       | FK friend_id   |       |    image_url   |
|    phone       |       |    status      |       |    caption     |
|    password_hash|       |    created_at  |       |    created_at  |
|    profile_image|       |    updated_at  |       |    deleted_at  |
|    created_at  |       +----------------+       +----------------+
|    updated_at  |                                        |
|    last_login  |                                        |
+----------------+                                        |
        |                                                 |
        |                 +---------------------+         |
        |                 |  photo_recipients   |         |
        |                 +---------------------+         |
        +---------------->| PK id               |<--------+
                          | FK photo_id         |
                          | FK recipient_id     |
                          |    viewed_at        |
                          |    created_at       |
                          +---------------------+
                                    |
+----------------+                  |
|    devices     |                  |
+----------------+                  |
| PK id          |                  |
| FK user_id     |<-----------------+
|    device_token|
|    platform    |
|    created_at  |
|    last_active_at|
+----------------+
```

### 2.2 Chi tiết Bảng

#### 2.2.1 Bảng `users`

Lưu trữ thông tin người dùng của ứng dụng.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | ID duy nhất của người dùng |
| username | VARCHAR(50) | NOT NULL, UNIQUE | Tên người dùng |
| email | VARCHAR(100) | NOT NULL, UNIQUE | Địa chỉ email |
| phone | VARCHAR(20) | UNIQUE | Số điện thoại |
| password_hash | VARCHAR(255) | NOT NULL | Mật khẩu đã được băm |
| profile_image | VARCHAR(255) | | URL ảnh đại diện (lưu trên Firebase Storage) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo tài khoản |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời điểm cập nhật gần nhất |
| last_login | TIMESTAMP | | Thời điểm đăng nhập gần nhất |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Trạng thái hoạt động của tài khoản |
| verification_token | VARCHAR(255) | | Token xác thực email |
| is_verified | BOOLEAN | NOT NULL, DEFAULT FALSE | Trạng thái xác thực email |
| reset_token | VARCHAR(255) | | Token đặt lại mật khẩu |
| reset_token_expires | TIMESTAMP | | Thời điểm hết hạn token đặt lại mật khẩu |

#### 2.2.2 Bảng `friends`

Quản lý mối quan hệ bạn bè giữa người dùng.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | ID duy nhất của mối quan hệ |
| user_id | BIGINT | NOT NULL, FOREIGN KEY | ID của người dùng gửi yêu cầu |
| friend_id | BIGINT | NOT NULL, FOREIGN KEY | ID của người dùng nhận yêu cầu |
| status | ENUM('pending', 'accepted', 'rejected', 'blocked') | NOT NULL, DEFAULT 'pending' | Trạng thái mối quan hệ |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo mối quan hệ |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời điểm cập nhật gần nhất |

#### 2.2.3 Bảng `photos`

Lưu trữ thông tin về ảnh được gửi.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | ID duy nhất của ảnh |
| sender_id | BIGINT | NOT NULL, FOREIGN KEY | ID của người gửi ảnh |
| image_url | VARCHAR(255) | NOT NULL | URL ảnh trên Firebase Storage |
| caption | TEXT | | Chú thích cho ảnh |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo ảnh |
| deleted_at | TIMESTAMP | | Thời điểm xóa ảnh (soft delete) |

#### 2.2.4 Bảng `photo_recipients`

Lưu trữ thông tin về việc nhận ảnh.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | ID duy nhất của bản ghi |
| photo_id | BIGINT | NOT NULL, FOREIGN KEY | ID của ảnh |
| recipient_id | BIGINT | NOT NULL, FOREIGN KEY | ID của người nhận ảnh |
| viewed_at | TIMESTAMP | | Thời điểm xem ảnh |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm gửi ảnh |

#### 2.2.5 Bảng `devices`

Quản lý thiết bị của người dùng cho thông báo đẩy.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | ID duy nhất của thiết bị |
| user_id | BIGINT | NOT NULL, FOREIGN KEY | ID của người dùng sở hữu thiết bị |
| device_token | VARCHAR(255) | NOT NULL | Token thiết bị cho FCM |
| platform | ENUM('ios', 'android') | NOT NULL | Nền tảng của thiết bị |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm đăng ký thiết bị |
| last_active_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời điểm hoạt động gần nhất |

#### 2.2.6 Bảng `notifications`

Lưu trữ thông báo cho người dùng.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | ID duy nhất của thông báo |
| user_id | BIGINT | NOT NULL, FOREIGN KEY | ID của người dùng nhận thông báo |
| type | ENUM('photo', 'friend_request', 'friend_accept', 'system') | NOT NULL | Loại thông báo |
| reference_id | BIGINT | | ID tham chiếu (photo_id, friend_id) |
| content | TEXT | NOT NULL | Nội dung thông báo |
| is_read | BOOLEAN | NOT NULL, DEFAULT FALSE | Trạng thái đã đọc |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo thông báo |

#### 2.2.7 Bảng `user_settings`

Lưu trữ cài đặt của người dùng.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | ID duy nhất của cài đặt |
| user_id | BIGINT | NOT NULL, FOREIGN KEY, UNIQUE | ID của người dùng |
| notification_photo | BOOLEAN | NOT NULL, DEFAULT TRUE | Nhận thông báo khi có ảnh mới |
| notification_friend | BOOLEAN | NOT NULL, DEFAULT TRUE | Nhận thông báo khi có yêu cầu kết bạn |
| notification_system | BOOLEAN | NOT NULL, DEFAULT TRUE | Nhận thông báo hệ thống |
| theme | ENUM('light', 'dark', 'system') | NOT NULL, DEFAULT 'system' | Chủ đề giao diện |
| language | VARCHAR(10) | NOT NULL, DEFAULT 'en' | Ngôn ngữ |
| auto_save_photos | BOOLEAN | NOT NULL, DEFAULT FALSE | Tự động lưu ảnh vào thiết bị |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo cài đặt |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời điểm cập nhật gần nhất |

### 2.3 Chiến lược Mở rộng

#### 2.3.1 Phân vùng (Sharding)

Để đáp ứng yêu cầu mở rộng từ 10,000 lên 1 triệu người dùng (SC1), cơ sở dữ liệu sẽ được thiết kế để hỗ trợ phân vùng theo chiều ngang:

1. **Phân vùng theo user_id**: Dữ liệu người dùng sẽ được phân vùng dựa trên user_id, giúp phân tán tải trên nhiều máy chủ.
2. **Phân vùng theo thời gian**: Dữ liệu ảnh và thông báo có thể được phân vùng theo thời gian, với dữ liệu cũ được chuyển sang lưu trữ lạnh.

#### 2.3.2 Chỉ mục và Tối ưu hóa

1. **Chỉ mục phù hợp**: Tất cả các bảng đều có chỉ mục trên các cột thường xuyên được sử dụng trong truy vấn.
2. **Truy vấn tối ưu**: Thiết kế cơ sở dữ liệu hỗ trợ các truy vấn thường xuyên được sử dụng, như lấy ảnh mới nhất cho widget.
3. **Bộ nhớ đệm**: Sử dụng Redis để lưu trữ dữ liệu thường xuyên truy cập, như thông tin người dùng và ảnh mới nhất.

#### 2.3.3 Sao lưu và Phục hồi

1. **Sao lưu tự động**: Dữ liệu được sao lưu hàng ngày trên Firebase (R2).
2. **Phục hồi nhanh chóng**: Hệ thống có khả năng phục hồi từ sự cố trong vòng 1 giờ (R5).
3. **Dữ liệu được sao lưu trên nhiều máy chủ**: Đảm bảo tính sẵn sàng cao (R4).

### 2.4 Tích hợp với Firebase

#### 2.4.1 Firebase Storage

Lưu trữ ảnh người dùng với cấu trúc thư mục:
```
/users/{user_id}/profile_image.jpg
/photos/{photo_id}.jpg
```

#### 2.4.2 Firebase Cloud Messaging (FCM)

Sử dụng cho thông báo đẩy, với token thiết bị được lưu trong bảng `devices`.

#### 2.4.3 Firebase Realtime Database hoặc Firestore

Sử dụng cho đồng bộ hóa dữ liệu giữa các thiết bị, đặc biệt là cho widget và thông báo thời gian thực.

---

## 3. Kiến trúc Backend

### 3.1 Cấu trúc Dự án Backend

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

### 3.2 Công nghệ và Thư viện

#### 3.2.1 Công nghệ Chính

- **Node.js**: Môi trường runtime JavaScript
- **Express**: Framework web cho Node.js
- **TypeScript**: Ngôn ngữ lập trình tĩnh
- **MySQL**: Hệ quản trị cơ sở dữ liệu quan hệ
- **WebSocket**: Giao thức truyền thông hai chiều theo thời gian thực
- **Firebase**: Dịch vụ đám mây cho lưu trữ và thông báo

#### 3.2.2 Thư viện và Công cụ

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

### 3.3 Mô hình Phân lớp

Kiến trúc backend được tổ chức theo mô hình phân lớp:

1. **Routes Layer**: Định nghĩa API endpoints và xác thực đầu vào
2. **Controllers Layer**: Xử lý request và response
3. **Services Layer**: Chứa logic nghiệp vụ
4. **Repositories Layer**: Tương tác với cơ sở dữ liệu
5. **Models Layer**: Định nghĩa cấu trúc dữ liệu

### 3.4 Luồng Xử lý Request

```
Client Request → Routes → Middlewares → Controllers → Services → Repositories → Database
                                                    ↓
                                                Services → External APIs (Firebase, Email)
```

### 3.5 API Endpoints

#### 3.5.1 Xác thực

```
POST /api/auth/register         # Đăng ký người dùng mới
POST /api/auth/login            # Đăng nhập
POST /api/auth/refresh          # Làm mới token
POST /api/auth/password/reset   # Yêu cầu đặt lại mật khẩu
PUT /api/auth/password/update   # Cập nhật mật khẩu mới
POST /api/auth/verify           # Xác thực email
```

#### 3.5.2 Quản lý người dùng

```
GET /api/users/me               # Lấy thông tin người dùng hiện tại
PUT /api/users/me               # Cập nhật thông tin người dùng
DELETE /api/users/me            # Xóa tài khoản
GET /api/users/search           # Tìm kiếm người dùng
```

#### 3.5.3 Quản lý bạn bè

```
GET /api/friends                # Lấy danh sách bạn bè
POST /api/friends/request       # Gửi yêu cầu kết bạn
GET /api/friends/requests       # Lấy danh sách yêu cầu kết bạn
PUT /api/friends/:id/accept     # Chấp nhận yêu cầu kết bạn
PUT /api/friends/:id/reject     # Từ chối yêu cầu kết bạn
DELETE /api/friends/:id         # Xóa bạn bè
```

#### 3.5.4 Quản lý ảnh

```
POST /api/photos                # Tạo và gửi ảnh mới
GET /api/photos                 # Lấy lịch sử ảnh đã gửi
GET /api/photos/received        # Lấy ảnh đã nhận
GET /api/photos/latest          # Lấy ảnh mới nhất cho widget
DELETE /api/photos/:id          # Xóa ảnh
```

#### 3.5.5 Quản lý thiết bị

```
POST /api/devices               # Đăng ký thiết bị mới cho FCM
PUT /api/devices/:id            # Cập nhật token thiết bị
DELETE /api/devices/:id         # Xóa thiết bị
```

#### 3.5.6 Quản lý thông báo

```
GET /api/notifications          # Lấy danh sách thông báo
PUT /api/notifications/:id/read # Đánh dấu thông báo đã đọc
DELETE /api/notifications/:id   # Xóa thông báo
```

#### 3.5.7 Cài đặt người dùng

```
GET /api/settings               # Lấy cài đặt người dùng
PUT /api/settings               # Cập nhật cài đặt người dùng
```

### 3.6 WebSocket Events

#### 3.6.1 Kết nối

```
connection                      # Kết nối mới
disconnect                      # Ngắt kết nối
```

#### 3.6.2 Ảnh

```
photo:new                       # Thông báo có ảnh mới
photo:viewed                    # Thông báo ảnh đã được xem
```

#### 3.6.3 Bạn bè

```
friend:request                  # Thông báo yêu cầu kết bạn mới
friend:accept                   # Thông báo chấp nhận kết bạn
friend:reject                   # Thông báo từ chối kết bạn
```

### 3.7 Xử lý Lỗi

#### 3.7.1 Cấu trúc Phản hồi Lỗi

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

#### 3.7.2 Mã Lỗi HTTP

- **400 Bad Request**: Lỗi đầu vào
- **401 Unauthorized**: Chưa xác thực
- **403 Forbidden**: Không có quyền
- **404 Not Found**: Không tìm thấy tài nguyên
- **409 Conflict**: Xung đột dữ liệu
- **422 Unprocessable Entity**: Dữ liệu hợp lệ nhưng không thể xử lý
- **500 Internal Server Error**: Lỗi máy chủ

### 3.8 Bảo mật

#### 3.8.1 Bảo vệ API

- **HTTPS**: Tất cả giao tiếp qua HTTPS
- **Helmet**: Bảo vệ HTTP headers
- **CORS**: Cấu hình CORS đúng cách
- **Rate Limiting**: Giới hạn số lượng request
- **Input Validation**: Xác thực đầu vào

#### 3.8.2 Bảo mật Dữ liệu

- **Mã hóa mật khẩu**: Sử dụng bcrypt
- **JWT Secret**: Bảo vệ và thay đổi định kỳ
- **Sanitization**: Làm sạch dữ liệu đầu vào
- **SQL Injection Protection**: Sử dụng ORM và Prepared Statements

#### 3.8.3 Bảo mật Firebase

- **Firebase Security Rules**: Cấu hình quy tắc bảo mật
- **Firebase Admin SDK**: Xác thực máy chủ
- **Mã hóa dữ liệu**: Mã hóa dữ liệu nhạy cảm

---

## 4. Kiến trúc Frontend

### 4.1 Cấu trúc Dự án Frontend

```
/frontend
|-- /app                      # Cấu trúc ứng dụng theo Expo Router
|   |-- _layout.tsx           # Layout chính của ứng dụng
|   |-- index.tsx             # Màn hình chính
|   |-- /auth
|   |   |-- login.tsx         # Màn hình đăng nhập
|   |   |-- register.tsx      # Màn hình đăng ký
|   |   |-- forgot-password.tsx # Màn hình quên mật khẩu
|   |
|   |-- /camera
|   |   |-- index.tsx         # Màn hình chụp ảnh
|   |   |-- edit.tsx          # Màn hình chỉnh sửa ảnh
|   |   |-- share.tsx         # Màn hình chia sẻ ảnh
|   |
|   |-- /friends
|   |   |-- index.tsx         # Danh sách bạn bè
|   |   |-- requests.tsx      # Yêu cầu kết bạn
|   |   |-- add.tsx           # Thêm bạn mới
|   |   |-- qr.tsx            # Mã QR cá nhân
|   |
|   |-- /history
|   |   |-- index.tsx         # Lịch sử ảnh
|   |   |-- [id].tsx          # Chi tiết ảnh
|   |
|   |-- /settings
|   |   |-- index.tsx         # Cài đặt chung
|   |   |-- account.tsx       # Cài đặt tài khoản
|   |   |-- notifications.tsx # Cài đặt thông báo
|   |   |-- privacy.tsx       # Cài đặt quyền riêng tư
|   |   |-- help.tsx          # Trợ giúp và hỗ trợ
|
|-- /src
|   |-- /components           # Components tái sử dụng
|   |   |-- /ui               # UI components cơ bản
|   |   |   |-- Button.tsx
|   |   |   |-- Input.tsx
|   |   |   |-- Card.tsx
|   |   |   |-- Avatar.tsx
|   |   |   |-- ...
|   |   |
|   |   |-- /auth             # Components liên quan đến xác thực
|   |   |-- /camera           # Components liên quan đến camera
|   |   |-- /friends          # Components liên quan đến bạn bè
|   |   |-- /photos           # Components liên quan đến ảnh
|   |   |-- /widgets          # Components cho widget
|   |
|   |-- /hooks                # Custom hooks
|   |   |-- useAuth.ts
|   |   |-- useCamera.ts
|   |   |-- useFriends.ts
|   |   |-- usePhotos.ts
|   |   |-- useNotifications.ts
|   |
|   |-- /services             # Dịch vụ API và tích hợp
|   |   |-- api.service.ts    # Cấu hình Axios
|   |   |-- auth.service.ts
|   |   |-- user.service.ts
|   |   |-- friend.service.ts
|   |   |-- photo.service.ts
|   |   |-- notification.service.ts
|   |   |-- socket.service.ts # WebSocket
|   |
|   |-- /store                # State management
|   |   |-- index.ts          # Cấu hình store
|   |   |-- /slices
|   |   |   |-- auth.slice.ts
|   |   |   |-- user.slice.ts
|   |   |   |-- friend.slice.ts
|   |   |   |-- photo.slice.ts
|   |   |   |-- notification.slice.ts
|   |
|   |-- /utils                # Tiện ích
|   |   |-- storage.ts        # AsyncStorage helpers
|   |   |-- validation.ts     # Form validation
|   |   |-- date.ts           # Xử lý ngày tháng
|   |   |-- permissions.ts    # Xử lý quyền
|   |   |-- image.ts          # Xử lý ảnh
|   |
|   |-- /types                # TypeScript types
|   |   |-- api.types.ts      # Types cho API responses
|   |   |-- navigation.types.ts # Types cho navigation
|   |   |-- models.types.ts   # Types cho models
|   |
|   |-- /constants            # Hằng số
|   |   |-- colors.ts
|   |   |-- theme.ts
|   |   |-- config.ts
|   |   |-- routes.ts
|   |
|   |-- /localization         # Đa ngôn ngữ
|   |   |-- i18n.ts
|   |   |-- /translations
|   |   |   |-- en.json
|   |   |   |-- vi.json
|   |
|   |-- /widgets              # Widget cho màn hình chính
|   |   |-- PhotoWidget.tsx   # Widget hiển thị ảnh
|
|-- /assets                   # Tài nguyên tĩnh
|   |-- /images
|   |-- /fonts
|   |-- /animations
|
|-- /modules                  # Native modules
|   |-- /widget               # Native code cho widget
|   |   |-- /ios
|   |   |-- /android
|
|-- app.json                  # Cấu hình Expo
|-- tsconfig.json             # Cấu hình TypeScript
|-- babel.config.js           # Cấu hình Babel
|-- metro.config.js           # Cấu hình Metro bundler
|-- eas.json                  # Cấu hình EAS (Expo Application Services)
|-- package.json              # Cấu hình npm
|-- .env.example              # Mẫu biến môi trường
|-- README.md                 # Tài liệu frontend
```

### 4.2 Công nghệ và Thư viện

#### 4.2.1 Công nghệ Chính

- **React Native**: Framework xây dựng ứng dụng di động đa nền tảng
- **Expo**: Nền tảng phát triển React Native
- **TypeScript**: Ngôn ngữ lập trình tĩnh
- **Expo Router**: Điều hướng dựa trên file system

#### 4.2.2 Thư viện và Công cụ

- **State Management**:
  - Redux Toolkit: Quản lý state toàn cục
  - React Query: Quản lý state server và caching

- **UI/UX**:
  - React Native Paper: UI components
  - React Native Reanimated: Animations
  - React Native Gesture Handler: Gesture handling
  - React Native SVG: SVG support
  - Expo Linear Gradient: Gradient effects

- **Navigation**:
  - Expo Router: File-based routing

- **Camera & Image**:
  - Expo Camera: Camera access
  - Expo Image Picker: Image selection
  - Expo Image Manipulator: Image editing
  - Expo MediaLibrary: Media access

- **Storage & Data**:
  - AsyncStorage: Local storage
  - Expo FileSystem: File management
  - Expo SecureStore: Secure storage

- **Networking**:
  - Axios: HTTP client
  - Socket.io Client: WebSocket

- **Authentication**:
  - Expo Auth Session: OAuth
  - Expo Local Authentication: Biometric auth

- **Notifications**:
  - Expo Notifications: Push notifications
  - Firebase Cloud Messaging: Push notifications

- **Localization**:
  - i18n-js: Internationalization

- **Forms**:
  - React Hook Form: Form handling
  - Yup: Form validation

- **Testing**:
  - Jest: Testing framework
  - React Native Testing Library: Component testing

- **Development**:
  - Expo Dev Client: Custom development client
  - Flipper: Debugging
  - React Native Debugger: Debugging

### 4.3 Mô hình Component

Ứng dụng sử dụng mô hình component-based với các loại component:

1. **UI Components**: Components cơ bản như Button, Input, Card
2. **Container Components**: Components chứa logic và state
3. **Screen Components**: Components đại diện cho màn hình
4. **HOCs (Higher-Order Components)**: Components bọc các components khác
5. **Compound Components**: Components phức tạp với nhiều thành phần con

### 4.4 State Management

Kết hợp nhiều phương pháp quản lý state:

1. **Local State**: useState, useReducer cho state cục bộ
2. **Global State**: Redux Toolkit cho state toàn cục
3. **Server State**: React Query cho state từ server
4. **Form State**: React Hook Form cho state form
5. **Persistent State**: AsyncStorage, SecureStore cho state lưu trữ

### 4.5 Màn hình Chính

#### 4.5.1 Màn hình Đăng nhập/Đăng ký

- **Đăng nhập**: Email/số điện thoại + mật khẩu
- **Đăng ký**: Email, số điện thoại, thông tin cá nhân
- **Đăng nhập mạng xã hội**: Google, Facebook, Apple
- **Quên mật khẩu**: Đặt lại mật khẩu qua email

#### 4.5.2 Màn hình Chính

- **Hiển thị ảnh mới nhất**: Ảnh từ bạn bè
- **Nút chụp ảnh**: Truy cập nhanh camera
- **Thông báo**: Hiển thị thông báo mới
- **Điều hướng**: Truy cập các màn hình khác

#### 4.5.3 Màn hình Camera

- **Chụp ảnh**: Chụp ảnh trực tiếp
- **Chỉnh sửa**: Áp dụng filter, sticker
- **Chia sẻ**: Chọn bạn bè để gửi ảnh
- **Xem trước**: Xem trước ảnh trước khi gửi

#### 4.5.4 Màn hình Bạn bè

- **Danh sách bạn bè**: Hiển thị bạn bè hiện tại
- **Tìm kiếm**: Tìm kiếm bạn bè
- **Thêm bạn**: Thêm bạn qua email, số điện thoại
- **Mã QR**: Tạo và quét mã QR
- **Yêu cầu kết bạn**: Quản lý yêu cầu kết bạn

#### 4.5.5 Màn hình Lịch sử

- **Lưới ảnh**: Hiển thị ảnh đã gửi và nhận
- **Bộ lọc**: Lọc theo người gửi/nhận
- **Chi tiết**: Xem chi tiết ảnh
- **Lưu**: Lưu ảnh vào thiết bị

#### 4.5.6 Màn hình Cài đặt

- **Tài khoản**: Quản lý thông tin cá nhân
- **Thông báo**: Cài đặt thông báo
- **Quyền riêng tư**: Cài đặt quyền riêng tư
- **Giao diện**: Chủ đề, ngôn ngữ
- **Trợ giúp**: Hỗ trợ và phản hồi

### 4.6 Widget

#### 4.6.1 Thiết kế Widget

- **iOS**: WidgetKit, SwiftUI
- **Android**: App Widget, RemoteViews

#### 4.6.2 Cập nhật Widget

- **Background Fetch**: Cập nhật định kỳ
- **Push Notification**: Cập nhật khi có thông báo
- **App Communication**: Cập nhật từ ứng dụng

#### 4.6.3 Tương tác Widget

- **Tap Action**: Mở ứng dụng
- **Deep Link**: Mở màn hình cụ thể

### 4.7 Thông báo Đẩy

- **Đăng ký**: Đăng ký thiết bị với FCM
- **Xử lý**: Xử lý thông báo đẩy
- **Foreground/Background**: Xử lý thông báo khi ứng dụng ở foreground/background
- **Deep Linking**: Mở màn hình cụ thể từ thông báo

---

## 5. Cấu trúc Dự án

### 5.1 Tổng quan Cấu trúc Dự án

Dự án Locket Clone được tổ chức theo mô hình monorepo, cho phép quản lý cả frontend và backend trong một kho mã nguồn duy nhất. Cấu trúc này tạo điều kiện thuận lợi cho việc phát triển, kiểm thử và triển khai đồng bộ, đồng thời duy trì sự tách biệt rõ ràng giữa các thành phần.

```
/locket-clone
|-- /packages
|   |-- /backend                # Backend Node.js Express TypeScript
|   |-- /frontend               # Frontend React Native Expo TypeScript
|   |-- /common                 # Mã dùng chung (types, utils, constants)
|   |-- /database               # Scripts và migrations cho cơ sở dữ liệu
|
|-- /docs                       # Tài liệu dự án
|   |-- /api                    # Tài liệu API
|   |-- /database               # Tài liệu cơ sở dữ liệu
|   |-- /architecture           # Tài liệu kiến trúc
|   |-- /deployment             # Hướng dẫn triển khai
|
|-- /scripts                    # Scripts tiện ích
|   |-- setup.sh                # Script cài đặt môi trường
|   |-- dev.sh                  # Script chạy môi trường phát triển
|   |-- build.sh                # Script build dự án
|   |-- deploy.sh               # Script triển khai
|
|-- /config                     # Cấu hình chung
|   |-- .eslintrc.js            # Cấu hình ESLint
|   |-- .prettierrc             # Cấu hình Prettier
|   |-- tsconfig.base.json      # Cấu hình TypeScript cơ sở
|
|-- docker-compose.yml          # Cấu hình Docker Compose
|-- package.json                # Cấu hình npm cho monorepo
|-- lerna.json                  # Cấu hình Lerna
|-- README.md                   # Tài liệu chính
|-- .gitignore                  # Cấu hình Git ignore
|-- .env.example                # Mẫu biến môi trường
```

### 5.2 Quản lý Monorepo

#### 5.2.1 Lerna

```json
// lerna.json
{
  "version": "independent",
  "npmClient": "yarn",
  "useWorkspaces": true,
  "packages": ["packages/*"],
  "command": {
    "publish": {
      "conventionalCommits": true,
      "message": "chore(release): publish"
    }
  }
}
```

#### 5.2.2 Workspaces

```json
// package.json
{
  "name": "locket-clone",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "start": "lerna run start --stream",
    "dev": "lerna run dev --stream",
    "build": "lerna run build --stream",
    "test": "lerna run test --stream",
    "lint": "lerna run lint --stream",
    "format": "lerna run format --stream",
    "clean": "lerna clean",
    "bootstrap": "lerna bootstrap",
    "db:migrate": "cd packages/database && npm run migrate",
    "db:seed": "cd packages/database && npm run seed"
  },
  "devDependencies": {
    "lerna": "^6.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0",
    "prettier": "^2.8.0",
    "eslint": "^8.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 5.3 Môi trường Phát triển

#### 5.3.1 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: locket-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - locket-network

  redis:
    image: redis:alpine
    container_name: locket-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - locket-network

  backend:
    build:
      context: ./packages/backend
      dockerfile: Dockerfile.dev
    container_name: locket-backend
    depends_on:
      - mysql
      - redis
    environment:
      - NODE_ENV=development
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=${MYSQL_USER}
      - DB_PASSWORD=${MYSQL_PASSWORD}
      - DB_NAME=${MYSQL_DATABASE}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    ports:
      - "3000:3000"
    volumes:
      - ./packages/backend:/app
      - /app/node_modules
    networks:
      - locket-network
    command: npm run dev

networks:
  locket-network:
    driver: bridge

volumes:
  mysql-data:
  redis-data:
```

### 5.4 Quy trình CI/CD

#### 5.4.1 GitHub Actions CI

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      - run: yarn install
      - run: yarn lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      - run: yarn install
      - run: yarn test

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      - run: yarn install
      - run: yarn build
```

### 5.5 Quy trình Phát triển

#### 5.5.1 Git Flow

```
main        : Phiên bản production
develop     : Phiên bản phát triển
feature/*   : Tính năng mới
bugfix/*    : Sửa lỗi
release/*   : Chuẩn bị phát hành
hotfix/*    : Sửa lỗi khẩn cấp
```

#### 5.5.2 Quy ước Commit

```
feat: Tính năng mới
fix: Sửa lỗi
docs: Tài liệu
style: Định dạng (không ảnh hưởng đến mã)
refactor: Tái cấu trúc mã
test: Thêm hoặc sửa tests
chore: Công việc bảo trì
```

---

## 6. Bảo trì và Mở rộng

### 6.1 Chiến lược Mở rộng Cơ sở dữ liệu

#### 6.1.1 Phân vùng (Sharding)

Để đáp ứng yêu cầu mở rộng từ 10,000 lên 1 triệu người dùng (SC1), cơ sở dữ liệu MySQL sẽ được phân vùng như sau:

- **Phân vùng theo User ID**: Dữ liệu người dùng sẽ được phân vùng dựa trên user_id, giúp phân tán tải trên nhiều máy chủ.
- **Phân vùng theo Thời gian**: Dữ liệu ảnh và thông báo có thể được phân vùng theo thời gian, với dữ liệu cũ được chuyển sang lưu trữ lạnh.

#### 6.1.2 Replica và Cân bằng tải

- **Master-Slave Replication**: Một master DB cho write operations và nhiều slave DBs cho read operations.
- **Connection Pooling**: Sử dụng connection pool để tối ưu hóa kết nối đến cơ sở dữ liệu.

#### 6.1.3 Caching với Redis

- **Cache-Aside Pattern**: Lưu trữ dữ liệu thường xuyên truy cập trong Redis.
- **Invalidation Strategy**: Vô hiệu hóa cache khi dữ liệu thay đổi.

### 6.2 Chiến lược Mở rộng Backend

#### 6.2.1 Kiến trúc Microservices

Khi ứng dụng phát triển, có thể chuyển từ monolith sang microservices:

```
                  ┌─────────────────┐
                  │   API Gateway   │
                  └─────────────────┘
                          │
        ┌────────────┬────┴────┬────────────┬────────────┐
        │            │         │            │            │
┌───────▼──────┐ ┌───▼───┐ ┌───▼───┐ ┌──────▼─────┐ ┌────▼────┐
│ Auth Service │ │ Users │ │Photos │ │Notification│ │ Friends │
└──────────────┘ └───────┘ └───────┘ └────────────┘ └─────────┘
        │            │         │            │            │
        └────────────┴────┬────┴────────────┴────────────┘
                          │
                  ┌───────▼───────┐
                  │ Message Broker│
                  └───────────────┘
```

#### 6.2.2 Horizontal Scaling với Kubernetes

- **Deployment**: Triển khai nhiều instances của backend service.
- **Service**: Cân bằng tải giữa các instances.
- **HPA (Horizontal Pod Autoscaler)**: Tự động mở rộng dựa trên tải.

#### 6.2.3 Rate Limiting và Circuit Breaker

- **Rate Limiting**: Giới hạn số lượng request từ một IP hoặc user.
- **Circuit Breaker**: Ngăn chặn cascading failures khi gọi đến các dịch vụ bên ngoài.

### 6.3 Chiến lược Mở rộng Frontend

#### 6.3.1 Code Splitting và Lazy Loading

- **Dynamic Imports**: Tải component khi cần.
- **Suspense**: Hiển thị fallback khi loading.

#### 6.3.2 Tối ưu hóa Hiệu suất

- **Memo**: Tránh render không cần thiết.
- **useCallback/useMemo**: Tối ưu hóa hàm và giá trị.
- **VirtualizedList**: Hiển thị danh sách dài.

#### 6.3.3 Offline Support

- **Lưu trữ offline**: Lưu dữ liệu cục bộ khi không có kết nối.
- **Đồng bộ hóa**: Đồng bộ dữ liệu khi có kết nối.
- **Optimistic UI**: Cập nhật UI ngay lập tức, đồng bộ sau.

### 6.4 Chiến lược Bảo trì

#### 6.4.1 Monitoring và Logging

- **Logging**: Sử dụng Winston để ghi log.
- **Monitoring**: Sử dụng Prometheus và Grafana để giám sát.

#### 6.4.2 Automated Testing

- **Unit Testing**: Kiểm thử các hàm và components.
- **Integration Testing**: Kiểm thử API và luồng dữ liệu.
- **E2E Testing**: Kiểm thử luồng người dùng.

#### 6.4.3 Continuous Integration và Deployment

- **CI**: Tự động kiểm tra code khi có thay đổi.
- **CD**: Tự động triển khai khi tests pass.
- **Canary Deployments**: Triển khai dần dần để giảm thiểu rủi ro.

#### 6.4.4 Feature Flags

- **Feature Toggles**: Bật/tắt tính năng mới mà không cần deploy lại.
- **A/B Testing**: Thử nghiệm tính năng mới với một nhóm người dùng.

### 6.5 Chiến lược Bảo mật

#### 6.5.1 Bảo mật API

- **JWT Security**: Sử dụng JWT cho xác thực.
- **API Security Headers**: Sử dụng Helmet để bảo vệ HTTP headers.

#### 6.5.2 Bảo mật Dữ liệu

- **Mã hóa Dữ liệu Nhạy cảm**: Sử dụng mã hóa cho dữ liệu nhạy cảm.
- **Bảo vệ Dữ liệu Người dùng**: Loại bỏ dữ liệu nhạy cảm từ response.

#### 6.5.3 Bảo mật Firebase

- **Firebase Security Rules**: Cấu hình quy tắc bảo mật cho Firebase Storage.
- **Firebase Admin SDK**: Sử dụng Admin SDK cho xác thực máy chủ.

---

## 7. Kết luận

Tài liệu thiết kế chi tiết này đã cung cấp một cái nhìn toàn diện về ứng dụng Locket Clone, bao gồm thiết kế cơ sở dữ liệu, kiến trúc backend và frontend, cấu trúc dự án, và chiến lược bảo trì và mở rộng. Thiết kế này đáp ứng đầy đủ các yêu cầu đã đề ra trong SRS, đồng thời đảm bảo tính mở rộng, hiệu suất cao và dễ bảo trì.

Các điểm nổi bật của thiết kế bao gồm:

1. **Cơ sở dữ liệu**: Thiết kế cơ sở dữ liệu MySQL với các bảng và mối quan hệ rõ ràng, hỗ trợ phân vùng và mở rộng.
2. **Backend**: Kiến trúc Node.js Express TypeScript với mô hình phân lớp rõ ràng, API RESTful và WebSocket cho thông báo thời gian thực.
3. **Frontend**: Kiến trúc React Native Expo TypeScript với mô hình component-based, state management hiệu quả và tích hợp với native widgets.
4. **Cấu trúc dự án**: Mô hình monorepo với Lerna và Yarn Workspaces, giúp quản lý hiệu quả cả frontend và backend trong một kho mã nguồn duy nhất.
5. **Bảo trì và mở rộng**: Chiến lược mở rộng cơ sở dữ liệu, backend và frontend, cùng với các phương pháp bảo trì như monitoring, logging, automated testing và CI/CD.

Việc áp dụng thiết kế này sẽ giúp ứng dụng Locket Clone đáp ứng các yêu cầu phi chức năng đã đề ra trong SRS, bao gồm hiệu suất (P1-P5), bảo mật (S1-S5), độ tin cậy (R1-R5), và khả năng mở rộng (SC1-SC4).

[end of Tài liệu Thiết kế Chi tiết - Ứng dụng Locket Clone.md]
