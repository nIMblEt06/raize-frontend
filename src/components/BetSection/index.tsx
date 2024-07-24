import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

import "./styles.scss";
import BetHeroCard from "./BetHeroCard";
import { F1_LOGO, US_LOGO } from "../helpers/icons";
import BetCard from "./BetCard";
import { useContract } from "@starknet-react/core";
import abi from "../../abi/ContractABI.json";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import { Market } from "../helpers/types";
import { getNumber, getString } from "../helpers/functions";
import { motion } from "framer-motion";
import CustomLoader from "../common/CustomLoader";
interface Props {}

const tabList = [
  {
    tabName: "Trending",
  },
  {
    tabName: "Closing Soon",
  },
  {
    tabName: "Crypto Market",
  },
  {
    tabName: "Sports",
  },
  {
    tabName: "Global Politics",
  },
  {
    tabName: "Pop Culture",
  },
];

const BetSection: NextPage<Props> = ({}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const betCardWrapperDiv = useRef<HTMLDivElement | null>(null);

  const scrollToElement = () => {
    if (betCardWrapperDiv.current) {
      betCardWrapperDiv.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  useEffect(() => {
    const getAllMarkets = async () => {
      setLoading(true);
      if (!contract) {
        setLoading(false);
        return;
      }
      await contract.get_all_markets().then((res: any) => {
        setMarkets(res);
      });
      setLoading(false);
    };
    getAllMarkets();
  }, []);

  useEffect(() => {
    setActiveTab(0);
  }, []);
  return (
    <div className='BetSection'>
      <div className='BetSection-Hero'>
        <div className='BetSection-HeroCard'>
          <BetHeroCard
            setActiveTab={setActiveTab}
            categoryIndex={3}
            category='Politics'
            categoryLogo={US_LOGO}
            categoryName='US Elections'
            cardBgColor='linear-gradient(67.58deg, #E20000 -0.96%, #9B3838 78.06%)'
            image='/assets/images/pol.svg'
            scrollFn={scrollToElement}
          />
        </div>
        <div className='BetSection-HeroCard'>
          <BetHeroCard
            setActiveTab={setActiveTab}
            categoryIndex={2}
            category='Sports'
            categoryLogo={F1_LOGO}
            categoryName='F1 World Champion'
            cardBgColor='linear-gradient(90deg, #143CDA 0%, #0D268A 100%)'
            image='/assets/images/f1.svg'
            scrollFn={scrollToElement}
          />
        </div>
      </div>
      <div ref={betCardWrapperDiv} className='BetSection-CardWrapper'>
        <div className='Tabs-Section'>
          {tabList.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveTab(index);
              }}
              className={activeTab === index ? "Tab-Active" : "Tab"}
            >
              {item.tabName}
            </div>
          ))}
        </div>
        <div className='BetCard-Wrapper'>
          {loading ? (
            <div className='LoaderDiv'>
              <CustomLoader size={"55"} color='#9C9C9C' />
            </div>
          ) : activeTab === 1 && markets.length > 0 ? (
            markets
              .filter((market) => {
                const deadline = new Date(
                  parseFloat(market.deadline)
                ).getTime();
                const oneDayFromNow = new Date().getTime();
                return deadline - oneDayFromNow < 86400000;
              })
              .map((item, index) => (
                <div key={index} className='BetCard-Container'>
                  <BetCard
                    index={index}
                    marketId={item.market_id}
                    category={item.category}
                    logo={item.image}
                    duration={item.deadline}
                    heading={item.name}
                    subHeading={item.description}
                    outcomes={item.outcomes}
                    moneyInPool={item.money_in_pool}
                    isActive={item.is_active}
                  />
                </div>
              ))
          ) : activeTab === 0 && markets.length > 0 ? (
            markets
              .sort(
                (a, b) =>
                  parseFloat(getNumber(b.money_in_pool)) -
                  parseFloat(getNumber(a.money_in_pool))
              )
              .map((item, index) => (
                <div key={index} className='BetCard-Container'>
                  <BetCard
                    index={index}
                    marketId={item.market_id}
                    category={item.category}
                    logo={item.image}
                    duration={item.deadline}
                    heading={item.name}
                    subHeading={item.description}
                    outcomes={item.outcomes}
                    moneyInPool={item.money_in_pool}
                    isActive={item.is_active}
                  />
                </div>
              ))
          ) : markets.length > 0 &&
            markets.filter((market) =>
              tabList[activeTab].tabName.includes(getString(market.category))
            ).length > 0 ? (
            markets
              .filter((market) =>
                tabList[activeTab].tabName.includes(getString(market.category))
              )
              .sort(
                (a, b) =>
                  parseFloat(getNumber(b.money_in_pool)) -
                  parseFloat(getNumber(a.money_in_pool))
              )
              .map((item, index) => (
                <div key={index} className='BetCard-Container'>
                  <BetCard
                    index={index}
                    marketId={item.market_id}
                    category={item.category}
                    logo={item.image}
                    duration={item.deadline}
                    heading={item.name}
                    subHeading={item.description}
                    outcomes={item.outcomes}
                    moneyInPool={item.money_in_pool}
                    isActive={item.is_active}
                  />
                </div>
              ))
          ) : (
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ease: "easeInOut", duration: 0.25 }}
              className='PlaceholderText'
            >
              No Active Events
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BetSection;
