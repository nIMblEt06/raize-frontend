import { NextPage } from "next";
import "./styles.scss";

import { Box } from "@mui/material";

interface Props {
  message: string;
  subHeading?: string;
  hash?: string;
  chainId?: number;
}

const getExplorerLinkForAddress = (hash: string) => {
  return `https://voyager.online/tx/${hash}`;
};

const CustomToast: NextPage<Props> = ({ message, subHeading, hash }) => {
  const openViewTransaction = () => {
    if (hash) {
      window.open(getExplorerLinkForAddress(hash), "_blank");
    }
  };
  return (
    <Box className="Toast">
      <span className="Toast-Heading">{message}</span>
      <span className="Toast-SubHeading">{subHeading}</span>
      {hash && (
        <Box onClick={openViewTransaction} className="Toast-ViewBtn">
          View Transaction
        </Box>
      )}
    </Box>
  );
};

export default CustomToast;
