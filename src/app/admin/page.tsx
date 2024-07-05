"use client";
import { Box } from "@mui/material";
import "./styles.scss";
import { useEffect, useMemo, useState } from "react";
import "rsuite/dist/rsuite-no-reset.min.css";
import Select from "react-select";
import { DatePicker } from "rsuite";
import { colorStyles } from "@/components/helpers/menuStyles";
import useCreateMarket from "@/components/hooks/useCreateMarket";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const categories = [
  {
    value: "Crypto Market",
    label: "Crypto",
  },
  {
    value: "Global Politics",
    label: "Politics",
  },
  {
    value: "Sports",
    label: "Sports",
  },
];

export default function AdminPortal() {
  const [heading, setHeading] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [outcome1, setOutcome1] = useState("");
  const [outcome2, setOutcome2] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [image, setImage] = useState("");
  const [eventId, setEventId] = useState("");
  const [isHome, setIsHome] = useState(true);
  const [amount, setAmount] = useState("");
  const [priceKey, setPriceKey] = useState("");
  const [condition, setCondition] = useState("");
  const [canCreate, setCanCreate] = useState(false);

  const firebaseConfig = {
    apiKey: "AIzaSyAIowr5sia66ujQ8MHEAGdaytEhV3z5SAs",
    authDomain: "raizeicons.firebaseapp.com",
    projectId: "raizeicons",
    storageBucket: "raizeicons.appspot.com",
    messagingSenderId: "145845814420",
    appId: "1:145845814420:web:6266360ba7c20dacafe081",
    measurementId: "G-9L9PWBPWMT",
  };

  const app = initializeApp(firebaseConfig);

  const cryptoSelection = () => {
    return (
      <div>
        <Box className='InputContainer'>
          <span className='Label'>Amount</span>
          <Box className='Input'>
            <input
              className='InputField'
              type='string'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='Amount in Heading in numbers'
              required
            />
          </Box>
        </Box>
        <Box className='InputContainer'>
          <span className='Label'>Price Key</span>
          <Box className='Input'>
            <input
              className='InputField'
              type='string'
              value={priceKey}
              onChange={(e) => setPriceKey(e.target.value)}
              placeholder='Price Key of Pragma (e.g. BTC/USD)'
              required
            />
          </Box>
        </Box>
        <Box className='InputContainer'>
          <span className='Label'>Conditions</span>
          <Box className='Input'>
            <input
              className='InputField'
              type='string'
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder='Condition to check in Pragma (e.g. > 1000), 0 for greater than, 1 for less than'
              required
            />
          </Box>
        </Box>
      </div>
    );
  };

  const sportsSelection = () => {
    return (
      <div>
        <Box className='InputContainer'>
          <span className='Label'>Event ID on Pinaccle Odds</span>
          <Box className='Input'>
            <input
              className='InputField'
              type='string'
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder='Price Key of Pragma (e.g. BTC/USD)'
              required
            />
          </Box>
        </Box>
        <Box className='InputContainer'>
          <Box className='Input Check'>
            <label>
              Is the country in question the home team?
              <input
                className='InputField'
                type='checkbox'
                checked={isHome}
                onChange={() => setIsHome(!isHome)}
                required
              />
            </label>
          </Box>
        </Box>
      </div>
    );
  };

  const { createMarket, data, isSuccess, isError, isPending, error } =
    useCreateMarket({
      heading,
      category,
      description,
      outcome1,
      outcome2,
      deadline,
      image,
      amount,
      priceKey,
      condition,
      eventId,
      isHome,
    });

  console.log("tx details", data);

  useEffect(() => {
    const validateMarket = () => {
      if (category == "Crypto Market") {
        if (amount == "" || priceKey == "" || condition == "") {
          setCanCreate(false);
          return;
        }
      } else if (category == "Sports") {
        if (eventId == "") {
          setCanCreate(false);
          return;
        }
      }
      if (
        heading == "" ||
        description == "" ||
        outcome1 == "" ||
        outcome2 == "" ||
        image == "" ||
        category == ""
      ) {
        setCanCreate(false);
        return;
      }

      setCanCreate(true);
      return;
    };
    validateMarket();
  }, [
    amount,
    category,
    condition,
    description,
    eventId,
    heading,
    image,
    outcome1,
    outcome2,
    priceKey,
  ]);

  const handleImageUpload = (e: any) => {
    const storage = getStorage();
    const file = e.target.files[0];
    const storageRef = ref(storage, `market_icons/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        setImage(downloadURL);
        console.log(downloadURL);
      });
    });
  };

  return (
    <main className='Admin'>
      <div className='Heading-Section'>
        <div>Market Dashboard</div>
      </div>
      <div className='Content-Section'>
        <Box className='InputContainer'>
          <span className='Label'>Heading</span>
          <Box className='Input'>
            <input
              className='InputField'
              type='string'
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder='Trump vs Biden'
              required
            />
          </Box>
        </Box>
        <Box className='InputContainer'>
          <span className='Label'>Description</span>
          <Box className='Input'>
            <input
              className='InputField'
              type='string'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Will Trump win the 2024 election?'
              required
            />
          </Box>
        </Box>
        <Box className='InputContainer Outcome'>
          <Box className='InputContainer'>
            <span className='Label'>Outcome 1</span>
            <Box className='Input'>
              <input
                className='InputField'
                type='string'
                id='numberInput'
                name='numberInput'
                value={outcome1}
                onChange={(e) => setOutcome1(e.target.value)}
                placeholder='Yes!'
                required
              />
            </Box>
          </Box>
          <Box className='InputContainer'>
            <span className='Label'>Outcome 2</span>
            <Box className='Input'>
              <input
                className='InputField'
                type='string'
                id='numberInput'
                name='numberInput'
                value={outcome2}
                onChange={(e) => setOutcome2(e.target.value)}
                placeholder='No'
                required
              />
            </Box>
          </Box>
        </Box>
        <Box className='InputContainer Outcome'>
          <Box className='InputContainer'>
            <span className='Label'>Category</span>
            <Box className='Input'>
              <Select
                className='SelectBox'
                styles={colorStyles}
                options={categories}
                onChange={(category) => setCategory(category?.value!)}
              />
            </Box>
          </Box>
          <Box className='InputContainer'>
            <span className='Label'>Deadline</span>
            <Box className='Input'>
              <DatePicker
                placeholder='Select Deadline'
                format='MM/dd/yyyy HH:mm'
                onChange={(value) => setDeadline(value!)}
                value={deadline}
              />
            </Box>
          </Box>
        </Box>
        <Box className='InputContainer'>
          <span className='Label'>Image</span>
          <Box className='Input'>
            {image == "" ? (
              <input
                className='InputField'
                type='file'
                value={image}
                onChange={(e) => handleImageUpload(e)}
                required
              />
            ) : (
              <input
                className='InputField'
                type='string'
                id='numberInput'
                name='numberInput'
                value={image}
                disabled
              />
            )}
          </Box>
        </Box>
        {category == "Crypto Market" && cryptoSelection()}
        {category == "Sports" && sportsSelection()}
        <Box className='Submit'>
          <button
            disabled={!canCreate || isPending}
            onClick={createMarket}
            className={`SubmitButton ${canCreate ? "" : "Disabled"}`}
          >
            Create Market
          </button>
        </Box>
      </div>
    </main>
  );
}
