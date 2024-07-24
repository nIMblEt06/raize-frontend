import { NextPage } from "next";
import "./styles.scss";

import { useConnect } from "@starknet-react/core";

import { Box, Grow, Modal, Slide, Zoom } from "@mui/material";
import CustomLogo from "@/components/common/CustomIcons";
import { CROSS_ICON, RAIZE_LOGO } from "@/components/helpers/icons";
import WalletButton from "./WalletButton";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const WalletModal: NextPage<Props> = ({ open, handleClose }) => {
  const { connectors } = useConnect();
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>
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
                      // name={connector.name}
                      connector={connector}
                    />
                  ))}
              </Box>
            </Box>
          </Grow>
        </Box>
        <Box className="WalletModal-MobileContainer">
          <Slide in={open} direction="up">
            <Box className="WalletModal-Wrapper">
              <Box className="LogoContainer">
                <Box className="Logo">
                  <CustomLogo src={RAIZE_LOGO} />
                </Box>
                <span className="Heading">Connect Wallet</span>
              </Box>
              <Box className="WalletModal-ButtonContainer">
                {connectors &&
                  connectors.map((connector) => (
                    <WalletButton
                      key={connector.id}
                      // name={connector.name}
                      connector={connector}
                    />
                  ))}
              </Box>
            </Box>
          </Slide>
        </Box>
      </>
    </Modal>
  );
};

export default WalletModal;
