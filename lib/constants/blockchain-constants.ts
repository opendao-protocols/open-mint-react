export const blockchainConstants: any = {
  bsc: {
    Comptroller: "0xA21d5c762E13FcfC8541558dAce9BA54f1F6176F",
    mintingVaults: [
      {
        comptroller: "0xD8629C8f41E56429Ea425DFf10e673a06B7Fdc98",
        stakeTokenAdd: "0xaBaE871B7E3b67aEeC6B46AE9FE1A91660AadAC5",
        stakeTokenSymbol: "pOPEN",
        stakeTokenDecimals: 18,
        stakeKTokenSymbol: "kpOPEN",
        stakeKTokenAdd: "0x0a234EF34614A4EEd1c1430A23b46f95df5F4257",

        mintTokenAdd: "0x5801d0e1c7d977d78e4890880b8e579eb4943276",
        mintTokenSymbol: "USDO",
        mintTokenDecimals: 18,
        mintKTokenAdd: "0xeD33b9C21B1d1908863568b549D2a496549A1EfB",
        mintKTokenDecimals: 8,
      },
    ]
  },
     
  polygon: {
    Comptroller: "0x06941b64a339f282cE2B501617EA06a9f80191E4",
    compLens: "0x845b54041765A66941d426b9E4bE56003BCF005b",
    mintingVaults: [
      {
        comptroller: "0x61aAeaBdc65e4A95CcaA1a9573906604121ff87a",
        stakeTokenAdd: "0x2f594C8eCb740231B0039E3D8A5BFd14225801E7",
        stakeTokenSymbol: "SDT",
        stakeTokenDecimals: 18,
        stakeKTokenSymbol: "uSDT",
        stakeKTokenAdd: "0xf2bB8cD51A4bdcf33f3a77E4cdCAbaAFcfa9ad5A",

        mintTokenAdd: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        mintTokenSymbol: "USDC",
        mintTokenDecimals: 6,
        mintKTokenAdd: "0x243415ce19991095b2105ba50d4cBa3D1de32695",
        mintKTokenDecimals: 8,
      },
    ],
    DynamicInterestRateModel: [
      "0x0612847A418838Aff21D561C347a3f41C9D05dD7",
      "0xEdb1ab6981f74Dc079EC31dBb38cF73b8B642022",
      "0xFA3745dF4CF94CDe88dC8c42d98C3a47f1AA9321",
    ],
    PancakeSwapV2Router02: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    UniswapV2Router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
    usdoAddress: "0xc79358de3868a7c751f52cfeecd650595aee8b18",
    DefaultGasPrice: "35",
    BlocksPerYear: "15027429",
    BasePriceDecimal: "6",
    UniswapDefaultAdd: "0x0000000000000000000000000000000000000000",
  },
  infuraID: "e8f20dc6c35d4e50a38aed78cc360f30",
};
