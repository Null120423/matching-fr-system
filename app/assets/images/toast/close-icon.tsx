import * as React from "react";
import Svg, { Path } from "react-native-svg";
const CloseIcon = (props: any) => (
  <Svg
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M11 1.00004L1 11M0.999958 1L10.9999 11"
      stroke={props?.color || "#979FA9"}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
export default CloseIcon;
