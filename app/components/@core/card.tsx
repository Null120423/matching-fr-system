import { StyleSheet, TouchableOpacity } from "react-native";
interface CardProps {
  children: React.ReactNode;
  style?: object;
  onClick?: () => void;
}
const Card: React.FC<CardProps> = ({ children, style, onClick }) => {
  const cardStyles: any = [styles.cardBase];
  if (style) {
    cardStyles.push(style);
  }

  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={!onClick}
      style={cardStyles}
      activeOpacity={onClick ? 0.7 : 1}
    >
      {children}
    </TouchableOpacity>
  );
};
const scale = (size: number) => size;

const styles = StyleSheet.create({
  cardBase: {
    backgroundColor: "white",
    borderRadius: scale(20),
    shadowColor: "#000", // shadow-lg
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12.0,
    elevation: 8,
  },
});
export default Card;
