import { NextPage } from "next";
import "./styles.scss";

import { Box } from "@mui/material";
import CustomLogo from "@/components/common/CustomIcons";

interface Props {
  name: string;
  logo: string | undefined;
  handleConnectWallet: () => void;
}

const WalletButton: NextPage<Props> = ({ name, logo, handleConnectWallet }) => {
  return (
    <Box className="WalletButton">
      <Box className="WalletLogo">{logo && <CustomLogo src={logo} />}</Box>
      <span className="WalletName">{name}</span>
    </Box>
  );
};

export default WalletButton;
