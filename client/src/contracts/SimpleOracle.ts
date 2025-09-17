// Simple Oracle contract for testing
export const SIMPLE_ORACLE_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "newPrice", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "PriceUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "latestPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastUpdated",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_newPrice", type: "uint256" }],
    name: "updatePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Simple bytecode for a basic price oracle (minimal working contract)
export const SIMPLE_ORACLE_BYTECODE = "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80638d6cc56d14610046578063a3e6ba9414610062578063d0b06f5d14610080575b600080fd5b610060600480360381019061005b91906100e3565b61009e565b005b61006a6100e8565b6040516100779190610110565b60405180910390f35b6100886100ee565b6040516100959190610110565b60405180910390f35b8060008190555042600181905550600054600154604051610100929190610110565b60405180910390a150565b60005481565b60015481565b600080fd5b6000819050919050565b6100fd816100f4565b811461010857600080fd5b50565b60008135905061011a816100f4565b92915050565b60006020828403121561013657610135610103565b5b60006101448482850161010b565b91505092915050565b61015681610108565b82525050565b6000602082019050610171600083018461014d565b9291505056fea264697066735822122000000000000000000000000000000000000000000000000000000000000000064736f6c63430008140033";