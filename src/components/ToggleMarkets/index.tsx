import { NextPage } from "next";
import "./styles.scss";
import { Box } from "@mui/material";
import { colorStyles } from "@/components/helpers/menuStyles";
import { useState } from "react";
import Select from "react-select";
import { useContract } from "@starknet-react/core";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import abi from "../../abi/ContractABI.json";
import { Market } from "../helpers/types";
import useToggleMarket from "../hooks/useToggleMarket";
import { getString } from "../helpers/functions";

interface Props {}

const settel_categories = [
  {
    value: "all",
    label: "All Market",
  },
  {
    value: "crypto",
    label: "Crypto Market",
  },
  {
    value: "sports",
    label: "Sports Market",
  },
];

const ToggleMarkets: NextPage<Props> = ({}) => {
  const [category, setCategory] = useState("");
  const [marketId, setMarketId] = useState<BigInt>(BigInt(0));
  const [allMarkets, setAllMarkets] = useState<Market[]>([]);

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  const { toggleMarket } = useToggleMarket(marketId);

  const returnAllMarkets = () => {
    const select_markets: any = [];
    allMarkets.length == 0
      ? contract?.get_all_markets().then((res: Market[]) => {
          setAllMarkets(res);
          res.forEach((item) => {
            select_markets.push({
              value: Number(item.market_id),
              label: item.description,
            });
          });
        })
      : allMarkets.forEach((item) => {
          select_markets.push({
            value: Number(item.market_id),
            label: item.description,
          });
        });

    return (
      <Box className='InputContainer'>
        <span className='Label'>Active Markets</span>
        <Box className='Input'>
          <Select
            className='SelectBox'
            styles={colorStyles}
            options={select_markets}
            onChange={(id: any) => {
              setMarketId(id.value);
            }}
          />
        </Box>
      </Box>
    );
  };

  const returnAllCryptoMarkets = () => {
    const select_markets: any = [];
    allMarkets.length == 0
      ? contract?.get_all_markets().then((res: Market[]) => {
          setAllMarkets(res);
          res.forEach((item) => {
            if (getString(item.category) == "Crypto Market") {
              select_markets.push({
                value: Number(item.market_id),
                label: item.description,
              });
            }
          });
        })
      : allMarkets.forEach((item) => {
          if (getString(item.category) == "Crypto Market") {
            select_markets.push({
              value: Number(item.market_id),
              label: item.description,
            });
          }
        });

    return (
      <Box className='InputContainer'>
        <span className='Label'>Active Markets</span>
        <Box className='Input'>
          <Select
            className='SelectBox'
            styles={colorStyles}
            options={select_markets}
            onChange={(id: any) => {
              setMarketId(id.value);
            }}
          />
        </Box>
      </Box>
    );
  };

  const returnAllSportsMarkets = () => {
    const select_markets: any = [];
    allMarkets.length == 0
      ? contract?.get_all_markets().then((res: Market[]) => {
          setAllMarkets(res);
          res.forEach((item) => {
            if (getString(item.category) == "Sports") {
              select_markets.push({
                value: Number(item.market_id),
                label: item.description,
              });
            }
          });
        })
      : allMarkets.forEach((item) => {
          if (getString(item.category) == "Sports") {
            select_markets.push({
              value: Number(item.market_id),
              label: item.description,
            });
          }
        });
    return (
      <Box className='InputContainer'>
        <span className='Label'>Active Markets</span>
        <Box className='Input'>
          <Select
            className='SelectBox'
            styles={colorStyles}
            options={select_markets}
            onChange={(id: any) => {
              setMarketId(id.value);
            }}
          />
        </Box>
      </Box>
    );
  };

  return (
    <div>
      <Box className='InputContainer'>
        <span className='Label'>Category</span>
        <Box className='Input'>
          <Select
            className='SelectBox'
            styles={colorStyles}
            options={settel_categories}
            onChange={(category) => setCategory(category?.value!)}
          />
        </Box>
      </Box>
      {category === "all" && returnAllMarkets()}
      {category === "crypto" && returnAllCryptoMarkets()}
      {category === "sports" && returnAllSportsMarkets()}
      {}
      {marketId && (
        <Box className='InputContainer'>
          <span className='Label'>Market Id: {Number(marketId)}</span>
        </Box>
      )}
      {marketId && (
        <Box className='Submit'>
          <button onClick={toggleMarket} className='SubmitButton'>
            Toggle Market
          </button>
        </Box>
      )}
    </div>
  );
};

export default ToggleMarkets;
