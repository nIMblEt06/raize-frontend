import { NextPage } from "next";
import { useEffect, useState } from "react";

import "./styles.scss";
import BetHeroCard from "./BetHeroCard";
import { CRICKET_LOGO, US_LOGO } from "../helpers/icons";
import BetCard from "./BetCard";
import {
  useContract,
  useContractRead,
  useContractWrite,
} from "@starknet-react/core";
import abi from "../../abi/ContractABI.json";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import { Market } from "../helpers/types";
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

const BetSection: NextPage<Props> = ({}) => {
  const [activeTab, setActiveTab] = useState<string>("trd");
  const [markets, setMarkets] = useState<Market[]>([]);

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  useEffect(() => {
    const getAllMarkets = () => {
      if (!contract) {
        return;
      }
      contract.getAllMarkets().then((res: any) => {
        setMarkets(res);
      });
    };
    getAllMarkets();
  }, []);

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
          {markets &&
            markets.map((item, index) => (
              <div key={index} className='BetCard-Container'>
                <BetCard
                  marketId={index + 1}
                  category={item.category}
                  logo={item.image}
                  duration={item.deadline}
                  heading={item.name}
                  betToken={item.betToken}
                  subHeading={item.description}
                  outcomes={item.outcomes}
                  moneyInPool={item.moneyInPool}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BetSection;
