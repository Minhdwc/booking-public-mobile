// Token tạm trong RAM — api client đọc từ đây
let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setApiTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
}

export function clearApiTokens() {
  accessToken = null;
  refreshToken = null;
}

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken;
}

// Store đăng ký hàm này để client refresh token xong thì lưu vào SecureStore
type SaveTokensFn = (access: string, refresh: string) => Promise<void>;
let saveTokensFn: SaveTokensFn | null = null;

export function registerSaveTokens(fn: SaveTokensFn) {
  saveTokensFn = fn;
}

export async function notifyTokensRefreshed(access: string, refresh: string) {
  setApiTokens(access, refresh);
  await saveTokensFn?.(access, refresh);
}
