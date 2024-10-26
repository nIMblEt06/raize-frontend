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
import { Radio, RadioGroup } from "rsuite";
import useSettleMarket from "../hooks/useSettleMarket";
import { getString } from "../helpers/functions";
import axios from "axios";
import VerifyProof from "./verify-proof";
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

const SettleMarkets: NextPage<Props> = ({}) => {
  const [category, setCategory] = useState("");
  const [marketId, setMarketId] = useState<BigInt>(BigInt(0));
  const [value, setValue] = useState<any>("Yes");
  const [allMarkets, setAllMarkets] = useState<Market[]>([]);
  const [transformedProof,setProof]=useState(null);
  const [canSettle, setCanSettle] = useState(false);
  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });
  
  
  const generateProof=async ()=>{
    console.log("fetching");
    const response=await axios.get(`${process.env.SERVER_URL}/generate-proofs`);
    if(response.data){
      setProof(response.data);
      console.log(response.data)
      
    }
  }  

  const { settleMarket, } = useSettleMarket({
    category: category,
    marketId: marketId,
    outcome: value === "Yes" ? 0 : 1,
  });

  const handleProofVerified = (success: boolean) => {
    setCanSettle(success);  // Update the state when proof is verified
  };

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
        <Box className='InputContainer'>
          <span className='Label'>Outcome</span>
          <Box className='Input'>
            <RadioGroup
              value={value}
              onChange={setValue}
              name='radio-group'
              defaultValue='Yes'
            >
              <Radio value='Yes'>Yes</Radio>
              <Radio value='No'>No</Radio>
            </RadioGroup>
          </Box>
        </Box>
      )}
      {marketId && (
        <Box className='Submit'>
          <button onClick={settleMarket} className='SubmitButton' disabled={!canSettle} >
            Settle Market
          </button>
          {
            (transformedProof===null) ? <button onClick={generateProof} className="SubmitButton ">
            Generate Proof
           </button>:""
          }
          
        </Box>
      
      )}
      {transformedProof && <VerifyProof data={transformedProof} onVerified={handleProofVerified}/>}
     
    </div>
  );
};

export default SettleMarkets;
