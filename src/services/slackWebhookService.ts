import axios from "axios";
import env from "../env";

export async function sendLowBalanceMessage(wallet: string, balance: string, minBalance: number, chain: string): Promise<void> {
  const url = env.APP_SLACK_WEBHOOK_LINK;

  try {
    const response = await axios.post(
      url,
      {
        text: `Account balance is low\n
       Address: ${wallet}\n
       Balance: ${balance}\n
       MinBalance: ${minBalance}\n
       Chain: ${chain}\n
       AppName: ${env.APP_NAME}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

export async function sendTxErrorMessage(id: number, chain: string, message: string): Promise<void> {
  const url = env.APP_SLACK_WEBHOOK_LINK;

  try {
    const response = await axios.post(
      url,
      {
        text: `There is error while executing transaction\n
       Id: ${id}\n
       Chain: ${chain}\n
       AppName: ${env.APP_NAME}\n
       Error Message: \n ${"```" + message + "```"}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

