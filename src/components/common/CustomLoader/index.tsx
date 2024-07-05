import { NextPage } from "next";
import { infinity } from "ldrs";

infinity.register();

interface Props {
  color: string;
  size: string;
}

const CustomLoader: NextPage<Props> = ({ color, size }) => {
  return (
    <l-infinity
      size={size}
      stroke="4"
      stroke-length="0.15"
      bg-opacity="0.1"
      speed="1.3"
      color={color}
    ></l-infinity>
  );
};

export default CustomLoader;
