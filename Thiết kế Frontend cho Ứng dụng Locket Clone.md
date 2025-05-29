# Thiết kế Frontend cho Ứng dụng Locket Clone

## 1. Tổng quan Kiến trúc Frontend

Frontend của ứng dụng Locket Clone được xây dựng bằng React Native với Expo và TypeScript, tạo ra một ứng dụng di động đa nền tảng (iOS và Android) với trải nghiệm người dùng mượt mà và nhất quán. Kiến trúc được thiết kế theo mô hình component-based, kết hợp với state management hiệu quả và tích hợp với native widgets.

## 2. Cấu trúc Dự án Frontend

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
|-- .eslintrc.js              # Cấu hình ESLint
|-- .prettierrc               # Cấu hình Prettier
|-- README.md                 # Tài liệu dự án
```

## 3. Công nghệ và Thư viện

### 3.1 Công nghệ Chính

- **React Native**: Framework xây dựng ứng dụng di động đa nền tảng
- **Expo**: Nền tảng phát triển React Native
- **TypeScript**: Ngôn ngữ lập trình tĩnh
- **Expo Router**: Điều hướng dựa trên file system

### 3.2 Thư viện và Công cụ

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

## 4. Chi tiết Kiến trúc

### 4.1 Mô hình Component

Ứng dụng sử dụng mô hình component-based với các loại component:

1. **UI Components**: Components cơ bản như Button, Input, Card
2. **Container Components**: Components chứa logic và state
3. **Screen Components**: Components đại diện cho màn hình
4. **HOCs (Higher-Order Components)**: Components bọc các components khác
5. **Compound Components**: Components phức tạp với nhiều thành phần con

### 4.2 State Management

Kết hợp nhiều phương pháp quản lý state:

1. **Local State**: useState, useReducer cho state cục bộ
2. **Global State**: Redux Toolkit cho state toàn cục
3. **Server State**: React Query cho state từ server
4. **Form State**: React Hook Form cho state form
5. **Persistent State**: AsyncStorage, SecureStore cho state lưu trữ

### 4.3 Navigation

Sử dụng Expo Router với cấu trúc file-based routing:

1. **Stack Navigation**: Điều hướng theo stack
2. **Tab Navigation**: Điều hướng theo tab
3. **Drawer Navigation**: Điều hướng theo drawer
4. **Modal Navigation**: Điều hướng modal
5. **Deep Linking**: Hỗ trợ deep linking

### 4.4 Xác thực và Phân quyền

1. **Đăng nhập/Đăng ký**: Email, số điện thoại, mạng xã hội
2. **JWT**: Lưu trữ và làm mới token
3. **Biometric**: Xác thực sinh trắc học
4. **Protected Routes**: Bảo vệ các màn hình yêu cầu xác thực

### 4.5 Camera và Xử lý Ảnh

1. **Chụp ảnh**: Sử dụng Expo Camera
2. **Chỉnh sửa**: Filters, stickers, crop
3. **Chia sẻ**: Gửi ảnh đến bạn bè
4. **Lưu trữ**: Lưu ảnh vào thiết bị

### 4.6 Widget

1. **Native Widget**: Tích hợp với widget hệ thống
2. **Cập nhật**: Cập nhật widget khi có ảnh mới
3. **Tương tác**: Nhấn vào widget để mở ứng dụng

### 4.7 Thông báo Đẩy

1. **Đăng ký**: Đăng ký thiết bị với FCM
2. **Xử lý**: Xử lý thông báo đẩy
3. **Foreground/Background**: Xử lý thông báo khi ứng dụng ở foreground/background
4. **Deep Linking**: Mở màn hình cụ thể từ thông báo

### 4.8 Offline Support

1. **Caching**: Lưu trữ dữ liệu offline
2. **Sync**: Đồng bộ hóa khi có kết nối
3. **Optimistic UI**: Cập nhật UI ngay lập tức, đồng bộ sau

## 5. Thiết kế UI/UX

### 5.1 Design System

1. **Colors**: Bảng màu chính, phụ, accent
2. **Typography**: Hệ thống font chữ
3. **Spacing**: Hệ thống khoảng cách
4. **Shadows**: Hệ thống đổ bóng
5. **Borders**: Hệ thống viền
6. **Icons**: Hệ thống biểu tượng

### 5.2 Responsive Design

1. **Dimensions API**: Lấy kích thước màn hình
2. **Flexbox**: Layout linh hoạt
3. **Percentage**: Kích thước tương đối
4. **Device Specific**: Điều chỉnh theo thiết bị

### 5.3 Accessibility

1. **Screen Reader**: Hỗ trợ đọc màn hình
2. **Contrast**: Độ tương phản đủ
3. **Touch Targets**: Kích thước vùng chạm đủ lớn
4. **Keyboard Navigation**: Hỗ trợ điều hướng bàn phím

### 5.4 Dark Mode

1. **Theme Provider**: Cung cấp theme
2. **Color Scheme**: Bảng màu cho light/dark mode
3. **System Preference**: Theo dõi cài đặt hệ thống

## 6. Màn hình Chính

### 6.1 Màn hình Đăng nhập/Đăng ký

- **Đăng nhập**: Email/số điện thoại + mật khẩu
- **Đăng ký**: Email, số điện thoại, thông tin cá nhân
- **Đăng nhập mạng xã hội**: Google, Facebook, Apple
- **Quên mật khẩu**: Đặt lại mật khẩu qua email

### 6.2 Màn hình Chính

- **Hiển thị ảnh mới nhất**: Ảnh từ bạn bè
- **Nút chụp ảnh**: Truy cập nhanh camera
- **Thông báo**: Hiển thị thông báo mới
- **Điều hướng**: Truy cập các màn hình khác

### 6.3 Màn hình Camera

- **Chụp ảnh**: Chụp ảnh trực tiếp
- **Chỉnh sửa**: Áp dụng filter, sticker
- **Chia sẻ**: Chọn bạn bè để gửi ảnh
- **Xem trước**: Xem trước ảnh trước khi gửi

### 6.4 Màn hình Bạn bè

- **Danh sách bạn bè**: Hiển thị bạn bè hiện tại
- **Tìm kiếm**: Tìm kiếm bạn bè
- **Thêm bạn**: Thêm bạn qua email, số điện thoại
- **Mã QR**: Tạo và quét mã QR
- **Yêu cầu kết bạn**: Quản lý yêu cầu kết bạn

### 6.5 Màn hình Lịch sử

- **Lưới ảnh**: Hiển thị ảnh đã gửi và nhận
- **Bộ lọc**: Lọc theo người gửi/nhận
- **Chi tiết**: Xem chi tiết ảnh
- **Lưu**: Lưu ảnh vào thiết bị

### 6.6 Màn hình Cài đặt

- **Tài khoản**: Quản lý thông tin cá nhân
- **Thông báo**: Cài đặt thông báo
- **Quyền riêng tư**: Cài đặt quyền riêng tư
- **Giao diện**: Chủ đề, ngôn ngữ
- **Trợ giúp**: Hỗ trợ và phản hồi

## 7. Widget

### 7.1 Thiết kế Widget

- **iOS**: WidgetKit, SwiftUI
- **Android**: App Widget, RemoteViews

### 7.2 Cập nhật Widget

- **Background Fetch**: Cập nhật định kỳ
- **Push Notification**: Cập nhật khi có thông báo
- **App Communication**: Cập nhật từ ứng dụng

### 7.3 Tương tác Widget

- **Tap Action**: Mở ứng dụng
- **Deep Link**: Mở màn hình cụ thể

## 8. Xử lý Ảnh

### 8.1 Chụp Ảnh

- **Camera Permission**: Xin quyền truy cập camera
- **Camera Settings**: Cài đặt camera (flash, zoom)
- **Capture**: Chụp ảnh

### 8.2 Chỉnh sửa Ảnh

- **Filters**: Áp dụng bộ lọc
- **Stickers**: Thêm sticker
- **Crop**: Cắt ảnh
- **Adjust**: Điều chỉnh độ sáng, độ tương phản

### 8.3 Chia sẻ Ảnh

- **Select Friends**: Chọn bạn bè để gửi
- **Upload**: Tải lên Firebase Storage
- **Notification**: Gửi thông báo

## 9. Tích hợp API

### 9.1 Cấu hình API

```typescript
// api.service.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.locket-clone.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        });
        const { token } = response.data;
        await AsyncStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        // Redirect to login
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 9.2 Dịch vụ API

```typescript
// photo.service.ts
import api from './api.service';
import * as FileSystem from 'expo-file-system';

export const photoService = {
  getPhotos: async () => {
    const response = await api.get('/api/photos');
    return response.data;
  },

  getReceivedPhotos: async () => {
    const response = await api.get('/api/photos/received');
    return response.data;
  },

  getLatestPhoto: async () => {
    const response = await api.get('/api/photos/latest');
    return response.data;
  },

  uploadPhoto: async (uri: string, recipients: string[], caption?: string) => {
    const formData = new FormData();
    
    // Get file name and type
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    
    formData.append('photo', {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    } as any);
    
    recipients.forEach(id => {
      formData.append('recipients[]', id);
    });
    
    if (caption) {
      formData.append('caption', caption);
    }
    
    const response = await api.post('/api/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  deletePhoto: async (id: string) => {
    const response = await api.delete(`/api/photos/${id}`);
    return response.data;
  },
};
```

### 9.3 WebSocket

```typescript
// socket.service.ts
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = 'https://api.locket-clone.com';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  async connect() {
    if (this.socket) return;

    const token = await AsyncStorage.getItem('token');
    
    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Setup event listeners
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Photo events
    this.socket.on('photo:new', (data) => {
      this.emit('photo:new', data);
    });

    this.socket.on('photo:viewed', (data) => {
      this.emit('photo:viewed', data);
    });

    // Friend events
    this.socket.on('friend:request', (data) => {
      this.emit('friend:request', data);
    });

    this.socket.on('friend:accept', (data) => {
      this.emit('friend:accept', data);
    });

    this.socket.on('friend:reject', (data) => {
      this.emit('friend:reject', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event) || [];
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
      this.listeners.set(event, callbacks);
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
}

export default new SocketService();
```

## 10. State Management

### 10.1 Redux Store

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import userReducer from './slices/user.slice';
import friendReducer from './slices/friend.slice';
import photoReducer from './slices/photo.slice';
import notificationReducer from './slices/notification.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    friend: friendReducer,
    photo: photoReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 10.2 Redux Slice

```typescript
// store/slices/photo.slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { photoService } from '../../services/photo.service';

export const fetchPhotos = createAsyncThunk(
  'photo/fetchPhotos',
  async (_, { rejectWithValue }) => {
    try {
      return await photoService.getPhotos();
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchReceivedPhotos = createAsyncThunk(
  'photo/fetchReceivedPhotos',
  async (_, { rejectWithValue }) => {
    try {
      return await photoService.getReceivedPhotos();
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchLatestPhoto = createAsyncThunk(
  'photo/fetchLatestPhoto',
  async (_, { rejectWithValue }) => {
    try {
      return await photoService.getLatestPhoto();
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadPhoto = createAsyncThunk(
  'photo/uploadPhoto',
  async ({ uri, recipients, caption }: { uri: string; recipients: string[]; caption?: string }, { rejectWithValue }) => {
    try {
      return await photoService.uploadPhoto(uri, recipients, caption);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePhoto = createAsyncThunk(
  'photo/deletePhoto',
  async (id: string, { rejectWithValue }) => {
    try {
      await photoService.deletePhoto(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

interface PhotoState {
  photos: any[];
  receivedPhotos: any[];
  latestPhoto: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: PhotoState = {
  photos: [],
  receivedPhotos: [],
  latestPhoto: null,
  loading: false,
  error: null,
};

const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {
    addNewPhoto: (state, action) => {
      state.receivedPhotos = [action.payload, ...state.receivedPhotos];
      state.latestPhoto = action.payload;
    },
    markPhotoViewed: (state, action) => {
      const photoId = action.payload;
      const photo = state.receivedPhotos.find(p => p.id === photoId);
      if (photo) {
        photo.viewed_at = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchReceivedPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceivedPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedPhotos = action.payload;
      })
      .addCase(fetchReceivedPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLatestPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.latestPhoto = action.payload;
      })
      .addCase(fetchLatestPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = [action.payload, ...state.photos];
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = state.photos.filter(photo => photo.id !== action.payload);
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addNewPhoto, markPhotoViewed } = photoSlice.actions;

export default photoSlice.reducer;
```

### 10.3 Custom Hooks

```typescript
// hooks/usePhotos.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchPhotos,
  fetchReceivedPhotos,
  fetchLatestPhoto,
  uploadPhoto,
  deletePhoto,
  markPhotoViewed,
} from '../store/slices/photo.slice';

export const usePhotos = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { photos, receivedPhotos, latestPhoto, loading, error } = useSelector(
    (state: RootState) => state.photo
  );

  const getPhotos = useCallback(() => {
    return dispatch(fetchPhotos());
  }, [dispatch]);

  const getReceivedPhotos = useCallback(() => {
    return dispatch(fetchReceivedPhotos());
  }, [dispatch]);

  const getLatestPhoto = useCallback(() => {
    return dispatch(fetchLatestPhoto());
  }, [dispatch]);

  const sendPhoto = useCallback(
    (uri: string, recipients: string[], caption?: string) => {
      return dispatch(uploadPhoto({ uri, recipients, caption }));
    },
    [dispatch]
  );

  const removePhoto = useCallback(
    (id: string) => {
      return dispatch(deletePhoto(id));
    },
    [dispatch]
  );

  const viewPhoto = useCallback(
    (id: string) => {
      return dispatch(markPhotoViewed(id));
    },
    [dispatch]
  );

  return {
    photos,
    receivedPhotos,
    latestPhoto,
    loading,
    error,
    getPhotos,
    getReceivedPhotos,
    getLatestPhoto,
    sendPhoto,
    removePhoto,
    viewPhoto,
  };
};
```

## 11. Thông báo Đẩy

### 11.1 Cấu hình Thông báo

```typescript
// utils/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { deviceService } from '../services/device.service';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  let token;
  
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  token = (await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  })).data;

  // Register device token with backend
  await deviceService.registerDevice(token, Platform.OS);

  return token;
};

export const setupNotificationListeners = () => {
  const notificationListener = Notifications.addNotificationReceivedListener(
    notification => {
      console.log('Notification received:', notification);
    }
  );

  const responseListener = Notifications.addNotificationResponseReceivedListener(
    response => {
      console.log('Notification response received:', response);
      // Handle notification tap
      const data = response.notification.request.content.data;
      
      // Navigate based on notification type
      if (data.type === 'photo') {
        // Navigate to photo screen
      } else if (data.type === 'friend_request') {
        // Navigate to friend requests screen
      }
    }
  );

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};
```

### 11.2 Tích hợp với Firebase

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { registerForPushNotifications, setupNotificationListeners } from '../src/utils/notifications';
import socketService from '../src/services/socket.service';

export default function RootLayout() {
  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications();

    // Setup notification listeners
    const unsubscribe = setupNotificationListeners();

    // Connect to WebSocket
    socketService.connect();

    return () => {
      unsubscribe();
      socketService.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </Provider>
  );
}
```

## 12. Widget Implementation

### 12.1 iOS Widget

```swift
// iOS Widget Implementation (Swift)
import WidgetKit
import SwiftUI
import Intents

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), imageURL: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), imageURL: nil)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        // Fetch latest photo URL from UserDefaults (shared between app and widget)
        let userDefaults = UserDefaults(suiteName: "group.com.locketclone.app")
        let imageURL = userDefaults?.string(forKey: "latestPhotoURL")
        
        let entry = SimpleEntry(date: Date(), imageURL: imageURL)
        let timeline = Timeline(entries: [entry], policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let imageURL: String?
}

struct LocketWidgetEntryView : View {
    var entry: Provider.Entry
    
    var body: some View {
        ZStack {
            if let imageURL = entry.imageURL, let url = URL(string: imageURL) {
                AsyncImage(url: url) { phase in
                    switch phase {
                    case .empty:
                        ProgressView()
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    case .failure:
                        Image(systemName: "photo")
                            .font(.system(size: 40))
                    @unknown default:
                        EmptyView()
                    }
                }
            } else {
                VStack {
                    Image(systemName: "photo")
                        .font(.system(size: 40))
                    Text("No photos yet")
                        .font(.caption)
                }
            }
        }
        .widgetURL(URL(string: "locketclone://photos/latest"))
    }
}

@main
struct LocketWidget: Widget {
    let kind: String = "LocketWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            LocketWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Locket Widget")
        .description("See the latest photo from your friends.")
        .supportedFamilies([.systemSmall])
    }
}
```

### 12.2 Android Widget

```kotlin
// Android Widget Implementation (Kotlin)
class LocketWidget : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        // Update all widgets
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            // Get the latest photo URL from SharedPreferences
            val prefs = context.getSharedPreferences("com.locketclone.app", Context.MODE_PRIVATE)
            val imageUrl = prefs.getString("latestPhotoURL", null)
            
            // Create a RemoteViews object
            val views = RemoteViews(context.packageName, R.layout.locket_widget)
            
            if (imageUrl != null) {
                // Load image using Glide and AppWidgetTarget
                val appWidgetTarget = object : AppWidgetTarget(
                    context,
                    R.id.widget_image,
                    views,
                    appWidgetId
                ) {}
                
                Glide.with(context.applicationContext)
                    .asBitmap()
                    .load(imageUrl)
                    .into(appWidgetTarget)
            } else {
                // Show placeholder
                views.setImageViewResource(R.id.widget_image, R.drawable.placeholder)
            }
            
            // Create an Intent to open the app when widget is clicked
            val intent = Intent(context, MainActivity::class.java).apply {
                action = "android.intent.action.VIEW"
                data = Uri.parse("locketclone://photos/latest")
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)
            
            // Update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
```

### 12.3 Widget Update from App

```typescript
// src/services/widget.service.ts
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

class WidgetService {
  async updateWidget(imageUrl: string) {
    if (Platform.OS === 'ios') {
      // iOS: Update UserDefaults (shared with widget)
      await this.updateiOSWidget(imageUrl);
    } else if (Platform.OS === 'android') {
      // Android: Update SharedPreferences and trigger widget update
      await this.updateAndroidWidget(imageUrl);
    }
  }

  private async updateiOSWidget(imageUrl: string) {
    // This would be implemented in native code (Swift)
    // and exposed via a native module
    // For demonstration purposes, we'll use a placeholder
    console.log('Updating iOS widget with image:', imageUrl);
  }

  private async updateAndroidWidget(imageUrl: string) {
    // This would be implemented in native code (Kotlin)
    // and exposed via a native module
    // For demonstration purposes, we'll use a placeholder
    console.log('Updating Android widget with image:', imageUrl);
  }

  // Download image for widget if needed
  async downloadImageForWidget(imageUrl: string): Promise<string> {
    const fileName = imageUrl.split('/').pop() || 'image.jpg';
    const fileUri = `${FileSystem.cacheDirectory}widget_${fileName}`;
    
    try {
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      return uri;
    } catch (error) {
      console.error('Error downloading image for widget:', error);
      return imageUrl;
    }
  }
}

export default new WidgetService();
```

## 13. Bảo mật

### 13.1 Lưu trữ Bảo mật

```typescript
// utils/secureStorage.ts
import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  },

  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};
```

### 13.2 Xác thực Sinh trắc học

```typescript
// utils/biometricAuth.ts
import * as LocalAuthentication from 'expo-local-authentication';

export const biometricAuth = {
  async isBiometricAvailable(): Promise<boolean> {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  },

  async authenticate(promptMessage: string = 'Authenticate to continue'): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use passcode',
      });
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  },
};
```

## 14. Hiệu suất

### 14.1 Tối ưu hóa Render

- **React.memo**: Tránh render không cần thiết
- **useCallback/useMemo**: Tối ưu hóa hàm và giá trị
- **VirtualizedList**: Hiển thị danh sách dài

### 14.2 Lazy Loading

- **Dynamic Imports**: Tải component khi cần
- **React Suspense**: Hiển thị fallback khi loading

### 14.3 Image Optimization

- **Caching**: Lưu trữ ảnh đã tải
- **Resizing**: Thay đổi kích thước ảnh phù hợp
- **Progressive Loading**: Tải ảnh dần dần

## 15. Triển khai

### 15.1 Expo EAS Build

```json
// eas.json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABC123"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json"
      }
    }
  }
}
```

### 15.2 App Configuration

```json
// app.json
{
  "expo": {
    "name": "Locket Clone",
    "slug": "locket-clone",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.locketclone.app",
      "buildNumber": "1.0.0",
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera to take photos to share with friends.",
        "NSPhotoLibraryUsageDescription": "This app uses the photo library to select photos to share with friends.",
        "NSPhotoLibraryAddUsageDescription": "This app saves photos to your photo library.",
        "NSContactsUsageDescription": "This app uses your contacts to help you find friends."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.locketclone.app",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "READ_CONTACTS"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera."
        }
      ],
      [
        "expo-media-library",
        {
          "photosPermission": "Allow $(PRODUCT_NAME) to access your photos.",
          "savePhotosPermission": "Allow $(PRODUCT_NAME) to save photos.",
          "isAccessMediaLocationEnabled": true
        }
      ],
      [
        "expo-contacts",
        {
          "contactsPermission": "Allow $(PRODUCT_NAME) to access your contacts."
        }
      ],
      "expo-router"
    ],
    "scheme": "locketclone",
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

## 16. Kết luận

Thiết kế frontend này cung cấp một nền tảng vững chắc cho ứng dụng Locket Clone, với kiến trúc component-based rõ ràng, state management hiệu quả và tích hợp với native widgets. Việc sử dụng TypeScript giúp phát triển an toàn hơn với kiểm tra kiểu dữ liệu tĩnh, trong khi React Native và Expo cung cấp một framework linh hoạt và mạnh mẽ cho ứng dụng di động đa nền tảng. Tích hợp với Firebase cho lưu trữ ảnh, thông báo đẩy và đồng bộ hóa dữ liệu giúp đơn giản hóa việc triển khai các tính năng phức tạp.
