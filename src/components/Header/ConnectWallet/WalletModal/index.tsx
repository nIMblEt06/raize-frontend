import { NextPage } from "next";
import "./styles.scss";

import { useConnect } from "@starknet-react/core";

import { Box, Grow, Modal, Zoom } from "@mui/material";
import CustomLogo from "@/components/common/CustomIcons";
import { CROSS_ICON, RAIZE_LOGO } from "@/components/helpers/icons";
import WalletButton from "./WalletButton";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const WalletModal: NextPage<Props> = ({ open, handleClose }) => {
  const { connectors, connect } = useConnect();
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="WalletModal-Container">
        <Grow in={open}>
          <Box className="WalletModal-Wrapper">
            <Box onClick={handleClose} className="WalletModal-CloseBtn">
              <CustomLogo src={CROSS_ICON} />
            </Box>
            <Box className="WalletModal-DetailsContainer">
              <Box className="WalletModal-Logo">
                <CustomLogo src={RAIZE_LOGO} />
              </Box>
              <Box className="WalletModal-Details">
                <span className="Heading">Connect Wallet</span>
                <span className="Sub-Heading">
                  Now Place your bets directly without transferring it to a
                  local wallet.
                </span>
              </Box>
            </Box>
            <Box className="WalletModal-ButtonContainer">
              {connectors &&
                connectors.map((connector) => (
                  <WalletButton
                    key={connector.id}
                    logo={connector.icon.dark}
                    name={connector.name}
                    connector={connector}
                  />
                ))}
            </Box>
          </Box>
        </Grow>
      </Box>
    </Modal>
  );
};

export default WalletModal;