import axios from "axios";

export const getTVL = async () => {
  try {
    let tvl: any;
    await axios
      .get(`https://api-opendao.opendao.io/api/tvl/apps`)
      .then((res) => {
        tvl = res.data;
      });
    return tvl;
  } catch (error) {
    console.log("getTVL() error:", error);
  }
};

export const getOmniSteaksApys = async () => {
  const apyForTime = Math.trunc(Date.now() / (1000 * 60));
  try {
    let allApys: any;
    await axios
      .get(`https://api-omnisteaks.ocp.finance/apy/breakdown?_=${apyForTime}`)
      .then((res) => {
        allApys = res.data;
      });
    return allApys;
  } catch (error) {
    console.log("getOmniSteaksApys() error:", error);
  }
};
