import { normalize } from "@/helper/helpers";
import { Platform, StyleSheet } from "react-native";

export const styleGlobal = StyleSheet.create({
  input: {
    borderRadius: normalize(15),
    padding: normalize(10),
    height: normalize(50),
  },
  icon: {
    width: normalize(25),
    height: normalize(25),
  },
  cardItem: {
    width: normalize(60),
    height: normalize(60),
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderStyle: "solid",
  },
  border: { borderWidth: 1, borderStyle: "solid" },
  borderTop: {
    borderTopWidth: 1,
    borderStyle: "solid",
  },
  text: {
    fontSize: normalize(12),
    fontWeight: "normal",
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: normalize(20),
    fontWeight: "bold",
  },
  separator: {
    height: 1,
  },
  centerChild: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#5451D6",
    shadowOffset: {
      width: -2,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: Platform.OS === "android" ? 2 : undefined,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#F86F6F",
    borderRadius: 100,
    zIndex: 10000,
    width: normalize(20),
    height: normalize(20),
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  btn: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    columnGap: 10,
    height: normalize(42),
    minWidth: normalize(42),
  },
});
