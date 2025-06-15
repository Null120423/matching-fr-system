import * as React from "react";
import Svg, { Path } from "react-native-svg";
const HomeIcon = (props: any) => (
  <Svg
    width={26}
    height={25}
    viewBox="0 0 26 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M10.8331 2.93307L3.62587 8.70507C2.81467 9.34987 2.29467 10.7123 2.47147 11.7315L3.85467 20.0099C4.10427 21.4867 5.51867 22.6827 7.01627 22.6827H18.6643C20.1515 22.6827 21.5763 21.4763 21.8259 20.0099L23.2091 11.7315C23.3755 10.7123 22.8555 9.34987 22.0547 8.70507L14.8475 2.94347C13.7347 2.04907 11.9355 2.04907 10.8331 2.93307Z"
      fill={props?.color || "#191919"}
    />
    <Path
      d="M12.8405 18.7201V15.6001"
      stroke={props?.color || "#191919"}
      strokeWidth={1.56}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default HomeIcon;
