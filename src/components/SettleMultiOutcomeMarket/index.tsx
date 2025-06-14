import { NextPage } from "next";
import "./styles.scss";
import { Box } from "@mui/material";
import { colorStyles } from "@/components/helpers/menuStyles";
import { useState } from "react";
import Select from "react-select";
import { useContract } from "@starknet-react/core";
import { MULTI_OUTCOME_MARKET_ADDRESS } from "../helpers/constants";
import abi from "../../abi/MultiOutcomeABI.json";
import { Market, MultiOutcomeMarket, Outcome } from "../helpers/types";
import { Radio, RadioGroup } from "rsuite";
import { getString } from "../helpers/functions";
import { useFetchParticularMultiOutcomeMarket } from "../hooks/useFetchMultiOutcomeMarket";
import { useSettleMultiOutcomeMarket } from "../hooks/useSettleMultiOutcomeMarket";


interface Props {}



export const SettleMultiOutcomeMarket: NextPage<Props> = ({}) => {
  const [marketId, setMarketId] = useState<BigInt>(BigInt(0));
  const [value, setValue] = useState<number>(0);
  const [allMarkets, setAllMarkets] = useState<MultiOutcomeMarket[]>([]);
  const [canSettle, setCanSettle] = useState(false);
  const { contract } = useContract({
    address: MULTI_OUTCOME_MARKET_ADDRESS,
    abi: abi,
  });
  
 
const { settleMultiOutcomeMarket, isPending} = useSettleMultiOutcomeMarket({
    marketId:marketId,
    outcome : value
}) 

  const { multiOutcomeMarket, fetching } = useFetchParticularMultiOutcomeMarket(marketId)
  const outcomes:Outcome[] = Array.isArray(multiOutcomeMarket?.outcomes)
  ? multiOutcomeMarket.outcomes
  : Object.values(multiOutcomeMarket?.outcomes || {});
  console.log("THe markets is",multiOutcomeMarket, outcomes)


  const returnAllMarkets = () => {
    const select_markets: any = [];
    allMarkets.length == 0
      ? contract?.get_all_multioutcome_markets().then((res: MultiOutcomeMarket[]) => {
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

//     const select_markets: any = [];
//     allMarkets.length == 0
//       ? contract?.get_all_markets().then((res: Market[]) => {
//           setAllMarkets(res);
//           res.forEach((item) => {
//             if (getString(item.category) == "Crypto Market") {
//               select_markets.push({
//                 value: Number(item.market_id),
//                 label: item.description,
//               });
//             }
//           });
//         })
//       : allMarkets.forEach((item) => {
//           if (getString(item.category) == "Crypto Market") {
//             select_markets.push({
//               value: Number(item.market_id),
//               label: item.description,
//             });
//           }
//         });

//     return (
//       <Box className='InputContainer'>
//         <span className='Label'>Active Markets</span>
//         <Box className='Input'>
//           <Select
//             className='SelectBox'
//             styles={colorStyles}
//             options={select_markets}
//             onChange={(id: any) => {
//               setMarketId(id.value);
//             }}
//           />
//         </Box>
//       </Box>
//     );
//   };

//   const returnAllSportsMarkets = () => {
//     const select_markets: any = [];
//     allMarkets.length == 0
//       ? contract?.get_all_markets().then((res: Market[]) => {
//           setAllMarkets(res);
//           res.forEach((item) => {
//             if (getString(item.category) == "Sports") {
//               select_markets.push({
//                 value: Number(item.market_id),
//                 label: item.description,
//               });
//             }
//           });
//         })
//       : allMarkets.forEach((item) => {
//           if (getString(item.category) == "Sports") {
//             select_markets.push({
//               value: Number(item.market_id),
//               label: item.description,
//             });
//           }
//         });
//     return (
//       <Box className='InputContainer'>
//         <span className='Label'>Active Markets</span>
//         <Box className='Input'>
//           <Select
//             className='SelectBox'
//             styles={colorStyles}
//             options={select_markets}
//             onChange={(id: any) => {
//               setMarketId(id.value);
//             }}
//           />
//         </Box>
//       </Box>
//     );
//   };

  return (
    <div>
      {returnAllMarkets()}
      {marketId && (
        <Box className='InputContainer'>
          <span className='Label'>Market Id: {Number(marketId)}</span>
        </Box>
      )}
      {marketId && !isPending && outcomes.length > 0 && (
        <Box className='InputContainer'>
          <span className='Label'>Outcome</span>
          <Box className='Input'>
            <RadioGroup
              value={value}
              onChange={(value: any) => setValue(Number(value))}
              name='radio-group'
              defaultValue='Yes'
            >
             {outcomes.map((outcome, index: number) => (
          <Radio value={index} key={index}>
            {getString(Number(outcome.name))} 
          </Radio>
        ))}
            </RadioGroup>
          </Box>
        </Box>
      )}
      {marketId && (
        <Box className='Submit'>
          {
           <button type="button" onClick={settleMultiOutcomeMarket} className='SubmitButton'>
            Settle Market
          </button>
          }
          
        </Box>
      
      )}
     
    </div>
  );
};

