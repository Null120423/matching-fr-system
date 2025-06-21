const prefix = "/gateway";
function buildUrlWithParams(
  baseUrl: string,
  params?: Record<string, any>
): string {
  if (!params) return baseUrl;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]: any) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export const ENDPOINTS = {
  AUTH: {
    SIGNIN: `${prefix}/auth/sign-in`,
    SIGNUP: `${prefix}/auth/sign-up`,
    REFRESH_TOKEN: `${prefix}/auth/refresh-token`,
  },
  NOTIFICATION: {
    GET_NOTIFICATIONS: `${prefix}/notification`,
    CREATE_NOTIFICATIONS: `${prefix}/notification`,
    UNREAD_COUNT: `${prefix}/notification/unread-count`,
    DETAIL: (id: string) => `${prefix}/notification/${id}`,
    MARK_AS_READ: (id: string) => `${prefix}/notification/${id}/read`,
  },
  MATCHING: {
    SWIPE: (userId: string, params?: Record<string, any>) =>
      buildUrlWithParams(`${prefix}/matching-upload/${userId}/swipe`, params),
    FRIEND_REQUEST: (userId: string) =>
      `${prefix}/matching-upload/${userId}/friend-request`,
    UPDATE_STATUS_FRIEND_REQUEST: (userId: string) =>
      `${prefix}/matching-upload/friend-request/${userId}/status`,
    GET_FRIEND_REQUEST: (param: Record<string, any>) =>
      buildUrlWithParams(
        `${prefix}/matching-upload/users/friend-requests`,
        param
      ),
  },
  UPLOAD: {
    UPLOAD_AVATAR: `${prefix}/matching-upload/uploads/avatar`,
  },
  APPOINTMENT: {
    CREATE: `${prefix}/appointments`,
    DETAIL: (id: string, params?: Record<string, any>) =>
      buildUrlWithParams(`${prefix}/appointments/${id}`, params),
    UPDATE_STATUS: (id: string) => `${prefix}/appointments/${id}/status`,
    GET_APPOINTMENTS: (params?: Record<string, any>) =>
      buildUrlWithParams(`${prefix}/appointments`, params),
  },
  USER: {
    GET_SELF_PROFILE: `${prefix}/users/me`,
    GET_PROFILE: (userId: string) => `${prefix}/users/${userId}`,
    UPDATE_PROFILE: `${prefix}/users/me`,
    DISCOVER: (params?: Record<string, any>) =>
      buildUrlWithParams(`${prefix}/users/discover`, params),
  },
};
