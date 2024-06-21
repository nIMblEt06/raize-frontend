import { NextPage } from "next";
import "./styles.scss";

import CustomLogo from "../common/CustomIcons";
import HeaderLink from "./HeaderLink";
import WalletButtons from "./WalletButtons";

interface Props {}

const Header: NextPage<Props> = ({}) => {
  return (
    <div className='Header-Wrapper'>
      <div className='Header-Logo'>
        <CustomLogo width={45} height={40} src='/assets/logos/raizelogo.svg' />
      </div>
      <div className='Header-LinksContainer'>
        <HeaderLink
          link='/'
          whiteIcon='/assets/icons/homeicon-white.svg'
          coloredIcon='/assets/icons/homeicon.svg'
          linkCTA='Home'
        />
        <HeaderLink
          link='/my-bets'
          whiteIcon='/assets/icons/bets-white.svg'
          coloredIcon='/assets/icons/bets.svg'
          linkCTA='My Bets'
        />
      </div>
      <WalletButtons />
    </div>
  );
};

export default Header;
