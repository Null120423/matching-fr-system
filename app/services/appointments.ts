// services/appointments.ts

export interface Appointment {
  id: string;
  activity: string;
  time: string; // e.g., "2:00 PM Hôm nay"
  location: string;
  status: "pending" | "accepted" | "declined" | "cancelled"; // For invites
  type: "received" | "sent" | "upcoming" | "history"; // For classification in UI
  creator?: { name: string; avatar: string };
  participants?: { name: string; avatar: string }[];
  from?: string; // For received invites
  to?: string; // For sent invites
  with?: string; // For upcoming/history
  avatar?: string; // Avatar of the other person
  isCreator?: boolean;
}

const mockAppointmentsData: Appointment[] = [
  {
    id: "app1",
    activity: "Cà phê cuối tuần",
    time: "2:00 PM Hôm nay",
    location: "Quán X",
    status: "pending",
    type: "received",
    from: "Minh Anh",
    avatar: "https://via.placeholder.com/150/FFC0CB/FFFFFF?text=MA",
  },
  {
    id: "app2",
    activity: "Chạy bộ công viên",
    time: "9:00 AM Ngày mai",
    location: "Công viên Y",
    status: "pending",
    type: "received",
    from: "Hoàng Nam",
    avatar: "https://via.placeholder.com/150/ADD8E6/FFFFFF?text=HN",
  },
  {
    id: "app3",
    activity: "Thăm triển lãm",
    time: "3:00 PM Thứ Sáu",
    location: "Bảo tàng Z",
    status: "pending",
    type: "sent",
    to: "Thu Hà",
    avatar: "https://via.placeholder.com/150/90EE90/FFFFFF?text=TH",
    isCreator: true,
  },
  {
    id: "app4",
    activity: "Ăn tối",
    time: "7:00 PM Thứ Ba",
    location: "Nhà hàng A",
    status: "accepted",
    type: "upcoming",
    with: "Minh Anh",
    avatar: "https://via.placeholder.com/150/FFC0CB/FFFFFF?text=MA",
    participants: [
      {
        name: "Minh Anh",
        avatar: "https://via.placeholder.com/150/FFC0CB/FFFFFF?text=MA",
      },
      {
        name: "Bạn",
        avatar: "https://via.placeholder.com/150/C0C0C0/FFFFFF?text=B",
      },
    ],
  },
  {
    id: "app5",
    activity: "Đi xem phim",
    time: "8:00 PM Tuần trước",
    location: "Rạp B",
    status: "accepted",
    type: "history",
    with: "Hoàng Nam",
    avatar: "https://via.placeholder.com/150/ADD8E6/FFFFFF?text=HN",
  },
  {
    id: "app6",
    activity: "Yoga",
    time: "6:00 AM 2 ngày trước",
    location: "Phòng tập C",
    status: "declined",
    type: "history",
    with: "Mai Lan",
    avatar: "https://via.placeholder.com/150/C0C0C0/FFFFFF?text=ML",
  },
];

export const fetchAppointments = async (
  filterType: "received" | "sent" | "upcoming" | "history" | "all"
): Promise<Appointment[]> => {
  if (filterType === "all") {
    return mockAppointmentsData;
  }
  return mockAppointmentsData.filter((app) => app.type === filterType);
};

export const getAppointmentById = async (
  id: string
): Promise<Appointment | undefined> => {
  const appointment = mockAppointmentsData.find((app) => app.id === id);
  if (appointment) {
    // Add mock participants if not already present
    if (!appointment.participants) {
      appointment.participants = [
        {
          name:
            appointment.from ||
            appointment.with ||
            appointment.to ||
            "Người khác",
          avatar: appointment.avatar || "",
        },
        {
          name: "Bạn",
          avatar: "https://via.placeholder.com/150/C0C0C0/FFFFFF?text=B",
        },
      ];
    }
  }
  return appointment;
};

export const updateAppointmentStatus = async (
  id: string,
  newStatus: "accepted" | "declined" | "cancelled"
): Promise<Appointment> => {
  const appIndex = mockAppointmentsData.findIndex((app) => app.id === id);
  if (appIndex !== -1) {
    mockAppointmentsData[appIndex].status = newStatus;
    if (newStatus === "accepted") {
      mockAppointmentsData[appIndex].type = "upcoming"; // Move to upcoming if accepted
    } else if (newStatus === "declined" || newStatus === "cancelled") {
      mockAppointmentsData[appIndex].type = "history"; // Move to history
    }
    return mockAppointmentsData[appIndex];
  }
  throw new Error("Appointment not found");
};

export const createAppointment = async (
  newApp: Partial<Appointment>
): Promise<Appointment> => {
  const newId = `app${mockAppointmentsData.length + 1}`;
  const createdApp: Appointment = {
    id: newId,
    status: "pending",
    type: "sent",
    isCreator: true,
    activity: newApp.activity || "Hoạt động chưa xác định", // Ensure activity is always set
    ...newApp,
    time: newApp.time || "Thời gian chưa xác định", // Ensure time is always set
    location: newApp.location || "Địa điểm chưa xác định", // Ensure location is always set
  };
  mockAppointmentsData.push(createdApp);
  return createdApp;
};
