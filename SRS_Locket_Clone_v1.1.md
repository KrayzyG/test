# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)  
# Ứng dụng Locket Clone  

**Phiên bản:** 1.1  
**Ngày cập nhật:** 24/10/2024  
**Công nghệ sử dụng:** React Native, Node.js, Express, TypeScript, MySQL, Firebase, Nodemailer  

---

## 1. GIỚI THIỆU  

### 1.1 Mục đích  
Tài liệu này mô tả các yêu cầu chi tiết cho việc phát triển ứng dụng Locket Clone, một ứng dụng di động cho phép người dùng chia sẻ ảnh trực tiếp với bạn bè thông qua widget trên màn hình chính của thiết bị di động. Ứng dụng được xây dựng để tạo ra trải nghiệm kết nối cá nhân và tức thời.  

### 1.2 Phạm vi  
Ứng dụng Locket Clone sẽ được phát triển cho cả nền tảng iOS và Android sử dụng React Native. Phía máy chủ sẽ được phát triển bằng Node.js, Express và TypeScript, với cơ sở dữ liệu MySQL. Lưu trữ ảnh và dữ liệu sẽ sử dụng Firebase Storage, thông báo đẩy qua Firebase Cloud Messaging (FCM), đồng bộ hóa dữ liệu giữa các thiết bị qua API, và gửi email qua Nodemailer.  

### 1.3 Định nghĩa & Từ viết tắt  
- **SRS:** Software Requirements Specification  
- **API:** Application Programming Interface  
- **UI:** User Interface  
- **UX:** User Experience  
- **CRUD:** Create, Read, Update, Delete  
- **JWT:** JSON Web Token  
- **FCM:** Firebase Cloud Messaging  
- **Push Notification:** Thông báo đẩy  
- **Widget:** Tiện ích hiển thị trên màn hình chính của thiết bị di động  
- **Nodemailer:** Thư viện gửi email cho Node.js  

---

## 2. MÔ TẢ TỔNG QUÁT  

### 2.1 Viễn cảnh sản phẩm  
Locket Clone là một ứng dụng di động cho phép người dùng chia sẻ khoảnh khắc cuộc sống của họ với bạn bè và người thân thông qua các bức ảnh hiển thị trực tiếp trên widget màn hình chính. Ứng dụng tập trung vào trải nghiệm kết nối cá nhân, tức thời và an toàn.  

### 2.2 Chức năng của sản phẩm  
- Đăng ký và đăng nhập tài khoản (bao gồm đăng nhập qua mạng xã hội)  
- Kết nối với bạn bè thông qua danh bạ hoặc mã QR  
- Chụp ảnh và chia sẻ ngay lập tức với các bạn bè được kết nối  
- Hiển thị ảnh nhận được từ bạn bè trên widget màn hình chính  
- Xem lịch sử ảnh đã gửi và nhận  
- Quản lý danh sách bạn bè và cài đặt riêng tư  
- Nhận thông báo đẩy khi có ảnh mới hoặc yêu cầu kết bạn (qua FCM)  
- Gửi email thông báo và đặt lại mật khẩu (qua Nodemailer)  

### 2.3 Đặc điểm người dùng  
Ứng dụng hướng đến các người dùng:  
- Độ tuổi 16-35  
- Có smartphone chạy iOS hoặc Android  
- Muốn kết nối trực tiếp và thường xuyên với nhóm bạn bè hoặc người thân  
- Ưa thích chia sẻ khoảnh khắc cuộc sống hàng ngày theo cách đơn giản và không chính thức  

### 2.4 Ràng buộc  
- Ứng dụng phải hoạt động trên cả iOS (từ iOS 14 trở lên) và Android (từ Android 8.0 trở lên)  
- Phải hỗ trợ widget trên cả hai nền tảng  
- Phải tuân thủ các quy định về quyền riêng tư của Apple và Google  
- Phải xử lý dữ liệu người dùng theo quy định GDPR và CCPA  
- Kích thước ứng dụng không vượt quá 50MB  

### 2.5 Giả định và phụ thuộc  
- Người dùng có kết nối internet ổn định  
- Thiết bị của người dùng hỗ trợ widget trên màn hình chính  
- Người dùng cho phép ứng dụng truy cập camera, danh bạ, và thông báo  

---

## 3. YÊU CẦU CỤ THỂ  

### 3.1 Yêu cầu giao diện  

#### 3.1.1 Giao diện người dùng  
- **Màn hình đăng nhập/đăng ký**  
  - Đăng ký với email, số điện thoại hoặc tài khoản mạng xã hội  
  - Đăng nhập với email/số điện thoại và mật khẩu  
  - Khôi phục mật khẩu qua email (sử dụng Nodemailer)  

- **Màn hình chính**  
  - Hiển thị ảnh mới nhất đã nhận  
  - Nút chụp ảnh nhanh  
  - Truy cập vào lịch sử ảnh  
  - Thông báo ảnh mới (qua FCM)  

- **Màn hình chụp ảnh**  
  - Hiển thị camera trực tiếp  
  - Các tùy chọn chỉnh sửa đơn giản (filter, sticker)  
  - Nút chụp và gửi ảnh  
  - Danh sách bạn bè được chọn để gửi ảnh  

- **Màn hình bạn bè**  
  - Danh sách bạn bè hiện tại  
  - Tìm kiếm và thêm bạn mới  
  - Hiển thị mã QR cá nhân  
  - Quét mã QR để thêm bạn  

- **Màn hình lịch sử**  
  - Lưới ảnh đã gửi và nhận  
  - Bộ lọc theo người gửi/nhận  
  - Tùy chọn lưu ảnh vào thiết bị  

- **Màn hình cài đặt**  
  - Cài đặt tài khoản và bảo mật  
  - Tùy chọn thông báo (qua FCM)  
  - Quyền riêng tư  
  - Trợ giúp và hỗ trợ  

#### 3.1.2 Giao diện phần cứng  
- Camera thiết bị  
- Bộ nhớ thiết bị  
- Kết nối mạng  

#### 3.1.3 Giao diện phần mềm  
- API cho widget hệ thống trên iOS và Android  
- API cho Push Notification (FCM)  
- API cho truy cập danh bạ  

#### 3.1.4 Giao diện truyền thông  
- RESTful API giữa ứng dụng di động và máy chủ  
- WebSocket cho thông báo thời gian thực  
- Giao thức HTTPS cho truyền dữ liệu an toàn  

---

### 3.2 Yêu cầu chức năng  

#### 3.2.1 Quản lý tài khoản  
- **F1.1:** Người dùng có thể đăng ký tài khoản mới với email, số điện thoại, hoặc tài khoản mạng xã hội  
- **F1.2:** Người dùng có thể đăng nhập vào tài khoản hiện có  
- **F1.3:** Người dùng có thể khôi phục mật khẩu qua email (sử dụng Nodemailer)  
- **F1.4:** Người dùng có thể cập nhật thông tin cá nhân (tên, ảnh đại diện)  
- **F1.5:** Người dùng có thể xóa tài khoản  

#### 3.2.2 Kết nối bạn bè  
- **F2.1:** Người dùng có thể tìm bạn bè qua số điện thoại hoặc email  
- **F2.2:** Người dùng có thể tạo và chia sẻ mã QR cá nhân  
- **F2.3:** Người dùng có thể quét mã QR để thêm bạn  
- **F2.4:** Người dùng có thể chấp nhận hoặc từ chối yêu cầu kết bạn  
- **F2.5:** Người dùng có thể xóa bạn bè khỏi danh sách  

#### 3.2.3 Chụp và chia sẻ ảnh  
- **F3.1:** Người dùng có thể chụp ảnh từ ứng dụng  
- **F3.2:** Người dùng có thể áp dụng bộ lọc và sticker đơn giản  
- **F3.3:** Người dùng có thể chọn một hoặc nhiều bạn bè để gửi ảnh  
- **F3.4:** Người dùng có thể xem trạng thái gửi và nhận ảnh  
- **F3.5:** Người dùng có thể xóa ảnh đã gửi (trước khi được xem)  

#### 3.2.4 Widget và hiển thị  
- **F4.1:** Ứng dụng cung cấp widget cho màn hình chính  
- **F4.2:** Widget hiển thị ảnh mới nhất từ bạn bè  
- **F4.3:** Widget tự động cập nhật khi có ảnh mới (qua FCM)  
- **F4.4:** Người dùng có thể nhấn vào widget để mở ứng dụng  

#### 3.2.5 Lịch sử và quản lý ảnh  
- **F5.1:** Người dùng có thể xem tất cả ảnh đã gửi và nhận  
- **F5.2:** Người dùng có thể lọc ảnh theo người gửi/nhận  
- **F5.3:** Người dùng có thể lưu ảnh vào thiết bị  
- **F5.4:** Người dùng có thể xóa ảnh khỏi lịch sử  
- **F5.5:** Hệ thống tự động lưu trữ ảnh trong 30 ngày  

#### 3.2.6 Thông báo  
- **F6.1:** Người dùng nhận thông báo đẩy khi có ảnh mới (qua FCM)  
- **F6.2:** Người dùng nhận thông báo đẩy khi có yêu cầu kết bạn mới (qua FCM)  
- **F6.3:** Người dùng có thể tùy chỉnh cài đặt thông báo  
- **F6.4:** Thông báo chứa hình thu nhỏ của ảnh đã nhận  

---

### 3.3 Yêu cầu phi chức năng  

#### 3.3.1 Hiệu suất  
- **P1:** Thời gian gửi ảnh từ thiết bị đến máy chủ không quá 3 giây với kết nối mạng ổn định  
- **P2:** Thời gian cập nhật widget khi có ảnh mới không quá 5 giây  
- **P3:** Ứng dụng phải xử lý ít nhất 1000 yêu cầu đồng thời trên máy chủ  
- **P4:** Tiêu thụ pin của widget không vượt quá 5% pin mỗi ngày  
- **P5:** Ứng dụng phải khởi động trong vòng 2 giây  

#### 3.3.2 Bảo mật  
- **S1:** Tất cả dữ liệu truyền qua mạng phải được mã hóa bằng HTTPS  
- **S2:** Mật khẩu người dùng phải được băm và lưu trữ an toàn  
- **S3:** Token xác thực phải hết hạn sau 30 ngày  
- **S4:** Ứng dụng phải hỗ trợ xác thực hai yếu tố  
- **S5:** Ảnh và dữ liệu người dùng phải được mã hóa khi lưu trữ trên Firebase  

#### 3.3.3 Khả năng sử dụng  
- **U1:** Người dùng mới có thể đăng ký và gửi ảnh đầu tiên trong vòng 3 phút  
- **U2:** Giao diện người dùng phải tuân thủ hướng dẫn thiết kế của cả iOS và Android  
- **U3:** Ứng dụng phải hỗ trợ nhiều ngôn ngữ (ban đầu: Tiếng Anh và Tiếng Việt)  
- **U4:** Ứng dụng phải hỗ trợ chế độ tối/sáng  
- **U5:** Ứng dụng phải có thể sử dụng được cho người dùng khiếm thị  

#### 3.3.4 Độ tin cậy  
- **R1:** Ứng dụng phải có thời gian hoạt động ít nhất 99.9%  
- **R2:** Ứng dụng phải tự động sao lưu dữ liệu người dùng hàng ngày trên Firebase  
- **R3:** Ứng dụng phải tự phục hồi sau khi mất kết nối mạng  
- **R4:** Dữ liệu phải được sao lưu trên nhiều máy chủ Firebase  
- **R5:** Hệ thống phải có khả năng phục hồi từ sự cố trong vòng 1 giờ  

#### 3.3.5 Khả năng mở rộng  
- **SC1:** Hệ thống phải hỗ trợ tăng từ 10,000 lên 1 triệu người dùng mà không cần thay đổi kiến trúc  
- **SC2:** Cơ sở dữ liệu phải hỗ trợ phân vùng (sharding) để mở rộng theo chiều ngang  
- **SC3:** Máy chủ phải hỗ trợ cân bằng tải và tự động mở rộng  
- **SC4:** Hệ thống lưu trữ ảnh trên Firebase phải cho phép mở rộng không giới hạn  

---

## 4. KIẾN TRÚC HỆ THỐNG  

### 4.1 Kiến trúc tổng thể  
Hệ thống Locket Clone được chia thành các thành phần chính sau:  

1. **Ứng dụng di động (Client)**  
   - Phát triển bằng React Native và TypeScript  
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

### 4.2 Mô hình dữ liệu  

#### 4.2.1 Diagram cơ sở dữ liệu  
```
users
  - id (PK)
  - username
  - email
  - phone
  - password_hash
  - profile_image
  - created_at
  - updated_at

friends
  - id (PK)
  - user_id (FK)
  - friend_id (FK)
  - status (pending/accepted)
  - created_at
  - updated_at

photos
  - id (PK)
  - sender_id (FK)
  - image_url (Firebase Storage URL)
  - created_at
  - deleted_at

photo_recipients
  - id (PK)
  - photo_id (FK)
  - recipient_id (FK)
  - viewed_at
  - created_at

devices
  - id (PK)
  - user_id (FK)
  - device_token
  - platform (ios/android)
  - created_at
  - last_active_at
```

#### 4.2.2 Mô tả bảng  
1. **users**: Lưu trữ thông tin người dùng  
2. **friends**: Quản lý mối quan hệ bạn bè giữa người dùng  
3. **photos**: Lưu trữ thông tin về ảnh được gửi (image_url trỏ đến Firebase Storage)  
4. **photo_recipients**: Lưu trữ thông tin về việc nhận ảnh  
5. **devices**: Quản lý thiết bị của người dùng cho thông báo đẩy (FCM)  

### 4.3 API Endpoints  

#### 4.3.1 Xác thực  
- `POST /api/auth/register` - Đăng ký người dùng mới  
- `POST /api/auth/login` - Đăng nhập  
- `POST /api/auth/refresh` - Làm mới token  
- `POST /api/auth/password/reset` - Yêu cầu đặt lại mật khẩu (gửi email qua Nodemailer)  
- `PUT /api/auth/password/update` - Cập nhật mật khẩu mới  

#### 4.3.2 Quản lý người dùng  
- `GET /api/users/me` - Lấy thông tin người dùng hiện tại  
- `PUT /api/users/me` - Cập nhật thông tin người dùng  
- `DELETE /api/users/me` - Xóa tài khoản  
- `GET /api/users/search` - Tìm kiếm người dùng  

#### 4.3.3 Quản lý bạn bè  
- `GET /api/friends` - Lấy danh sách bạn bè  
- `POST /api/friends/request` - Gửi yêu cầu kết bạn  
- `PUT /api/friends/:id/accept` - Chấp nhận yêu cầu kết bạn  
- `PUT /api/friends/:id/reject` - Từ chối yêu cầu kết bạn  
- `DELETE /api/friends/:id` - Xóa bạn bè  

#### 4.3.4 Quản lý ảnh  
- `POST /api/photos` - Tạo và gửi ảnh mới (lưu trữ trên Firebase Storage)  
- `GET /api/photos` - Lấy lịch sử ảnh  
- `GET /api/photos/received` - Lấy ảnh đã nhận  
- `GET /api/photos/latest` - Lấy ảnh mới nhất cho widget  
- `DELETE /api/photos/:id` - Xóa ảnh  

#### 4.3.5 Quản lý thiết bị  
- `POST /api/devices` - Đăng ký thiết bị mới cho FCM  
- `PUT /api/devices/:id` - Cập nhật token thiết bị  
- `DELETE /api/devices/:id` - Xóa thiết bị  

### 4.4 WebSocket Events  
- `photo:new` - Thông báo có ảnh mới  
- `friend:request` - Thông báo yêu cầu kết bạn mới  
- `friend:accept` - Thông báo chấp nhận kết bạn  

---

## 5. YÊU CẦU TRIỂN KHAI  

### 5.1 Môi trường phát triển  
- **Frontend (React Native)**  
  - Node.js v18+  
  - npm/yarn  
  - React Native CLI  
  - TypeScript 5.0+  
  - Xcode (cho iOS)  
  - Android Studio (cho Android)  

- **Backend (Node.js)**  
  - Node.js v18+  
  - npm/yarn  
  - Express  
  - TypeScript 5.0+  
  - MySQL 8.0+  
  - Firebase Admin SDK  
  - Nodemailer  

### 5.2 Quy trình CI/CD  
1. **Kiểm thử tự động**  
   - Unit tests  
   - Integration tests  
   - End-to-end tests  

2. **Build và triển khai**  
   - Build tự động khi có thay đổi trong main branch  
   - Triển khai tự động sau khi kiểm thử thành công  
   - Môi trường phát triển, staging và production  

### 5.3 Cấu hình máy chủ  
- **Production**  
  - Máy chủ API: AWS EC2 hoặc tương đương  
  - Cơ sở dữ liệu: AWS RDS MySQL hoặc tương đương  
  - Lưu trữ ảnh: Firebase Storage  
  - Thông báo đẩy: Firebase Cloud Messaging  
  - Gửi email: Nodemailer (với dịch vụ email như Gmail, SendGrid)  
  - CDN: Firebase Hosting hoặc tương đương  
  - Cache: Redis  

- **Staging/Testing**  
  - Môi trường tương tự nhưng quy mô nhỏ hơn  

---

## 6. KẾ HOẠCH KIỂM THỬ  

### 6.1 Kiểm thử đơn vị (Unit Testing)  
- Kiểm thử các hàm trong mã nguồn  
- Kiểm thử các helper và utility  
- Kiểm thử các hook trong React Native  

### 6.2 Kiểm thử tích hợp (Integration Testing)  
- Kiểm thử API endpoints  
- Kiểm thử WebSocket  
- Kiểm thử luồng dữ liệu với Firebase  

### 6.3 Kiểm thử end-to-end  
- Kiểm thử luồng đăng ký và đăng nhập  
- Kiểm thử luồng kết bạn  
- Kiểm thử luồng chụp và chia sẻ ảnh  
- Kiểm thử widget và thông báo đẩy (FCM)  

### 6.4 Kiểm thử hiệu suất  
- Kiểm thử tải (load testing)  
- Kiểm thử stress  
- Kiểm thử thời gian phản hồi  

### 6.5 Kiểm thử bảo mật  
- Kiểm thử xác thực và phân quyền  
- Kiểm thử SQL injection  
- Kiểm thử XSS và CSRF  
- Kiểm thử bảo mật dữ liệu trên Firebase  

---

## 7. LỊCH TRÌNH DỰ ÁN  

### 7.1 Giai đoạn 1: Thiết kế và chuẩn bị (2 tuần)  
- Hoàn thiện SRS  
- Thiết kế cơ sở dữ liệu  
- Thiết kế UI/UX  
- Chuẩn bị môi trường phát triển (Firebase, Nodemailer)  

### 7.2 Giai đoạn 2: Phát triển cốt lõi (4 tuần)  
- Phát triển backend API cơ bản  
- Phát triển frontend cơ bản  
- Tích hợp xác thực và quản lý người dùng  
- Thiết lập CI/CD  

### 7.3 Giai đoạn 3: Phát triển tính năng (6 tuần)  
- Phát triển tính năng chụp và chia sẻ ảnh (Firebase Storage)  
- Phát triển widget cho iOS và Android  
- Phát triển quản lý bạn bè  
- Phát triển hệ thống thông báo (FCM, Nodemailer)  

### 7.4 Giai đoạn 4: Kiểm thử và tối ưu (3 tuần)  
- Kiểm thử toàn diện  
- Tối ưu hiệu suất  
- Sửa lỗi  
- Chuẩn bị cho phát hành  

### 7.5 Giai đoạn 5: Phát hành và hỗ trợ (liên tục)  
- Phát hành bản beta  
- Phát hành chính thức  
- Theo dõi và hỗ trợ sau phát hành  
- Cập nhật và cải tiến liên tục  

---

## 8. PHỤ LỤC  

### 8.1 Tài liệu tham khảo  
1. React Native Documentation: https://reactnative.dev/docs/getting-started  
2. Express Documentation: https://expressjs.com/  
3. TypeScript Documentation: https://www.typescriptlang.org/docs/  
4. MySQL Documentation: https://dev.mysql.com/doc/  
5. Firebase Documentation: https://firebase.google.com/docs  
6. Nodemailer Documentation: https://nodemailer.com/about/  

### 8.2 Thuật ngữ  
- **Widget**: Tiện ích hiển thị trên màn hình chính của thiết bị di động  
- **Push Notification**: Thông báo đẩy từ máy chủ đến thiết bị người dùng qua FCM  
- **Token xác thực**: Mã thông báo dùng để xác thực người dùng  
- **API Endpoint**: Điểm cuối API, URL mà client có thể gọi để tương tác với máy chủ  
- **WebSocket**: Giao thức truyền thông hai chiều theo thời gian thực  

### 8.3 Yêu cầu pháp lý  
- Ứng dụng phải tuân thủ GDPR cho người dùng tại EU  
- Ứng dụng phải tuân thủ CCPA cho người dùng tại California  
- Ứng dụng phải có chính sách bảo mật và điều khoản sử dụng rõ ràng  
- Ứng dụng phải có cơ chế cho phép người dùng yêu cầu và xóa dữ liệu của họ  

---

## 9. CÁC CÂN NHẮC BỔ SUNG  

- **Lưu trữ**: Sử dụng Firebase Storage cho ảnh, hỗ trợ lưu cục bộ trên thiết bị cho chế độ offline.  
- **Thông báo đẩy**: Tích hợp Firebase Cloud Messaging (FCM) để gửi thông báo đẩy cho người dùng.  
- **Đồng bộ hóa**: Dữ liệu được đồng bộ giữa các thiết bị thông qua API và Firebase Realtime Database hoặc Firestore, đảm bảo người dùng có thể truy cập dữ liệu mới nhất trên nhiều thiết bị.  
- **Gửi email**: Sử dụng Nodemailer để gửi email cho các chức năng như đặt lại mật khẩu, thông báo hệ thống, và xác nhận tài khoản.  

---

**Hướng dẫn xuất file DOC:**  
1. Sao chép toàn bộ nội dung tài liệu này.  
2. Dán vào một trình soạn thảo văn bản như Microsoft Word hoặc Google Docs.  
3. Định dạng lại tiêu đề, danh sách, và bảng nếu cần.  
4. Lưu dưới định dạng `.doc` hoặc `.docx`.