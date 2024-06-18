import { NextPage } from "next";
import { useEffect, useState } from "react";

import "./styles.scss";
import BetHeroCard from "./BetHeroCard";
import { CRICKET_LOGO } from "../helpers/icons";
import BetCard from "./BetCard";

interface Props {}

const tabList = [
  {
    tabName: "Trending",
    tabId: "trd",
  },
  {
    tabName: "Crypto Market",
    tabId: "cmr",
  },
  {
    tabName: "Cricket",
    tabId: "crk",
  },
  {
    tabName: "Pop Culture",
    tabId: "pcl",
  },
  {
    tabName: "Politics",
    tabId: "pol",
  },
];

const BetSection: NextPage<Props> = ({}) => {
  const [activeTab, setActiveTab] = useState<string>("trd");

  useEffect(() => {
    setActiveTab("trd");
  }, []);
  return (
    <div className="BetSection">
      <div className="BetSection-Hero">
        <div className="BetSection-HeroCard">
          <BetHeroCard
            category="Sports"
            categoryLogo={CRICKET_LOGO}
            categoryName="Cricket World Cup"
            cardBgColor="linear-gradient(67.58deg, #E20000 -0.96%, #9B3838 78.06%)"
          />
        </div>
        <div className="BetSection-HeroCard">
          <BetHeroCard
            category="Sports"
            categoryLogo={CRICKET_LOGO}
            categoryName="Cricket World Cup"
            cardBgColor="linear-gradient(90deg, #143CDA 0%, #0D268A 100%)"
          />
        </div>
      </div>
      <div className="BetSection-CardWrapper">
        <div className="Tabs-Section">
          {tabList.map((item) => (
            <div
              onClick={() => {
                setActiveTab(item.tabId);
              }}
              className={activeTab === item.tabId ? "Tab-Active" : "Tab"}
            >
              {item.tabName}
            </div>
          ))}
        </div>
        <div className="BetCard-Wrapper">
          <div className="BetCard-Container">
            <BetCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetSection;
