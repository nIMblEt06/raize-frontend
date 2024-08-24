import { NextPage } from "next";
import "./styles.scss";
import { Box } from "@mui/material";
import { colorStyles } from "@/components/helpers/menuStyles";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useContract } from "@starknet-react/core";
import { CONTRACT_ADDRESS, FPMM_CONTRACT_ADDRESS } from "../helpers/constants";
import abi from "../../abi/AMMMarketABI.json";
import {
  FPMMMarket,
  FPMMMarketInfo,
  FPMMOutcome,
  Market,
} from "../helpers/types";
import { Radio, RadioGroup } from "rsuite";
import { getString } from "../helpers/functions";
import useSettleFPMMMarket from "../hooks/useSettleFPMMMarket";
import axios from "axios";

interface Props {}

const SettleFPMMMarkets: NextPage<Props> = ({}) => {
  const [marketId, setMarketId] = useState<any>(0);
  const [value, setValue] = useState<any>(0);
  const [market, setMarket] = useState<FPMMMarket | null>(null);
  const [outcomes, setOutcomes] = useState<FPMMOutcome[]>([]);

  const { contract } = useContract({
    address: FPMM_CONTRACT_ADDRESS,
    abi: abi,
  });

  const { settleMarket } = useSettleFPMMMarket({
    marketId: marketId,
    outcome: value,
  });

  useEffect(() => {
    const getMarket = async () => {
      if (!contract || !marketId) {
        return;
      }
      await contract.get_market(marketId).then(async (res: any) => {
        setMarket(res);
        let tempOutcomes: FPMMOutcome[] = [];
        for (let i = 0; i < res.num_outcomes; i++) {
          await contract
            .get_outcome(marketId, i)
            .then((outcome: FPMMOutcome) => {
              tempOutcomes.push(outcome);
            });
        }
        setOutcomes(tempOutcomes);
      });
    };
    getMarket();
  }, [contract, marketId]);

  const handleMarketId = (e: any) => {
    setMarketId(e.target.value);
  };

  return (
    <div>
      <Box className='InputContainer'>
        <span className='Label'>
          Market Id:{" "}
          <input
            className='InputField'
            type='string'
            id='numberInput'
            name='numberInput'
            value={marketId}
            onChange={(e) => handleMarketId(e)}
          />
        </span>
      </Box>

      {marketId && (
        <Box className='InputContainer'>
          <span className='Label'>Outcome</span>
          <Box className='Input'>
            <RadioGroup
              value={value}
              onChange={setValue}
              name='radio-group'
              defaultValue='Yes'
            >
              <Radio value={0}>
                {outcomes[0] && getString(outcomes[0]?.name)}
              </Radio>
              <Radio value={1}>
                {outcomes[1] && getString(outcomes[1]?.name)}
              </Radio>
            </RadioGroup>
          </Box>
        </Box>
      )}
      {marketId && (
        <Box className='Submit'>
          <button onClick={settleMarket} className='SubmitButton'>
            Settle Market
          </button>
        </Box>
      )}
    </div>
  );
};

export default SettleFPMMMarkets;
