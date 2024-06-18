import { NextPage } from "next";
import "./styles.scss";

import CustomLogo from "@/components/common/CustomIcons";

interface Props {
  category: string;
  categoryLogo: string;
  categoryName: string;
  cardBgColor: string;
}

const BetHeroCard: NextPage<Props> = ({
  category,
  categoryLogo,
  categoryName,
  cardBgColor,
}) => {
  return (
    <div className="BetHeroCard" style={{ background: cardBgColor }}>
      <div className="Background-Card"></div>
      <div className="BetHeroCard-HeadingWrapper">
        <div className="BetHeroCard-HeadingContainer">
          <div className="Category">{category}</div>
          <div className="Bet-Details">
            <div className="Bet-Logo">
              <CustomLogo src={categoryLogo} />
            </div>
            <span className="Bet-Name">{categoryName}</span>
          </div>
        </div>
        <div className="Bet-Heading">{categoryName}</div>
      </div>
      <div className="Predict-Btn">Predict Now</div>
    </div>
  );
};

export default BetHeroCard;
