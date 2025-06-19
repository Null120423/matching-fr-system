export interface UserDTO {
  id: string;
  username: string;
  email: string;
  gender?: string;
  dob?: string;
  avatarUrl?: string;
  favoriteActivities?: string[];
  availableTimeSlots?: string[];
  location?: string;
  bio?: string;
}
