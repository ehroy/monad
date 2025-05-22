import { ethers, JsonRpcProvider, Contract, Wallet } from "ethers";
import { approveToken, getTokenInfo } from "../../services/app.js";

import { log } from "../../utils/utils.js";
import fs from "fs";

export const Approve = async (privatekey) => {
  const dataaccount = fs
    .readFileSync(privatekey, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const data of dataaccount) {
    const provider = new JsonRpcProvider(
      "https://rpc.zerion.io/v1/monad-test-v2"
    );
    let privateKey, proxy;

    if (data.includes("|")) {
      [privateKey, proxy] = data.split("|").map((s) => s.trim());
    } else {
      privateKey = data;
      proxy = null;
    }
    log("🔍 Menunggu RPC aktif...", "warning");

    let isActive = false;
    while (!isActive) {
      try {
        const block = await provider.getBlockNumber();
        log(`✅ RPC aktif. Block saat ini: ${block}`, "success");
        isActive = true;
      } catch {
        log("❌ RPC belum aktif. Mencoba lagi dalam 5 detik...", "error");
        await delay(timeoutMs);
      }
    }
    const wallet = new Wallet(privateKey, provider);
    const balance = await provider.getBalance(wallet.address);
    log(
      `Balance Account ${ethers.formatEther(
        await provider.getBalance(wallet.address)
      )}`,
      "warning"
    );
    const TokenName = [
      { name: "USDC", address: "0x5D876D73f4441D5f2438B1A3e2A51771B337F27A" },
      { name: "WBTC", address: "0x6BB379A2056d1304E73012b99338F8F581eE2E18" },
      { name: "LUSD", address: "0x7fdF92a43C54171F9C278C67088ca43F2079d09b" },
      { name: "aprMON", address: "0x0E1C9362CDeA1d556E5ff89140107126BAAf6b09" },
    ];
    for (let index = 0; index < TokenName.length; index++) {
      const ContractAddress = TokenName[index];
      const Token = await getTokenInfo(ContractAddress.address, wallet);
      if (Token.balanceFormatted !== "0.0") {
        log(`${ContractAddress.name} : ${Token.balanceFormatted}`, "warning");
        await approveToken(
          ContractAddress,
          "0x6BB379A2056d1304E73012b99338F8F581eE2E18",
          wallet
        );
        await approveToken(
          ContractAddress,
          "0x5D876D73f4441D5f2438B1A3e2A51771B337F27A",
          wallet
        );
        await approveToken(
          ContractAddress,
          "0xB5481b57fF4e23eA7D2fda70f3137b16D0D99118",
          wallet
        );
      } else {
        log(`Balance ${ContractAddress.name} Not Found `, "error");
      }
    }
    console.log("");
  }
};
