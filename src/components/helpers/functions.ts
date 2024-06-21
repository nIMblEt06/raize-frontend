import { shortString } from "starknet";

export const getProbabilites = (shares1: any, shares2: any) => {
  if (shares1 == "0" && shares2 == "0") {
    return [50, 50];
  } else if (shares2 == "0") {
    return [100, 0];
  } else if (shares1 == "0") {
    return [0, 100];
  }
  const percent1 =
    (parseFloat(shares1) /
      1e18 /
      (parseFloat(shares1) / 1e18 + parseFloat(shares2) / 1e18)) *
    100;
  const percent2 =
    (parseFloat(shares2) /
      1e18 /
      (parseFloat(shares1) / 1e18 + parseFloat(shares2) / 1e18)) *
    100;

  return [percent1, percent2];
};

export const getString = (string: any) => {
  return shortString.decodeShortString(string);

}

export const getNumber = (num: any) => {
  return (parseFloat(BigInt(num).toString()) / 1e18).toString();
}