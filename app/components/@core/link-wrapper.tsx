import { TouchableOpacity } from "react-native";

import { Link } from "expo-router";

function LinkWrapper({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <TouchableOpacity>
      <Link href={href as any}>{children}</Link>
    </TouchableOpacity>
  );
}

export default LinkWrapper;
