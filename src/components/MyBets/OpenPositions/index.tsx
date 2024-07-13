import React from "react";
import "./styles.scss";
import { Market, UserBet } from "@/components/helpers/types";
import { getNumber, getString } from "@/components/helpers/functions";
import { USDC_LOGO } from "@/components/helpers/icons";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import CustomLogo from "@/components/common/CustomIcons";
import LoaderComponent from "../LoaderComponent";
import EmptyBetComponent from "../EmptyBetComponent";
import DetailsButton from "./DetailsButton";
import { options } from "@/components/helpers/constants";

interface Props {
  openMarkets: Market[];
  openBets: UserBet[];
  loading: boolean;
}

function OpenPositions({ openMarkets, openBets, loading }: Props) {
  return (
    <div className="OpenPositions">
      <div className="Heading">Open Positions</div>
      <div className="Container">
        {loading ? (
          <LoaderComponent />
        ) : openMarkets.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ease: "easeInOut", duration: 0.35 }}
              className="Headings"
            >
              <span className="Status">Status</span>
              <span className="Event">Event</span>
              <span className="DatePlaced">Bet Deadline</span>
              <span className="StakedAmount">Staked Amount</span>
              <span className="Prediction">Prediction</span>
              <span className="Details"></span>
            </motion.div>
            {openMarkets.map((market, index) => (
              <div className="Data" key={index}>
                <span className="Status">Open</span>
                <span className="Event">{market.name}</span>
                <span className="DatePlaced">
                  {
                    new Date(parseInt(market.deadline))
                      .toString()
                      .split("GMT")[0]
                  }
                </span>
                <span className="BetToken StakedAmount">
                  <Box className="TokenLogo">
                    <CustomLogo src={USDC_LOGO} />
                  </Box>
                  {openBets.length > 0 && openBets[index]
                    ? getNumber(openBets[index].position.amount)
                    : "0"}
                </span>
                <span className="Yes Prediction">
                  {openBets.length > 0 && openBets[index]
                    ? getString(openBets[index].outcome.name)
                    : "0"}
                </span>
                <DetailsButton
                  name={market.name}
                  date={new Date(parseInt(market.deadline)).toLocaleDateString(
                    "en-US",
                    options
                  )}
                  amount={
                    openBets.length > 0 && openBets[index]
                      ? getNumber(openBets[index].position.amount)
                      : "0"
                  }
                  prediction={
                    openBets.length > 0 && openBets[index]
                      ? getString(openBets[index].outcome.name)
                      : "0"
                  }
                />
              </div>
            ))}
          </>
        ) : (
          <EmptyBetComponent text="You have no open positions" />
        )}
      </div>
    </div>
  );
}

export default OpenPositions;
