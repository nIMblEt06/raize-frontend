import { NextPage } from "next";
import "./styles.scss";
import { useAccount, useDisconnect } from "@starknet-react/core";

import { Box, Menu, MenuItem, MenuProps, alpha, styled } from "@mui/material";
import { MdOutlineFileCopy } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { enqueueSnackbar } from "notistack";
import { handleToast } from "@/components/helpers/functions";
import { ADDRESS_COPIED } from "@/components/helpers/toasts";

interface Props {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    background: "#101010",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "0px",
    },
    border: "1px solid #2b2b2b;",
    "& .MuiMenuItem-root": {
      transition: "all 0.2s ease-in",
      "&:hover": {
        background: "#202020",
      },
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const WalletDropdown: NextPage<Props> = ({ anchorEl, open, handleClose }) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <StyledMenu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      <MenuItem
        onClick={() => {
          navigator.clipboard.writeText(address!);
          handleToast(
            ADDRESS_COPIED.heading,
            ADDRESS_COPIED.subHeading,
            "info"
          );
          handleClose();
        }}
      >
        <Box className="DropdownItem">
          <span>
            <MdOutlineFileCopy />
          </span>
          Copy Address
        </Box>
      </MenuItem>
      <MenuItem
        onClick={() => {
          disconnect();
          handleClose();
        }}
      >
        <Box className="DropdownItem">
          <span>
            <HiOutlineLogout />
          </span>
          Disconnect
        </Box>
      </MenuItem>{" "}
    </StyledMenu>
  );
};

export default WalletDropdown;
