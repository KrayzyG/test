# Cấu trúc Dự án Tối ưu cho Ứng dụng Locket Clone

## 1. Tổng quan Cấu trúc Dự án

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

## 2. Chi tiết Cấu trúc Dự án

### 2.1 Packages

#### 2.1.1 Backend

```
/packages/backend
|-- /src
|   |-- /config                 # Cấu hình ứng dụng
|   |-- /controllers            # Xử lý logic nghiệp vụ
|   |-- /middlewares            # Middleware
|   |-- /models                 # Định nghĩa model
|   |-- /repositories           # Tương tác với cơ sở dữ liệu
|   |-- /routes                 # Định nghĩa API routes
|   |-- /services               # Logic nghiệp vụ
|   |-- /sockets                # Xử lý WebSocket
|   |-- /types                  # Định nghĩa TypeScript types
|   |-- /utils                  # Tiện ích
|   |-- app.ts                  # Khởi tạo ứng dụng Express
|   |-- server.ts               # Điểm khởi chạy ứng dụng
|
|-- /tests                      # Unit và integration tests
|-- /dist                       # Mã đã biên dịch
|-- .env                        # Biến môi trường
|-- .env.example                # Mẫu biến môi trường
|-- package.json                # Cấu hình npm
|-- tsconfig.json               # Cấu hình TypeScript
|-- jest.config.js              # Cấu hình Jest
|-- Dockerfile                  # Cấu hình Docker
|-- README.md                   # Tài liệu backend
```

#### 2.1.2 Frontend

```
/packages/frontend
|-- /app                      # Cấu trúc ứng dụng theo Expo Router
|-- /src
|   |-- /components           # Components tái sử dụng
|   |-- /hooks                # Custom hooks
|   |-- /services             # Dịch vụ API và tích hợp
|   |-- /store                # State management
|   |-- /utils                # Tiện ích
|   |-- /types                # TypeScript types
|   |-- /constants            # Hằng số
|   |-- /localization         # Đa ngôn ngữ
|   |-- /widgets              # Widget cho màn hình chính
|
|-- /assets                   # Tài nguyên tĩnh
|-- /modules                  # Native modules
|-- app.json                  # Cấu hình Expo
|-- tsconfig.json             # Cấu hình TypeScript
|-- babel.config.js           # Cấu hình Babel
|-- metro.config.js           # Cấu hình Metro bundler
|-- eas.json                  # Cấu hình EAS
|-- package.json              # Cấu hình npm
|-- .env.example              # Mẫu biến môi trường
|-- README.md                 # Tài liệu frontend
```

#### 2.1.3 Common

```
/packages/common
|-- /src
|   |-- /types                # Định nghĩa types dùng chung
|   |-- /utils                # Tiện ích dùng chung
|   |-- /constants            # Hằng số dùng chung
|   |-- index.ts              # Entry point
|
|-- package.json              # Cấu hình npm
|-- tsconfig.json             # Cấu hình TypeScript
|-- README.md                 # Tài liệu common
```

#### 2.1.4 Database

```
/packages/database
|-- /migrations               # Migration scripts
|-- /seeds                    # Seed data
|-- /scripts                  # Database scripts
|-- schema.sql                # Schema SQL
|-- package.json              # Cấu hình npm
|-- README.md                 # Tài liệu database
```

### 2.2 Docs

```
/docs
|-- /api
|   |-- api-spec.yaml         # OpenAPI specification
|   |-- endpoints.md          # Tài liệu endpoints
|
|-- /database
|   |-- schema.md             # Tài liệu schema
|   |-- er-diagram.png        # ER diagram
|
|-- /architecture
|   |-- overview.md           # Tổng quan kiến trúc
|   |-- backend.md            # Kiến trúc backend
|   |-- frontend.md           # Kiến trúc frontend
|
|-- /deployment
|   |-- setup.md              # Hướng dẫn cài đặt
|   |-- production.md         # Hướng dẫn triển khai production
|
|-- README.md                 # Tài liệu chính
```

### 2.3 Scripts

```
/scripts
|-- setup.sh                  # Cài đặt môi trường
|-- dev.sh                    # Chạy môi trường phát triển
|-- build.sh                  # Build dự án
|-- deploy.sh                 # Triển khai
|-- db-migrate.sh             # Chạy migrations
|-- db-seed.sh                # Chạy seeds
|-- test.sh                   # Chạy tests
```

### 2.4 Config

```
/config
|-- .eslintrc.js              # Cấu hình ESLint
|-- .prettierrc               # Cấu hình Prettier
|-- tsconfig.base.json        # Cấu hình TypeScript cơ sở
|-- jest.config.base.js       # Cấu hình Jest cơ sở
|-- commitlint.config.js      # Cấu hình Commitlint
```

## 3. Quản lý Monorepo

### 3.1 Lerna

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

### 3.2 Workspaces

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

## 4. Môi trường Phát triển

### 4.1 Docker Compose

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

### 4.2 Biến Môi trường

```
# .env.example
# Database
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=locket
MYSQL_USER=locket
MYSQL_PASSWORD=locket

# Backend
NODE_ENV=development
PORT=3000
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=30d
REFRESH_TOKEN_EXPIRES_IN=90d

# Firebase
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
FIREBASE_APP_ID=your-firebase-app-id

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
EMAIL_FROM=noreply@locket-clone.com
```

## 5. Quy trình CI/CD

### 5.1 GitHub Actions

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

### 5.2 Triển khai

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      - run: yarn install
      - run: yarn build
      # Deploy to AWS EC2 or similar
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/app
            git pull
            yarn install
            yarn build
            pm2 restart all

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      - run: yarn install
      - run: cd packages/frontend && yarn build
      # Deploy to Expo EAS
      - name: Deploy to Expo
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: cd packages/frontend && eas build --platform all --profile production
```

## 6. Quy trình Phát triển

### 6.1 Git Flow

```
main        : Phiên bản production
develop     : Phiên bản phát triển
feature/*   : Tính năng mới
bugfix/*    : Sửa lỗi
release/*   : Chuẩn bị phát hành
hotfix/*    : Sửa lỗi khẩn cấp
```

### 6.2 Quy ước Commit

```
feat: Tính năng mới
fix: Sửa lỗi
docs: Tài liệu
style: Định dạng (không ảnh hưởng đến mã)
refactor: Tái cấu trúc mã
test: Thêm hoặc sửa tests
chore: Công việc bảo trì
```

### 6.3 Quy trình Pull Request

1. Tạo branch từ develop
2. Phát triển tính năng/sửa lỗi
3. Tạo pull request vào develop
4. Code review
5. Merge vào develop
6. Tạo release branch khi cần phát hành
7. Merge release vào main và develop

## 7. Tài liệu Dự án

### 7.1 README.md

```markdown
# Locket Clone

Ứng dụng di động cho phép người dùng chia sẻ ảnh trực tiếp với bạn bè thông qua widget trên màn hình chính của thiết bị di động.

## Cài đặt

### Yêu cầu

- Node.js v18+
- Yarn
- Docker và Docker Compose
- MySQL 8.0+
- Redis

### Cài đặt môi trường

```bash
# Clone repository
git clone https://github.com/your-username/locket-clone.git
cd locket-clone

# Cài đặt dependencies
yarn install

# Cài đặt môi trường phát triển
./scripts/setup.sh

# Chạy môi trường phát triển
./scripts/dev.sh
```

## Cấu trúc dự án

- `/packages/backend`: Backend Node.js Express TypeScript
- `/packages/frontend`: Frontend React Native Expo TypeScript
- `/packages/common`: Mã dùng chung
- `/packages/database`: Scripts và migrations cho cơ sở dữ liệu

## Phát triển

### Backend

```bash
cd packages/backend
yarn dev
```

### Frontend

```bash
cd packages/frontend
yarn start
```

## Triển khai

### Backend

```bash
cd packages/backend
yarn build
```

### Frontend

```bash
cd packages/frontend
yarn build
```

## Tài liệu

Xem thêm tài liệu chi tiết trong thư mục `/docs`.

## Đóng góp

Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết chi tiết về quy trình đóng góp.

## Giấy phép

Dự án này được cấp phép theo giấy phép MIT - xem tệp [LICENSE](LICENSE) để biết chi tiết.
```

### 7.2 CONTRIBUTING.md

```markdown
# Đóng góp cho Locket Clone

## Quy trình đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'feat: Add some amazing feature'`)
4. Push lên branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## Quy ước Commit

Chúng tôi sử dụng Conventional Commits:

- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Tài liệu
- `style`: Định dạng (không ảnh hưởng đến mã)
- `refactor`: Tái cấu trúc mã
- `test`: Thêm hoặc sửa tests
- `chore`: Công việc bảo trì

## Quy trình Pull Request

1. Đảm bảo mã của bạn tuân thủ tiêu chuẩn code style
2. Đảm bảo tất cả tests đều pass
3. Cập nhật tài liệu nếu cần
4. Mô tả chi tiết thay đổi trong Pull Request

## Báo cáo lỗi

Khi báo cáo lỗi, vui lòng bao gồm:

- Mô tả chi tiết về lỗi
- Các bước để tái hiện lỗi
- Môi trường (hệ điều hành, phiên bản Node.js, v.v.)
- Ảnh chụp màn hình nếu có thể
```

## 8. Kết luận

Cấu trúc dự án này được thiết kế để tối ưu hóa quy trình phát triển, bảo trì và mở rộng ứng dụng Locket Clone. Việc sử dụng monorepo cho phép quản lý hiệu quả cả frontend và backend trong một kho mã nguồn duy nhất, đồng thời duy trì sự tách biệt rõ ràng giữa các thành phần. Cấu trúc này cũng tạo điều kiện thuận lợi cho việc chia sẻ mã, kiểm thử và triển khai đồng bộ.

Các công cụ và quy trình được chọn dựa trên các thực tiễn tốt nhất trong ngành, đảm bảo chất lượng mã nguồn, hiệu quả phát triển và khả năng mở rộng. Việc tự động hóa quy trình CI/CD giúp giảm thiểu lỗi và tăng tốc độ phát triển, trong khi tài liệu chi tiết giúp các thành viên mới dễ dàng tham gia dự án.
