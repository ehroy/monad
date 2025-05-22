import { ethers } from "ethers";

const abi = [
  "function multicall(tuple(address target, bool isPriceUpdate, bytes data)[] calls) returns (bytes[] results)",
];
const PRIVATE_KEY =
  "0x7da9d535d1070b4ed5e36e72f156136ec47cebdb2dcc73dcfdae48b711273690"; // 🔐 Ganti dengan private key kamu
const PROVIDER_URL = "https://testnet-rpc.monad.xyz/"; // atau RPC publik lain
const CONTRACT_ADDRESS = "0x2f930b339DE82F34FDbe54e872Eb4A2855B76EA2"; // alamat kontrak tujuan
const GAS_LIMIT = 500000;
const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const contractAddress = "0xcda16e9c25f429f4b01a87ff302ee7943f2d5015";

const contract = new ethers.Contract(contractAddress, abi, wallet);

// Data calls seperti contoh kamu
const calls = [
  {
    target: "0x4A18ee66877236C9a66698648EB06565f225c9B2",
    isPriceUpdate: true,
    data: "0x694c21d80000000000000000000000006bb379a2056d1304e73012b99338f8f581ee2e180000000000000000000000000000000000000000000000000000000000000001574254430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0a28194c940196f6d55be00000002000000160948c1c17e71a684f5d9e3d324ee6dd03412a0623438a5510409ac2886d37161daa43582211534104f4830264668a8b3900c199fa15f624e661666b14325af61c574254430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0a28194c940196f6d55be000000020000001f9a0d369cc51636231e1716f76a8c0dd0f986d698ecd18d9588b7819442fe99f5cc44f7bc6d55d2447c39ede1ff0bf6630a3e0117a675b96002cb5a8c9a15e9d1b574254430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0a28194c940196f6d55be0000000200000015cb1f950def381665bb2ba9d3d5e9f62df229e1d1e255435653f679397c698dc1b8b901da4710c4c77f25232da59f9e06728f95dc2eca5e74eed4f654d1a74331c0003000000000002ed57011e0000",
  },
  {
    target: "0xcDA16E9c25f429F4B01A87Ff302Ee7943F2D5015",
    isPriceUpdate: false,
    data: "0x2f4a61d9000000000000000000000000000000000000000000000000000000000031943b0000000000000000000000003354b0d9d8d85b1c6e0bdd53283ea087cd35b2f4",
  },
];

// Kirim transaksi multicall
async function depositBorrow() {
  try {
    const tx = await contract.multicall(calls, {
      gasLimit: 500000,
    });
    console.log("Tx hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("Tx mined in block", receipt.blockNumber);
  } catch (error) {
    console.error("Error during multicall tx:", error);
  }
}

depositBorrow();
