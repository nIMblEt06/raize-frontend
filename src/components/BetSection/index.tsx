import { NextPage } from "next";
import { useEffect, useState } from "react";

import "./styles.scss";
import BetHeroCard from "./BetHeroCard";
import { CRICKET_LOGO, US_LOGO } from "../helpers/icons";
import Football from "/assets/images/football.png";
import BetCard from "./BetCard";

interface Props {}

const tabList = [
  {
    tabName: "Trending",
    tabId: "trd",
  },
  {
    tabName: "Crypto",
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

const betsList = [
  {
    betname: "US Elections",
    betLogo: US_LOGO,
    duration: "1",
    betHeading: "Trump vs Biden",
    betSubHeading: "Will Trump emerge victorious again?",
  },
];

const BetSection: NextPage<Props> = ({}) => {
  const [activeTab, setActiveTab] = useState<string>("trd");

  useEffect(() => {
    setActiveTab("trd");
  }, []);
  return (
    <div className='BetSection'>
      <div className='BetSection-Hero'>
        <div className='BetSection-HeroCard'>
          <BetHeroCard
            category='Sports'
            categoryLogo={CRICKET_LOGO}
            categoryName='Cricket World Cup'
            cardBgColor='linear-gradient(67.58deg, #E20000 -0.96%, #9B3838 78.06%)'
            image='/assets/images/kohli.png'
          />
        </div>
        <div className='BetSection-HeroCard'>
          <BetHeroCard
            category='Sports'
            categoryLogo={CRICKET_LOGO}
            categoryName='UEFA Euros 2024'
            cardBgColor='linear-gradient(90deg, #143CDA 0%, #0D268A 100%)'
            image='/assets/images/football.png'
          />
        </div>
      </div>
      <div className='BetSection-CardWrapper'>
        <div className='Tabs-Section'>
          {tabList.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveTab(item.tabId);
              }}
              className={activeTab === item.tabId ? "Tab-Active" : "Tab"}
            >
              {item.tabName}
            </div>
          ))}
        </div>
        <div className='BetCard-Wrapper'>
          {betsList.map((item, index) => (
            <div key={index} className='BetCard-Container'>
              <BetCard
                name={item.betname}
                logo={item.betLogo}
                duration={item.duration}
                heading={item.betHeading}
                subHeading={item.betSubHeading}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BetSection;
