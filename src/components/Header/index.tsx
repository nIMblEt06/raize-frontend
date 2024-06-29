import { NextPage } from "next";
import "./styles.scss";
import { motion } from "framer-motion";
import CustomLogo from "../common/CustomIcons";
import HeaderLink from "./HeaderLink";
import WalletButtons from "./WalletButtons";

interface Props {}

const Header: NextPage<Props> = ({}) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="Header-Wrapper"
    >
      <div className="Header-LogoContainer">
        <div className="Header-Logo">
          <CustomLogo src="/assets/logos/raizelogo.svg" />
        </div>
      </div>
      <div className="Header-LinksContainer">
        <HeaderLink
          link="/"
          whiteIcon="/assets/icons/homeicon-white.svg"
          coloredIcon="/assets/icons/homeicon.svg"
          linkCTA="Home"
        />
        <HeaderLink
          link="/my-bets"
          whiteIcon="/assets/icons/bets-white.svg"
          coloredIcon="/assets/icons/bets.svg"
          linkCTA="My Bets"
        />
      </div>
      <div className="Header-ButtonsContainer">
        <WalletButtons />
      </div>
    </motion.div>
  );
};

export default Header;
