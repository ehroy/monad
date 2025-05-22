// sendTx.mjs
import { ethers } from "ethers";

// === Konfigurasi ===
const PRIVATE_KEY =
  "0x7da9d535d1070b4ed5e36e72f156136ec47cebdb2dcc73dcfdae48b711273690"; // 🔐 Ganti dengan private key kamu
const PROVIDER_URL = "https://testnet-rpc.monad.xyz/"; // atau RPC publik lain
const CONTRACT_ADDRESS = "0x2f930b339DE82F34FDbe54e872Eb4A2855B76EA2"; // alamat kontrak tujuan
const GAS_LIMIT = 500000;

// === Data HEX input dari kamu ===
const originalData =
  "0x7214c2060000000000000000000000003354b0d9d8d85b1c6e0bdd53283ea087cd35b2f4000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000005000000000000000000000000b5481b57ff4e23ea7d2fda70f3137b16d0d991180000000000000000000000007fdf92a43c54171f9c278c67088ca43f2079d09b0000000000000000000000006bb379a2056d1304e73012b99338f8f581ee2e180000000000000000000000005b54153100e40000f6821a7ea8101dc8f5186c2d0000000000000000000000005d876d73f4441d5f2438b1a3e2a51771b337f27a00000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000003635c9adc5dea0000000000000000000000000000000000000000000000000000000000000004c4b400000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000002540be400";

const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

async function sendTransaction() {
  try {
    const nonce = await wallet.getNonce();

    // Ambil address kita & format ke lowercase + hapus "0x"
    const newAddressHex = wallet.address.toLowerCase().replace("0x", "");

    // Ganti address receiver lama (offset ke-1) dengan address wallet kita
    const modifiedData = originalData.replace(
      /000000000000000000000000[0-9a-fA-F]{40}/,
      "000000000000000000000000" + newAddressHex
    );

    const tx = {
      to: CONTRACT_ADDRESS,
      data: modifiedData,
      gasLimit: GAS_LIMIT,
      value: 0,
      nonce,
    };

    const txResponse = await wallet.sendTransaction(tx);
    console.log("🚀 TX Sent:", txResponse.hash);

    const receipt = await txResponse.wait();
    console.log("✅ TX Confirmed at block:", receipt.blockNumber);
  } catch (err) {
    console.error("❌ Error sending transaction:", err);
  }
}

sendTransaction();
