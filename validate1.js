// validate.js
import { ethers } from "ethers";

// ABI dari fungsi `fulfillAvailableAdvancedOrders` (kemungkinan besar Seaport v1.5 atau OpenSea)
const abi = [
  {
    type: "function",
    name: "permit",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "spender", type: "address", internalType: "address" },
      { name: "value", type: "uint256", internalType: "uint256" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
      { name: "v", type: "uint8", internalType: "uint8" },
      { name: "r", type: "bytes32", internalType: "bytes32" },
      { name: "s", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
];

// Ganti ini dengan data input hex yang ingin divalidasi:
const inputData =
  "0x694c21d80000000000000000000000005d876d73f4441d5f2438b1a3e2a51771b337f27a000000000000000000000000000000000000000000000000000000000000000155534443000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005f57e280196f73b229000000020000001b9c1b5ebe365ad2e45518acc2f082249dd2205d6462d47c8202fdc27d143af2463410f7fee225f49636cbb723ef4b696626669eb15745226aaba91daecd0fe621c55534443000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005f57e280196f73b22900000002000000199ff0f178f8a029c4d9c97aefcb0d8562496c1a2b2ec3802d70c210335023a1a76a7dbf3983e21dce382b13d4efc5433406aa3dbfd59bdacc6cf37ab85e8e5971b55534443000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005f57e270196f73b229000000020000001b6f0153e80e980c03076cd932543bd32fe45466832aa438aeb64a2c4019b92612d45907e2a9cfd2571dd04a54370001c2e01a01e182e72a97e9ce448d72689971b0003000000000002ed57011e0000"; // potong jika terlalu panjang

try {
  const iface = new ethers.Interface(abi);
  const decoded = iface.decodeFunctionData("permit", inputData);

  console.log("✅ Valid data:");
  console.dir(decoded, { depth: null });
} catch (err) {
  console.error("❌ Invalid or incompatible data:");
  console.error(err.message);
}
