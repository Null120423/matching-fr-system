import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
const NotificationIcon = (props: any) => (
  <Svg
    fill={props?.color || "#ffff"}
    height="24px"
    width="24px"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512 512"
    xmlSpace="preserve"
    {...props}
  >
    <G>
      <G>
        <G>
          <Path d="M429.224,363.395l-45.434-64.286V173.516c0-64.102-47.444-117.325-109.06-126.415V18.732 C274.73,8.387,266.343,0,255.999,0c-10.345,0-18.732,8.387-18.732,18.732V47.1c-61.616,9.09-109.061,62.313-109.061,126.415 v125.594l-45.433,64.286c-8.746,12.373,0.111,29.542,15.296,29.542h315.86C429.081,392.938,437.99,375.794,429.224,363.395z" />
          <Path d="M255.999,406.313c-29.138,0-52.843,23.704-52.843,52.842c0,29.138,23.706,52.845,52.843,52.845 c29.138,0,52.842-23.706,52.842-52.843C308.841,430.019,285.136,406.313,255.999,406.313z" />
        </G>
      </G>
    </G>
  </Svg>
);
export default NotificationIcon;
