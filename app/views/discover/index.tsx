import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default"; // For loading/empty state
import { Colors } from "@/constants/Colors"; // Import Colors
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme
import { normalize, scale } from "@/helper/helpers";
import { fetchDiscoverUsers } from "@/services/users"; // Import fetchDiscoverUsers
import React, { useEffect, useState } from "react"; // Import useState, useEffect
import { Platform, StyleSheet, View } from "react-native"; // Import StyleSheet
import DiscoverItem from "./discover-item";

function DiscoverView() {
  const { theme } = useTheme(); // Lấy theme hiện tại
  const currentColors = Colors[theme || "light"]; // Lấy màu sắc tương ứng

  const [discoverUsers, setDiscoverUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // Để theo dõi card hiện tại

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const users = await fetchDiscoverUsers(); // Gọi mock API
        setDiscoverUsers(users as any[]);
      } catch (error) {
        console.error("Failed to fetch discover users:", error);
        // Xử lý lỗi (hiển thị thông báo cho người dùng)
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleSwipeLeft = (userId: string) => {
    console.log(`Passed user: ${userId}`);
    // Chuyển sang card tiếp theo
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleSwipeRight = (userId: string) => {
    console.log(`Liked user: ${userId}`);
    // Chuyển sang card tiếp theo
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const currentDiscoverUser = discoverUsers[currentIndex];

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: currentColors.background },
        ]}
      >
        <TextDefault style={{ color: currentColors.text }}>
          Đang tải người dùng...
        </TextDefault>
      </View>
    );
  }

  if (!currentDiscoverUser && !isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: currentColors.background },
        ]}
      >
        <TextDefault style={{ color: currentColors.text }}>
          Không còn người dùng nào để khám phá!
        </TextDefault>
        <Separator height={scale(20)} />
        <TextDefault style={{ color: currentColors.textSecondary }}>
          Hãy quay lại sau hoặc thử lại.
        </TextDefault>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: currentColors.background,
          padding: normalize(10),
        },
      ]}
    >
      <Separator height={Platform.OS === "ios" ? scale(60) : scale(10)} />
      {currentDiscoverUser && (
        <DiscoverItem
          key={currentDiscoverUser.id}
          data={currentDiscoverUser}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      )}
    </View>
  );
}

export default DiscoverView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
