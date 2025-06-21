import * as React from "react";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
const WarningIcon = (props: any) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={24} height={24} rx={6} fill="url(#paint0_linear_6_125)" />
    <Path d="M12 9V14" stroke="white" strokeWidth={1.5} strokeLinecap="round" />
    <Circle cx={12} cy={17} r={1} fill="white" />
    <Defs>
      <LinearGradient
        id="paint0_linear_6_125"
        x1={12}
        y1={0}
        x2={12}
        y2={24}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#DBA948" />
        <Stop offset={0.0001} stopColor="#FFC46B" />
        <Stop offset={1} stopColor="#FFA318" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default WarningIcon;
