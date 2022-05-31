import React, { useContext, useEffect, useState } from "react";
import { blockchainConstants } from "../../lib/constants/blockchain-constants";
import AppContext from "../utils/AppContext";

interface Props {
  // myInfo?: string | null;
  // activeHeader: string;
}

export const MinterPartners: React.FC<Props> = ({}) => {
  const {
    currentAccount,
    setCurrentAccount,
    networkString,
    setNetworkString,
    setContractAddresses,
    contractAddresses,
    selectedComp,
    setSelectedComp,
  } = useContext(AppContext);

  const [vaultLists, setVaultLists] = useState<any[]>([]);

  const minterPartnerChange = (id: string) => {
    if (id) {
      try {
        setSelectedComp(id);
        localStorage.setItem("currentComp", JSON.stringify(id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (networkString === "BSC") {
      setContractAddresses(blockchainConstants["bsc"]);
      try {
        const tempVaultLists: {
          id: number;
          name: any;
          compAdd: any;
        }[] = [];
        for (let i = 0; i < contractAddresses["mintingVaults"].length; i++) {
          tempVaultLists.push({
            id: i,
            name: contractAddresses["mintingVaults"][i]["stakeTokenSymbol"],
            compAdd: contractAddresses["mintingVaults"][i]["comptroller"],
          });
        }
        setVaultLists(tempVaultLists);
      } catch (error) {
        console.log("MinterPartners UseEffect error:", error);
      }
    }
  }, [networkString, contractAddresses]);

  return (
    <>
      <div className="mb40">
        <div className="row text-left">
          <div className="col-md-10 offset-md-1">
            <h3 className="mb-3">Minter Partners</h3>
            <div className="row minter-partners">
              {vaultLists.map((vault, i) => (
                <div className="col-6 col-sm-3 col-lg-2 mb-2" key={i}>
                  <div
                    className="p-2 text-nowrap btn btn-block btn-grey-box text-left"
                    onClick={() => minterPartnerChange(vault.compAdd)}
                    style={{
                      backgroundColor:
                        selectedComp == vault.compAdd ? "rgb(187 118 216)" : "",
                    }}
                  >
                    <img
                      className="mr-2"
                      style={{ height: "30px" }}
                      src={`/assets/img/${vault.name}_logo.png`}
                      alt=""
                    />
                    <span className="font-weight-light">{vault.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
