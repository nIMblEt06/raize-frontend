import { NextPage } from "next";
import "./styles.scss";
import { Box, Modal } from "@mui/material";

import BetDetails from "./BetDetails";
import BetActions from "./BetActions";

interface Props {
  open: boolean;
  prediction: string;
  name: string;
  logo: string;
  duration: string;
  heading: string;
  subHeading: string;
  setPrediction: (prediction: string) => void;
  handleClose: () => void;
}

const BetModal: NextPage<Props> = ({
  open,
  handleClose,
  setPrediction,
  prediction,
  name,
  logo,
  duration,
  heading,
  subHeading,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0,0,0,0.9)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="BetModal">
        <BetDetails
          name={name}
          logo={logo}
          duration={duration}
          heading={heading}
          subHeading={subHeading}
        />
        <BetActions setPrediction={setPrediction} prediction={prediction} />
      </Box>
    </Modal>
  );
};

export default BetModal;
