import { NextPage } from "next";
import "./styles.scss";

import { Box } from "@mui/material";
import CustomLogo from "@/components/common/CustomIcons";
import { Connector, useConnect } from "@starknet-react/core";

interface Props {
  // name: string;
  logo: string | undefined;
  connector: Connector;
}

const WalletButton: NextPage<Props> = ({ logo, connector }) => {
  const { connect } = useConnect();
  const handleConnect = async () => {
    await connect({ connector });
  };

  console.log(connector.id, logo);

  return (
    <Box className='WalletButton' onClick={handleConnect}>
      {connector.id == "argentWebWallet" || connector.id == "argentMobile" ? (
        <div
          className='DangerWalletLogo'
          style={{ width: "20px", height: "20px" }}
          dangerouslySetInnerHTML={{ __html: logo! }}
        />
      ) : (
        <Box className='WalletLogo'>{logo && <CustomLogo src={logo} />}</Box>
      )}
      <span className='WalletName'>{connector.id}</span>
    </Box>
  );
};

export default WalletButton;
