# Thiết kế Cơ sở dữ liệu cho Ứng dụng Locket Clone

## 1. Tổng quan

Thiết kế cơ sở dữ liệu cho ứng dụng Locket Clone sử dụng MySQL làm hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) chính, kết hợp với Firebase cho lưu trữ ảnh và thông báo đẩy. Thiết kế này đảm bảo tính mở rộng, hiệu suất cao và dễ bảo trì.

## 2. Mô hình Thực thể - Mối quan hệ (ER Diagram)

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

## 3. Chi tiết Bảng

### 3.1 Bảng `users`

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

**Chỉ mục:**
- PRIMARY KEY (id)
- UNIQUE INDEX (email)
- UNIQUE INDEX (phone)
- UNIQUE INDEX (username)

### 3.2 Bảng `friends`

Quản lý mối quan hệ bạn bè giữa người dùng.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | ID duy nhất của mối quan hệ |
| user_id | BIGINT | NOT NULL, FOREIGN KEY | ID của người dùng gửi yêu cầu |
| friend_id | BIGINT | NOT NULL, FOREIGN KEY | ID của người dùng nhận yêu cầu |
| status | ENUM('pending', 'accepted', 'rejected', 'blocked') | NOT NULL, DEFAULT 'pending' | Trạng thái mối quan hệ |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo mối quan hệ |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời điểm cập nhật gần nhất |

**Chỉ mục:**
- PRIMARY KEY (id)
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
- UNIQUE INDEX (user_id, friend_id)
- INDEX (status)

### 3.3 Bảng `photos`

Lưu trữ thông tin về ảnh được gửi.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | ID duy nhất của ảnh |
| sender_id | BIGINT | NOT NULL, FOREIGN KEY | ID của người gửi ảnh |
| image_url | VARCHAR(255) | NOT NULL | URL ảnh trên Firebase Storage |
| caption | TEXT | | Chú thích cho ảnh |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo ảnh |
| deleted_at | TIMESTAMP | | Thời điểm xóa ảnh (soft delete) |

**Chỉ mục:**
- PRIMARY KEY (id)
- FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
- INDEX (created_at)
- INDEX (deleted_at)

### 3.4 Bảng `photo_recipients`

Lưu trữ thông tin về việc nhận ảnh.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | ID duy nhất của bản ghi |
| photo_id | BIGINT | NOT NULL, FOREIGN KEY | ID của ảnh |
| recipient_id | BIGINT | NOT NULL, FOREIGN KEY | ID của người nhận ảnh |
| viewed_at | TIMESTAMP | | Thời điểm xem ảnh |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm gửi ảnh |

**Chỉ mục:**
- PRIMARY KEY (id)
- FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
- FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
- UNIQUE INDEX (photo_id, recipient_id)
- INDEX (viewed_at)

### 3.5 Bảng `devices`

Quản lý thiết bị của người dùng cho thông báo đẩy.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | ID duy nhất của thiết bị |
| user_id | BIGINT | NOT NULL, FOREIGN KEY | ID của người dùng sở hữu thiết bị |
| device_token | VARCHAR(255) | NOT NULL | Token thiết bị cho FCM |
| platform | ENUM('ios', 'android') | NOT NULL | Nền tảng của thiết bị |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm đăng ký thiết bị |
| last_active_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời điểm hoạt động gần nhất |

**Chỉ mục:**
- PRIMARY KEY (id)
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
- UNIQUE INDEX (device_token)
- INDEX (platform)
- INDEX (last_active_at)

### 3.6 Bảng `notifications`

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

**Chỉ mục:**
- PRIMARY KEY (id)
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
- INDEX (type)
- INDEX (is_read)
- INDEX (created_at)

### 3.7 Bảng `user_settings`

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

**Chỉ mục:**
- PRIMARY KEY (id)
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
- UNIQUE INDEX (user_id)

## 4. Mối quan hệ

1. **users - friends**: Mối quan hệ nhiều-nhiều giữa người dùng thông qua bảng `friends`.
2. **users - photos**: Mối quan hệ một-nhiều, một người dùng có thể gửi nhiều ảnh.
3. **photos - photo_recipients**: Mối quan hệ một-nhiều, một ảnh có thể được gửi đến nhiều người nhận.
4. **users - photo_recipients**: Mối quan hệ một-nhiều, một người dùng có thể nhận nhiều ảnh.
5. **users - devices**: Mối quan hệ một-nhiều, một người dùng có thể có nhiều thiết bị.
6. **users - notifications**: Mối quan hệ một-nhiều, một người dùng có thể có nhiều thông báo.
7. **users - user_settings**: Mối quan hệ một-một, mỗi người dùng có một bản ghi cài đặt.

## 5. Chiến lược Mở rộng

### 5.1 Phân vùng (Sharding)

Để đáp ứng yêu cầu mở rộng từ 10,000 lên 1 triệu người dùng (SC1), cơ sở dữ liệu sẽ được thiết kế để hỗ trợ phân vùng theo chiều ngang:

1. **Phân vùng theo user_id**: Dữ liệu người dùng sẽ được phân vùng dựa trên user_id, giúp phân tán tải trên nhiều máy chủ.
2. **Phân vùng theo thời gian**: Dữ liệu ảnh và thông báo có thể được phân vùng theo thời gian, với dữ liệu cũ được chuyển sang lưu trữ lạnh.

### 5.2 Chỉ mục và Tối ưu hóa

1. **Chỉ mục phù hợp**: Tất cả các bảng đều có chỉ mục trên các cột thường xuyên được sử dụng trong truy vấn.
2. **Truy vấn tối ưu**: Thiết kế cơ sở dữ liệu hỗ trợ các truy vấn thường xuyên được sử dụng, như lấy ảnh mới nhất cho widget.
3. **Bộ nhớ đệm**: Sử dụng Redis để lưu trữ dữ liệu thường xuyên truy cập, như thông tin người dùng và ảnh mới nhất.

### 5.3 Sao lưu và Phục hồi

1. **Sao lưu tự động**: Dữ liệu được sao lưu hàng ngày trên Firebase (R2).
2. **Phục hồi nhanh chóng**: Hệ thống có khả năng phục hồi từ sự cố trong vòng 1 giờ (R5).
3. **Dữ liệu được sao lưu trên nhiều máy chủ**: Đảm bảo tính sẵn sàng cao (R4).

## 6. Tích hợp với Firebase

### 6.1 Firebase Storage

Lưu trữ ảnh người dùng với cấu trúc thư mục:
```
/users/{user_id}/profile_image.jpg
/photos/{photo_id}.jpg
```

### 6.2 Firebase Cloud Messaging (FCM)

Sử dụng cho thông báo đẩy, với token thiết bị được lưu trong bảng `devices`.

### 6.3 Firebase Realtime Database hoặc Firestore

Sử dụng cho đồng bộ hóa dữ liệu giữa các thiết bị, đặc biệt là cho widget và thông báo thời gian thực.

## 7. Chiến lược Bảo mật Dữ liệu

1. **Mã hóa dữ liệu**: Mật khẩu được băm, dữ liệu nhạy cảm được mã hóa.
2. **Xác thực và Phân quyền**: Sử dụng JWT với thời gian hết hạn 30 ngày (S3).
3. **Bảo vệ khỏi SQL Injection**: Sử dụng Prepared Statements và ORM.
4. **Mã hóa dữ liệu trên Firebase**: Đảm bảo ảnh và dữ liệu người dùng được mã hóa (S5).

## 8. Kết luận

Thiết kế cơ sở dữ liệu này đáp ứng đầy đủ các yêu cầu của ứng dụng Locket Clone, đồng thời đảm bảo tính mở rộng, hiệu suất cao và dễ bảo trì. Việc kết hợp MySQL với Firebase cung cấp một giải pháp linh hoạt và mạnh mẽ cho ứng dụng.
