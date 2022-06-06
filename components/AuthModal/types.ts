import { Connector } from "./../../web3";

export type BaseWallet = {
  name: string;
  Logo: React.FC<React.SVGProps<SVGSVGElement>>;
};

export type Wallet = BaseWallet & {
  connector: Connector;
  mainnetOnly?: boolean;
  svgName: string;
};
