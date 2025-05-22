import { HttpsProxyAgent } from "https-proxy-agent";
import { log } from "../utils/utils.js";
import axios from "axios";
import { ethers, Contract } from "ethers";
const ERC_20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];
export async function getTokenInfo(tokenAddress, wallet) {
  const tokenContract = new Contract(tokenAddress, ERC_20_ABI, wallet);

  try {
    const [balance, decimals, symbol] = await Promise.all([
      tokenContract.balanceOf(wallet.address),
      tokenContract.decimals(),
      tokenContract.symbol(),
    ]);

    return {
      address: tokenAddress,
      balance,
      decimals,
      symbol,
      balanceFormatted: ethers.formatUnits(balance, decimals),
    };
  } catch (error) {
    console.log(error);
    return {
      address: tokenAddress,
      balance: 0n,
      decimals: 18,
      symbol: "UNKNOWN",
      balanceFormatted: "0",
    };
  }
}
export async function approveToken(tokenInfo, spender, wallet) {
  try {
    const tokenContract = new Contract(tokenInfo.address, ERC_20_ABI, wallet);
    log(`Approving Unlimited to router`, "warning");

    const tx = await tokenContract.approve(spender, ethers.MaxUint256);

    log("Approval transaction sent:" + tx.hash, "success");
    const receipt = await tx.wait();
    log("Approval confirmed in block:" + receipt.blockNumber, "success");

    return { success: true, receipt };
  } catch (error) {
    return { success: false, error };
  }
}
const cookieHelpers = (arrayCookie) => {
  let newCookie = "";
  for (let index = 0; index < arrayCookie.length; index++) {
    const element = arrayCookie[index];
    if (index < arrayCookie.length - 1) {
      newCookie += element.split(";")[0] + "; ";
    } else {
      newCookie += element.split(";")[0];
    }
  }
  return newCookie;
};
export async function Curl(
  url,
  body = null,
  headers = {},
  proxy = null,
  maxRetries = 100,
  retryDelay = 2000
) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      attempt++;

      const isGet = body === null;

      const options = {
        method: isGet ? "GET" : "POST",
        url: url,
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.5",
          priority: "u=1, i",
          referer: "https://discord.com",
          "sec-ch-ua":
            '"Chromium";v="136", "Brave";v="136", "Not.A/Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
          "x-debug-options": "bugReporterEnabled",
          "x-discord-locale": "en-US",
          "x-discord-timezone": "Asia/Jakarta",
          "x-super-properties":
            "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiaGFzX2NsaWVudF9tb2RzIjpmYWxzZSwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzNi4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTM2LjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjM5ODI3OCwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbCwiY2xpZW50X2xhdW5jaF9pZCI6ImI2N2Y1NTY1LWNhZjYtNGE3Ny05NzBhLTI1YTYxYWEzMzFjMCIsImNsaWVudF9oZWFydGJlYXRfc2Vzc2lvbl9pZCI6IjEyMzk1MGRlLWFhMmMtNDk5Yy04OGU3LTlmNGQ3MjJhYzQ5NyJ9",
          ...headers,
        },
        timeout: 60000,
        validateStatus: () => true,
      };
      if (!isGet) {
        options.data = body;
      }
      if (proxy) {
        const agent = new HttpsProxyAgent(proxy);
        options.httpAgent = agent;
        options.httpsAgent = agent;
      }
      //   console.log(options);

      const response = await axios(options);

      const contentType = response.headers["content-type"];
      const cookies = response.headers["set-cookie"];
      const cookie = cookies ? cookieHelpers(cookies) : null;
      const status = response.status;
      const redirect = response.headers["location"] || null;

      let data;
      try {
        if (contentType && contentType.includes("application/json")) {
          data = response.data;
        } else {
          data = typeof response.data === "string" ? response.data : "";
        }
        log(
          `🔄 Attempt ${attempt}/${maxRetries} - Fetched ${url} successfully.`,
          "success"
        );
      } catch (error) {
        data = "Error parsing response data";
      }

      return { data, cookie, redirect, status };
    } catch (error) {
      if (attempt >= maxRetries) {
        log(`❌ Request failed after ${maxRetries} attempts`, "error");
        throw new Error("Request failed after maximum retries");
      }

      log(`⚠️ Axios failed (Attempt ${attempt}): ${error.message}`, "error");
      log(`⏳ Retrying in ${retryDelay / 1000} seconds...`, "warning");
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}
