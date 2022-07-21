import React, { useContext, useEffect, useState } from "react";
import { blockchainConstants } from "../../lib/constants/blockchain-constants";
import { TxnSection } from "./TxnSection";

interface Props {}

export const MinterPartners: React.FC<Props> = ({}) => {

  const [vaultLists, setVaultLists] = useState<any[]>([]);
  const [showComp, setShowComp] = useState(false);
  const [compAdd, setCompAdd] = useState('');
  const [selectedComp, setSelectedComp] = useState('');


  const minterPartnerChange = (id: string) => {
    if (id) {
      try {
        setSelectedComp(id);
        setShowComp(true);
        localStorage.setItem("currentComp", JSON.stringify(id));
        setCompAdd(id);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(
    () => {
      try {
        const currentComp = localStorage.getItem("currentComp");
        if (currentComp) {
          const compAdd = JSON.parse(currentComp);
          setSelectedComp(compAdd)
          setShowComp(true);
          setCompAdd(compAdd);
        }
        else{
          setSelectedComp("0x61aAeaBdc65e4A95CcaA1a9573906604121ff87a");
          setShowComp(true);
          localStorage.setItem("currentComp", JSON.stringify("0x61aAeaBdc65e4A95CcaA1a9573906604121ff87a"));
          setCompAdd("0x61aAeaBdc65e4A95CcaA1a9573906604121ff87a");
        }

        const tempVaultLists: {
          id: number;
          name: any;
          compAdd: any;
        }[] = [];
        for (
          let i = 0;
          i < blockchainConstants["polygon"]["mintingVaults"].length;
          i++
        ) {
          tempVaultLists.push({
            id: i,
            name: blockchainConstants["polygon"]["mintingVaults"][i][
              "stakeTokenSymbol"
            ],
            compAdd:
              blockchainConstants["polygon"]["mintingVaults"][i]["comptroller"],
          });
        }
        setVaultLists(tempVaultLists);
      } catch (error) {
        console.log("MinterPartners UseEffect error:", error);
      }
      // }
    },[]
  );
  return (
    <>
      <div className="mb40">
        <div className="row text-left">
          <div className="col-md-10 offset-md-1">
            {/* <h3 className="mb-3">Minter Partners</h3> */}
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
      {showComp ? 
      <TxnSection data = {compAdd} /> : null}
    </>
  );
};
