import React, { useContext, useEffect } from "react";
import { localeString } from "../../lib/utils";
import AppContext from "../utils/AppContext";
import { getTVL } from "../../lib/hooks";

interface Props {}

export const InfoAndTvl: React.FC<Props> = ({}) => {
  const {
    currentAccount,
    setCurrentAccount,
    networkString,
    setNetworkString,
    setContractAddresses,
    contractAddresses,
    selectedComp,
    setSelectedComp,
    tokenData,
    dataObj,
    setDataObj,
  } = useContext(AppContext);

  const getTvl = async () => {
    let tvl: any;
    try {
      tvl = await getTVL();
    } catch (error) {
      console.log("getTvl() error:", error);
    }
    if (!!tvl) {
      const ob = {
        ...dataObj,
        totalTvl: tvl["error"] == false ? tvl["data"]["totalTvl"] : 0,
      };
      setDataObj(ob);
      const currentComp = localStorage.getItem("currentComp");
      if (currentComp) {
        setSelectedComp(JSON.parse(currentComp));
      }
    }
  };

  useEffect(() => {
    getTvl();
  }, []);

  return (
    // <div className="content mb50 min-vh-100" role="main">
    <section>
      <div>
        <div className="container-lg">
          <div className="row text-center">
            <div className="col-md-12 mx-auto">
              <div className="mb40">
                <h1 className="text-center minter-header">
                  <img
                    className="pr-3"
                    src={"/assets/img/USDO_logo.png"}
                    style={{ height: "100px" }}
                    alt={`USDO logo`}
                  />
                  <strong className="minter-text text-primary-ctm">
                    MINTER
                  </strong>
                </h1>
                <p className="text-center">
                  Stake collateral in the vaults to mint USDO. Repay to unlock
                  your collateral.
                  <br /> Lend USDO to the vaults to earn an APY. Supply to LP to
                  earn more.
                </p>
              </div>
              {!!dataObj && !!dataObj.totalTvl && (
                <div className="mb40">
                  <div className="row text-center">
                    <div className="col-md-10 offset-md-1 minter-tvl">
                      {" "}
                      TVL : ${localeString(dataObj.totalTvl, 0)}{" "}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
