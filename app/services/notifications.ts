// services/notifications.ts

export interface Notification {
  id: string;
  type:
    | "appointment_invite"
    | "system_update"
    | "like"
    | "appointment_accepted";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  details: any; // Can be specific interfaces per type later
}

const mockNotificationsData: Notification[] = [
  {
    id: "notif1",
    type: "appointment_invite",
    title: "Lời mời cà phê mới!",
    message: "Minh Anh đã gửi cho bạn lời mời hẹn cà phê vào cuối tuần.",
    time: "5 phút trước",
    isRead: false,
    details: {
      activity: "Cà phê cuối tuần",
      from: "Minh Anh",
      location: "Quán X",
      time: "2:00 PM Hôm nay",
    },
  },
  {
    id: "notif2",
    type: "system_update",
    title: "Cập nhật ứng dụng mới",
    message: "Ứng dụng đã có phiên bản 2.0 với nhiều tính năng hấp dẫn.",
    time: "1 giờ trước",
    isRead: false,
    details: {
      version: "2.0",
      features: ["Giao diện mới", "Tối ưu hiệu suất", "Thêm bộ lọc"],
    },
  },
  {
    id: "notif3",
    type: "like",
    title: "Có người thích bạn!",
    message: "Hoàng Nam đã thích hồ sơ của bạn.",
    time: "3 giờ trước",
    isRead: true,
    details: {
      user: "Hoàng Nam",
    },
  },
  {
    id: "notif4",
    type: "appointment_accepted",
    title: "Lời mời của bạn đã được chấp nhận!",
    message: "Thu Hà đã chấp nhận lời mời đi triển lãm của bạn.",
    time: "Hôm qua",
    isRead: true,
    details: {
      activity: "Thăm triển lãm",
      to: "Thu Hà",
      status: "accepted",
    },
  },
];

export const fetchNotifications = async (): Promise<Notification[]> => {
  return [...mockNotificationsData].sort((a, b) =>
    a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1
  ); // Unread first
};

export const getNotificationById = async (
  id: string
): Promise<Notification | undefined> => {
  return mockNotificationsData.find((notif) => notif.id === id);
};

export const markNotificationAsRead = async (
  id: string
): Promise<Notification> => {
  const notifIndex = mockNotificationsData.findIndex(
    (notif) => notif.id === id
  );
  if (notifIndex !== -1) {
    mockNotificationsData[notifIndex].isRead = true;
    return mockNotificationsData[notifIndex];
  }
  throw new Error("Notification not found");
};

export const getUnreadNotificationsCount = async (): Promise<number> => {
  return mockNotificationsData.filter((notif) => !notif.isRead).length;
};
