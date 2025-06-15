// services/users.ts

export interface User {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  compatibility: number;
  interests: string[];
  bio: string;
  activities: string[];
  freeTime: string;
  gender?: "Nam" | "Nữ" | "Khác";
  friendsCount?: number;
  activitiesCount?: number;
  recentActivities?: { id: number; title: string; date: string }[];
  isPremium?: boolean;
}

const mockUsersData: User[] = [
  {
    id: "user1",
    name: "Minh Anh",
    age: 25,
    location: "Hà Nội",
    avatar:
      "https://hoseiki.vn/wp-content/uploads/2025/03/gai-xinh-tu-suong-28.jpg",
    compatibility: 85,
    interests: ["Yoga", "Cafe", "Đọc sách", "Du lịch"],
    bio: "Yêu thích khám phá những quán cafe nhỏ và đọc sách vào cuối tuần",
    activities: ["Yoga buổi sáng", "Cafe cuối tuần", "Đi bộ công viên"],
    freeTime: "Cuối tuần, tối thứ 3-5",
    gender: "Nữ",
  },
  {
    id: "user2",
    name: "Hoàng Nam",
    age: 28,
    location: "TP.HCM",
    avatar: "https://via.placeholder.com/300/ADD8E6/FFFFFF?text=HN",
    compatibility: 92,
    interests: ["Thể thao", "Âm nhạc", "Nấu ăn", "Phim"],
    bio: "Đam mê thể thao và khám phá ẩm thực mới",
    activities: ["Chạy bộ", "Gym", "Nấu ăn"],
    freeTime: "Sáng sớm, tối sau 7h",
    gender: "Nam",
  },
  {
    id: "user3",
    name: "Thu Hà",
    age: 24,
    location: "Đà Nẵng",
    avatar: "https://via.placeholder.com/300/90EE90/FFFFFF?text=TH",
    compatibility: 78,
    interests: ["Nhiếp ảnh", "Du lịch", "Âm nhạc", "Nghệ thuật"],
    bio: "Nhiếp ảnh gia nghiệp dư, thích khám phá những địa điểm mới",
    activities: ["Chụp ảnh", "Tham quan bảo tàng", "Concert"],
    freeTime: "Cuối tuần, chiều thứ 6",
    gender: "Nữ",
  },
];

export const fetchUsers = async (filters?: {
  query?: string;
  activity?: string;
  location?: string;
  minAge?: number;
  maxAge?: number;
  gender?: string;
}): Promise<User[]> => {
  let filtered = [...mockUsersData];

  if (filters) {
    if (filters.query) {
      const lowerCaseQuery = filters.query.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerCaseQuery) ||
          user.interests.some((interest) =>
            interest.toLowerCase().includes(lowerCaseQuery)
          )
      );
    }
    if (filters.activity) {
      const lowerCaseActivity = filters.activity.toLowerCase();
      filtered = filtered.filter((user) =>
        user.activities.some((act) =>
          act.toLowerCase().includes(lowerCaseActivity)
        )
      );
    }
    if (filters.location) {
      const lowerCaseLocation = filters.location.toLowerCase();
      filtered = filtered.filter((user) =>
        user.location.toLowerCase().includes(lowerCaseLocation)
      );
    }
    if (filters.minAge) {
      filtered = filtered.filter((user) => user.age >= filters.minAge!);
    }
    if (filters.maxAge) {
      filtered = filtered.filter((user) => user.age <= filters.maxAge!);
    }
    if (filters.gender) {
      filtered = filtered.filter(
        (user) => user.gender?.toLowerCase() === filters.gender?.toLowerCase()
      );
    }
  }

  return filtered;
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  return mockUsersData.find((user) => user.id === id);
};

export const updateProfile = async (
  userId: string,
  updatedData: Partial<User>
): Promise<User> => {
  const userIndex = mockUsersData.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    mockUsersData[userIndex] = { ...mockUsersData[userIndex], ...updatedData };
    return mockUsersData[userIndex];
  }
  throw new Error("User not found");
};

export const fetchMyProfile = async (): Promise<User> => {
  return {
    id: "myProfile123",
    name: "Bạn", // Representing the current user
    age: 28,
    location: "Hà Nội",
    bio: "Đam mê lập trình, thể thao, và khám phá những điều mới mẻ. Luôn sẵn sàng cho những thử thách!",
    avatar: "https://via.placeholder.com/300/A0A0A0/FFFFFF?text=ME",
    compatibility: 99, // High compatibility for self!
    interests: ["Lập trình", "Bóng đá", "Du lịch", "Đọc sách", "Cà phê"],
    activities: [
      "Code marathon",
      "Đá bóng cuối tuần",
      "Khám phá quán cà phê mới",
    ],
    freeTime: "Tối các ngày trong tuần, cuối tuần.",
    gender: "Nam",
    friendsCount: 45,
    activitiesCount: 18,
    recentActivities: [
      { id: 1, title: "Chạy bộ sáng", date: "Hôm qua" },
      { id: 2, title: "Cafe cùng bạn", date: "Thứ 7" },
    ],
    isPremium: true, // Example of premium status
  };
};
export const MOCK_DISCOVER_USERS = [
  {
    id: "user-1",
    name: "Minh Anh",
    age: 25,
    location: "Hà Nội",
    avatar:
      "https://hoseiki.vn/wp-content/uploads/2025/03/gai-xinh-tu-suong-28.jpg",
    compatibility: 85,
    interests: ["Yoga", "Cafe", "Đọc sách", "Du lịch"],
    bio: "Yêu thích khám phá những quán cafe nhỏ và đọc sách vào cuối tuần",
    activities: ["Yoga buổi sáng", "Cafe cuối tuần", "Đi bộ công viên"],
    freeTime: "Cuối tuần, tối thứ 3-5",
  },
  {
    id: "user-2",
    name: "Quỳnh Hoa",
    age: 23,
    location: "TP. Hồ Chí Minh",
    avatar:
      "https://ngocdiep.xyz/wp-content/uploads/2023/12/anh-gai-xinh-dep-viet-nam-cute-de-thuong-va-sexy-2k-019.jpg",
    compatibility: 78,
    interests: ["Âm nhạc", "Nấu ăn", "Điện ảnh"],
    bio: "Đam mê những giai điệu Indie và khám phá ẩm thực đường phố",
    activities: ["Nghe nhạc sống", "Thử món mới", "Xem phim tài liệu"],
    freeTime: "Tối thứ 4, cuối tuần",
  },
  {
    id: "user-3",
    name: "Hoàng Long",
    age: 28,
    location: "Đà Nẵng",
    avatar:
      "https://thieunien.vn/wp-content/uploads/2023/07/anh-trai-dep-ngau-so-vo-dep.jpg",
    compatibility: 92,
    interests: ["Thể thao", "Công nghệ", "Game"],
    bio: "Luôn tìm kiếm những trải nghiệm mới và thử thách bản thân",
    activities: ["Chơi bóng đá", "Code", "Đánh game online"],
    freeTime: "Tối thứ 2-6, cuối tuần",
  },
  {
    id: "user-4",
    name: "Lan Hương",
    age: 26,
    location: "Hải Phòng",
    avatar:
      "https://www.elle.vn/wp-content/uploads/2016/11/17/cach-chup-anh-dep-bang-dien-thoai-thong-minh.jpg",
    compatibility: 65,
    interests: ["Vẽ tranh", "Thiết kế thời trang", "Thú cưng"],
    bio: "Thích sáng tạo và dành thời gian bên những người bạn bốn chân",
    activities: ["Vẽ", "May vá", "Dắt chó đi dạo"],
    freeTime: "Sáng cuối tuần",
  },
  {
    id: "user-5",
    name: "Quang Minh",
    age: 29,
    location: "Cần Thơ",
    avatar:
      "https://img.meta.com.vn/img/thumb_width700/uploads/master/2021/04/hinh-anh-trai-dep-anime-dep-nhat-1.jpg",
    compatibility: 70,
    interests: ["Câu cá", "Làm vườn", "Du lịch bụi"],
    bio: "Tìm thấy sự bình yên ở thiên nhiên và những chuyến đi không kế hoạch",
    activities: ["Đi câu", "Trồng cây", "Đi phượt"],
    freeTime: "Bất cứ khi nào rảnh",
  },
];

export async function fetchDiscoverUsers() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DISCOVER_USERS);
    }, 500);
  });
}
export async function updateMyProfile(profileData: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock API: Profile updated successfully!", profileData);
      resolve({ success: true, updatedData: profileData });
    }, 500);
  });
}
