# Sprint 1 — Venues API + Test Spec

**Nhánh:** `feat/venues`  
**Ngày:** 2026-07-28  
**Phạm vi:** `GET /venues` → Explore + Home, bỏ mock, lọc `active`

---

## Precondition

- [ ] BE chạy tại `EXPO_PUBLIC_API_URL` (Android emulator: `http://10.0.2.2:3001/api/v1`)
- [ ] Có ít nhất 1 venue `status = active` trên DB (đổi thủ công nếu cần)
- [ ] App build được: `npx tsc --noEmit` pass

---

## Test cases

| ID | Case | Loại | Các bước | Kỳ vọng | Kết quả |
|----|------|------|----------|---------|---------|
| S1-01 | Load Explore | UI/UX | Mở tab **Khám phá** | Skeleton → danh sách venue từ API | |
| S1-02 | Ẩn venue pending | Logic | DB có venue `pending` + `active` | Chỉ `active` hiển thị | |
| S1-03 | Empty state | UI/UX | DB không có venue active | Màn empty + copy hướng dẫn | |
| S1-04 | Lỗi mạng | UX | Tắt BE hoặc sai API URL | Thông báo lỗi + nút **Thử lại** | |
| S1-05 | Pull to refresh | UX | Kéo refresh trên Explore | Gọi lại API, list cập nhật | |
| S1-06 | Card content | UI | Venue active có courts | Tên, môn, giá VND, địa chỉ rút gọn, rating hoặc **Mới** | |
| S1-07 | Ảnh cover | UI | Venue có/không `venueImages` | Có ảnh hoặc placeholder 🏟️ | |
| S1-08 | Search debounce | Logic | Gõ tên venue vào ô tìm | Sau ~300ms list lọc theo API `search` | |
| S1-09 | Home gợi ý | UI | Mở tab **Trang chủ** | Section “Sân gần bạn” tối đa 3 venue API | |
| S1-10 | Quick action | Navigation | Bấm **Tìm sân** trên Home | Chuyển sang tab Explore | |
| S1-11 | Bấm venue card | Navigation | Bấm card trên Explore/Home | Mở placeholder `/venues/[id]` (Sprint 3 thay full detail) | |
| S1-12 | Guest browse | Auth | Chưa login, mở Explore | Vẫn xem được list venue | |

---

## Ghi chú kỹ thuật

- Feature: `src/features/venues/` (`api`, `type`, `mapper`, `use-venues`)
- React Query key: `queryKeys.venue.list(params)`
- Mapper lọc `status === 'active'` trước khi render
- Filter môn (chip) vẫn client-side — Sprint 2 thay bằng `GET /sports`

---

## Sign-off

| | |
|---|---|
| **Tester** | |
| **Ngày test** | |
| **Tất cả case PASS** | [ ] Có / [ ] Không |
| **Ghi chú** | |
