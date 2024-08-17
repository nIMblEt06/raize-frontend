import { NextPage } from "next";
import "./styles.scss";

import { Box } from "@mui/material";
import CustomLogo from "@/components/common/CustomIcons";
import { Connector, useConnect } from "@starknet-react/core";
import {
  ARGENT_LOGO,
  ARGENT_MOBILE_LOGO,
  BRAAVOS_LOGO,
} from "@/components/helpers/icons";

interface Props {
  // name: string;
  connector: Connector;
}

const WalletButton: NextPage<Props> = ({ connector }) => {
  const { connect } = useConnect();
  const handleConnect = async () => {
    await connect({ connector });
  };

  const getLogo = () => {
    switch (connector.id) {
      case "argentX":
        return ARGENT_LOGO;
      case "argentWebWallet":
        return ARGENT_MOBILE_LOGO;
      case "argentMobile":
        return ARGENT_MOBILE_LOGO;
      case "braavos":
        return BRAAVOS_LOGO;
      default:
        return "";
    }
  };

  const getName = () => {
    switch (connector.id) {
      case "argentX":
        return "Argent X";
      case "argentWebWallet":
        return "Argent Web";
      case "argentMobile":
        return "Argent Mobile";
      case "braavos":
        return "Braavos";
      default:
        return "";
    }
  };

  return (
    <Box className='WalletButton' onClick={handleConnect}>
      <Box className='WalletLogo'>{<CustomLogo src={getLogo()} />}</Box>
      <span className='WalletName'>{getName()}</span>
    </Box>
  );
};

export default WalletButton;
