import * as React from "react";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
const SuccessIcon = (props: any) => (
  <Svg
    width={props?.size || 24}
    height={props?.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={24} height={24} rx={6} fill="url(#paint0_linear_6_82)" />
    <Path
      d="M8.5 12.5L10.5 14.5L15.5 9.5"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_6_82"
        x1={12}
        y1={0}
        x2={12}
        y2={24}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#48CA93" />
        <Stop offset={1} stopColor="#48BACA" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SuccessIcon;
