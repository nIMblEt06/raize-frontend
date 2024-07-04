import { NextPage } from "next";
import "./styles.scss";

import { Box } from "@mui/material";
import CustomLogo from "@/components/common/CustomIcons";
import { Connector, useConnect } from "@starknet-react/core";

interface Props {
  name: string;
  logo: string | undefined;
  connector: Connector;
}

const WalletButton: NextPage<Props> = ({ name, logo, connector }) => {
  const { connect } = useConnect();
  const handleConnect = async () => {
    await connect({ connector });
  };
  return (
    <Box className='WalletButton' onClick={handleConnect}>
      <Box className='WalletLogo'>{logo && <CustomLogo src={logo} />}</Box>
      <span className='WalletName'>{name}</span>
    </Box>
  );
};

export default WalletButton;
