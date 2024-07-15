import { Box, Modal, Slide } from "@mui/material";
import { NextPage } from "next";
import "./styles.scss";
import CustomLogo from "@/components/common/CustomIcons";
import {
  BACK_ICON,
  STARKNET_LOGO,
  USDC_LOGO,
} from "@/components/helpers/icons";

interface Props {
  open: boolean;
  status: string;
  event: string;
  date: string;
  amount: string;
  prediction: string;
  handleClose: () => void;
}

const DetailsModal: NextPage<Props> = ({
  open,
  handleClose,
  status,
  event,
  date,
  amount,
  prediction,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="DetailsModalContainer">
        <Slide in={open} direction="up">
          <Box className="DetailsWrapper">
            <Box onClick={handleClose} className="BackBtn">
              <Box className="BackIcon">
                <CustomLogo src={BACK_ICON} />
              </Box>
              <span>Back</span>
            </Box>
            <Box className="DetailCard">
              <Box className="DetailRow">
                <span className="RowLabel">Status</span>
                <span className="RowData">{status}</span>
              </Box>
              <Box className="DetailRow">
                <span className="RowLabel">Event</span>
                <span className="RowData">{event}</span>
              </Box>
              <Box className="DetailRow">
                <span className="RowLabel">Date Placed</span>
                <span className="RowData">{date}</span>
              </Box>
              <Box className="DetailRow">
                <span className="RowLabel">Staked Amount</span>
                <span className="RowData">
                  <Box className="Logo">
                    <CustomLogo src={USDC_LOGO} />
                  </Box>
                  <span className="LogoText">{amount}</span>
                </span>
              </Box>
              <Box className="DetailRow">
                <span className="RowLabel">Prediction</span>
                <span className="RowData">
                  <span className="Green">{prediction}</span>
                </span>
              </Box>
            </Box>
          </Box>
        </Slide>
      </Box>
    </Modal>
  );
};

export default DetailsModal;
