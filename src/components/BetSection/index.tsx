import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import useFetchMarkets from "../hooks/useFetchMarkets";
import { motion } from "framer-motion";

import "./styles.scss";
import BetHeroCard from "./BetHeroCard";
import BetCard from "./BetCard";
import ContBetCard from "./ContBetCard";
import CustomLoader from "../common/CustomLoader";
import { AMMA_LOGO, IPL_LOGO, US_LOGO } from "../helpers/icons";
import { getNumber, getString } from "../helpers/functions";

const tabList = [
  "Trending",
  "Continuous Markets",
  "Closing Soon",
  "Crypto Market",
  "Sports",
  "Global Politics",
  "Pop Culture",
];

const BetSection: NextPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { loading, markets, contMarkets } = useFetchMarkets();
  const betCardWrapperRef = useRef<HTMLDivElement | null>(null);
  console.log(markets, "markets");
  useEffect(() => setActiveTab(0), []);

  const scrollToElement = () => {
    betCardWrapperRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getFilteredMarkets = () => {
    const now = Date.now();

    if (activeTab === 1) {
      return contMarkets
        .filter((m) => m.active)
        .map((m, i) => (
          <div key={i} className="BetCard-Container">
            <ContBetCard
              marketId={m.market_id}
              category={m.category}
              logo={AMMA_LOGO}
              deadline={m.deadline}
              heading={m.question}
              subHeading={m.description}
              outcomes={m.outcomes}
              isActive={m.active}
            />
          </div>
        ));
    }

    const filtered =
      activeTab === 2
        ? markets.filter(
            (m) =>
              new Date(parseFloat(m.deadline)).getTime() - now < 7 * 86400000
          )
        : activeTab === 0
        ? [...markets].sort(
            (a, b) =>
              parseFloat(getNumber(b.money_in_pool)) -
              parseFloat(getNumber(a.money_in_pool))
          )
        : markets.filter((m) =>
            tabList[activeTab].includes(getString(m.category))
          );

    const sortedFiltered = [...filtered].sort((a, b) => {
      const currentTime = new Date().getTime();
      const aDeadline = new Date(parseInt(a.deadline)).getTime();
      const bDeadline = new Date(parseInt(b.deadline)).getTime();

      const aIsPast = currentTime > aDeadline;
      const bIsPast = currentTime > bDeadline;

      if (aIsPast === bIsPast) return 0;
      return aIsPast ? 1 : -1;
    });

    return sortedFiltered.length > 0 ? (
      sortedFiltered.map((item, i) => (
        <div key={i} className="BetCard-Container">
          <BetCard
            index={i}
            marketId={item.market_id}
            category={item.category}
            logo={item.image}
            duration={item.deadline}
            heading={item.name}
            subHeading={item.description}
            outcomes={item.outcomes}
            moneyInPool={item.money_in_pool}
            isActive={item.market_id === 23 ? false : item.is_active}
          />
        </div>
      ))
    ) : (
      <motion.span
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.25 }}
        className="PlaceholderText"
      >
        No Active Events
      </motion.span>
    );
  };

  return (
    <div className="BetSection">
      {/* HERO CARDS */}
      <div className="BetSection-Hero">
        <BetHeroCard
          setActiveTab={setActiveTab}
          categoryIndex={5}
          category="Politics"
          categoryLogo={US_LOGO}
          categoryName="US Elections"
          cardBgColor="linear-gradient(67.58deg, #E20000 -0.96%, #9B3838 78.06%)"
          image="/assets/images/pol.svg"
          scrollFn={scrollToElement}
          enabled
        />
        <BetHeroCard
          setActiveTab={setActiveTab}
          categoryIndex={4}
          category="Sports"
          categoryLogo={IPL_LOGO}
          categoryName="IPL 2025"
          cardBgColor="linear-gradient(90deg, #143CDA 0%, #0D268A 100%)"
          image="/assets/images/ipl.svg"
          scrollFn={scrollToElement}
          enabled
        />
      </div>

      {/* TABS + CARDS */}
      <div ref={betCardWrapperRef} className="BetSection-CardWrapper">
        <div className="Tabs-Section">
          {tabList.map((name, i) => (
            <div
              key={i}
              onClick={() => setActiveTab(i)}
              className={activeTab === i ? "Tab-Active" : "Tab"}
            >
              {name}
            </div>
          ))}
        </div>

        <div className="BetCard-Wrapper">
          {loading ? (
            <div className="LoaderDiv">
              <CustomLoader size="55" color="#9C9C9C" />
            </div>
          ) : (
            getFilteredMarkets()
          )}
        </div>
      </div>
    </div>
  );
};

export default BetSection;
