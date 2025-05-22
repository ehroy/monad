import inquirer from "inquirer";
import { Approve } from "./src/app/approve/approve.js";

(async () => {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Pilih aksi:",
      choices: ["Approve All Ecosystem"],
    },
  ]);
  const { privatekey } = await inquirer.prompt([
    {
      type: "string",
      name: "privatekey",
      message: "Masukkan txt privatekey list format ( pk|proxy ) : ",
    },
  ]);
  switch (action) {
    case "Approve All Ecosystem":
      await Approve(privatekey);
      break;
  }
})();
