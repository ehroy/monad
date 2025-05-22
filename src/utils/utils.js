import chalk from "chalk";
export function getRandomDecimalString(minStr, maxStr, decimals = 18) {
  const min = parseFloat(minStr);
  const max = parseFloat(maxStr);
  const random = Math.random() * (max - min) + min;
  return random.toFixed(decimals); // default 6 angka di belakang koma
}
export async function runWithSchedule(taskFunction, privatekey) {
  while (true) {
    await taskFunction(privatekey);
    log("Menjadwalkan ulang eksekusi...", "warning");

    const now = new Date();
    let nextRunTime;

    if (now.getHours() >= 7 && now.getHours() < 10) {
      const randomDelay = Math.random() * (3 * 60 * 60 * 1000); // 0 - 3 jam
      log(
        `Sudah dalam rentang 7-10 pagi, akan mulai dalam ${(
          randomDelay / 1000
        ).toFixed(2)} detik.`,
        "success"
      );
      await new Promise((resolve) => setTimeout(resolve, randomDelay));
      continue;
    }

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(7, 0, 0, 0);
    const randomOffset = Math.random() * (3 * 60 * 60 * 1000); // 0 - 3 jam
    nextRunTime = tomorrow.getTime() + randomOffset;

    const delay = nextRunTime - now.getTime();
    log(
      `Proses akan dimulai lagi pada: ${new Date(
        nextRunTime
      ).toLocaleString()}`,
      "custom"
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
export function log(msg, type = "info") {
  const timestamp = new Date().toLocaleTimeString();
  const icons = {
    success: "✅",
    warning: "⚠️",
    error: "❌",
    info: "ℹ️",
  };
  switch (type) {
    case "success":
      console.log(`[${timestamp}] ➤ ✅  ${chalk.greenBright(msg)}`);
      break;
    case "custom":
      console.log(`[${timestamp}] ➤ ℹ️  ${chalk.cyanBright(msg)}`);
      break;
    case "error":
      console.log(`[${timestamp}] ➤ ❌  ${chalk.redBright(msg)}`);
      break;
    case "warning":
      console.log(`[${timestamp}] ➤ ⚠️  ${chalk.yellowBright(msg)}`);
      break;
    default:
      console.log(`[${timestamp}] ➤  ${msg}`);
  }
}
