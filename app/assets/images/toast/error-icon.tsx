import * as React from "react";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
const ErrorIcon = (props: any) => (
  <Svg
    width={props?.size || 24}
    height={props?.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={24} height={24} rx={6} fill="url(#paint0_linear_6_149)" />
    <Path
      d="M15 9.00002L9 15M8.99997 9L14.9999 15"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_6_149"
        x1={12}
        y1={0}
        x2={12}
        y2={24}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#E88B76" />
        <Stop offset={1} stopColor="#CA5048" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default ErrorIcon;
