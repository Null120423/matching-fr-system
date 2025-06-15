import { normalize } from "@/helper/helpers";
import React, { FC, ReactNode } from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";
import { styleGlobal } from "./styles";
interface Props extends RNTextProps {
  children: ReactNode;
  bold?: boolean;
  center?: boolean;
  numberOfLine?: number;
  size?: number;
  underline?: boolean;
  capitalize?: boolean;
  lineThrough?: boolean;
  color?: string;
  isItalic?: boolean;
}

const TextDefault: FC<Props> = ({
  children,
  style,
  bold = false,
  size = normalize(12),
  underline = false,
  capitalize = false,
  lineThrough = false,
  color,
  isItalic,
  center,
  ...rest
}) => {
  return (
    <RNText
      numberOfLines={rest.numberOfLines}
      style={[
        styleGlobal.text,
        !bold && { fontFamily: "Montserrat-Light" },
        underline && {
          textDecorationLine: "underline",
        },
        lineThrough && {
          textDecorationLine: "line-through",
        },
        capitalize && {
          textTransform: "capitalize",
        },
        center && styleText.center,
        {
          fontSize: size,
          color: color,
        },
        isItalic && { fontStyle: "italic" },
        style,
        bold && { fontFamily: "Montserrat-Medium", fontWeight: "bold" },
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export const Title: FC<Props> = ({ children, style, bold, ...rest }) => {
  return (
    <RNText
      numberOfLines={rest.numberOfLines}
      style={[
        styleText.title,
        bold && styleText.bold,
        rest.center && styleText.center,
        style,
        {
          fontFamily: "Montserrat-Light",
        },
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const styleText = StyleSheet.create({
  center: { textAlign: "center" },
  bold: {
    fontWeight: "bold",
  },
  title: {
    fontSize: normalize(18),
    fontWeight: "bold",
  },
});
export default TextDefault;
