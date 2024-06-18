import { NextPage } from "next";

interface Props {
  src: string;
}

const CustomLogo: NextPage<Props> = ({ src }) => {
  return (
    <>
      <img
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        width={0}
        height={0}
        src={src}
        alt="raize"
      />
    </>
  );
};

export default CustomLogo;
