import axios from "axios";
import { Telegraf } from "telegraf";
import WebSocket from "ws";

const botTokens = [
  new Telegraf("7919148713:AAHAuVY3FMbeYa9OrRVsOEFhnjUvoZXull8"),
  new Telegraf("7580513160:AAEDIvBgNKx_dQsAe3kT0OmZ9ItIH28Mgj8"),
  new Telegraf("8158102925:AAE3fuoEqf5mNBI-1JOc0fbxFMq1v4iKErU"),
  new Telegraf("8128578266:AAFbXI_D0x4oCc40qaUDgJ9Bi5s7wXpFs-E"),
  new Telegraf("7847049060:AAHAtdBVGLFPBR2okWxQFfqskkTiXgehI4U"),
  new Telegraf("7843560472:AAHM2MZAbirFmXLgDT2zcrmOk4VNZ2XbIF4"),
];

const postBot = new Telegraf("7919148713:AAHAuVY3FMbeYa9OrRVsOEFhnjUvoZXull8");
const texts = { post: false };

postBot.command("post", (ctx) => {
  if (ctx.from.id == 7370110127) {
    texts.post = true;
    try {
      ctx.reply("Kanalga joylash uchun postni yuboring");
    } catch (error) {
      console.log(error);
    }
  }
});

postBot.on("message", (ctx) => {
  if (texts.post) {
    texts.post = false;
    try {
      postBot.telegram.sendMessage("@PumpFun_Listings", ctx.message.text, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Solana Alerts Channels ⚠📩",
                url: "https://t.me/addlist/rpPhA06hv_lkMDRi",
              },
            ],
            // [
            //   {
            //     text: "Contact For Advertising 📞",
            //     url: "https://t.me/oci_gramm",
            //   },
            // ],
          ],
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
});

postBot.launch();

const ws = new WebSocket("wss://pumpportal.fun/api/data");

ws.on("open", function open() {
  // Subscribing to token creation events
  let payload = {
    method: "subscribeNewToken",
  };
  ws.send(JSON.stringify(payload));

  //   // Subscribing to trades made by accounts
  //   payload = {
  //     method: "subscribeAccountTrade",
  //     keys: ["AArPXm8JatJiuyEffuC1un2Sc835SULa4uQqDcaGpAjV"], // array of accounts to watch
  //   };
  //   ws.send(JSON.stringify(payload));

  // Subscribing to trades on tokens
  //   payload = {
  //     method: "subscribeTokenTrade",
  //     keys: ["91WNez8D22NwBssQbkzjy4s2ipFrzpmn5hfvWVe2aY5p"], // array of token CAs to watch
  //   };
  //   ws.send(JSON.stringify(payload));
});

const getTokenImage = async (token) => {
  try {
    if (!token || !token.uri) {
      console.error("Xatolik: token URI mavjud emas");
      return null;
    }

    let uri = token.uri;

    // IPFS linkni HTTP gateway orqali yuklab olish
    if (uri.startsWith("ipfs://")) {
      uri = uri.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
    }

    console.log("Yuklanayotgan URI:", uri); // Konsolda tekshirish

    const response = await axios.get(uri, {
      headers: {
        "User-Agent": "Mozilla/5.0", // Ba'zi serverlar foydalanuvchi agent talab qiladi
      },
    });

    console.log(response.data); // JSON tekshirish
  } catch (error) {
    console.error("Problema", error.message);
    return null;
  }
};
let boolean = true;
// WebSocket hodisasi uchun xabarni qayta ishlash
ws.on("message", async function message(data) {
  try {
    const dataToken = JSON.parse(data);
    // console.log("Kelgan ma'lumot:", dataToken); // JSON-ni tekshirish

    if (!dataToken || !dataToken.uri) {
      console.log("Noto‘g‘ri ma’lumot keldi, token URI mavjud emas.");
      return;
    }

    // getTokenImage(dataToken);
    try {
      const randomIndex = Math.floor(Math.random() * botTokens.length);
      const bot = botTokens[randomIndex];
      console.log();

      console.log("keldi");

      if (
        boolean &&
        !dataToken.symbol.includes("_") &&
        !dataToken.symbol.includes("/") &&
        !dataToken.name.includes("_") &&
        !dataToken.name.includes("/")
      ) {
        console.log("ketdi");

        bot.telegram.sendMessage(
          "@PumpFun_Listings",
          `
  New Token Listing on pump.fun
  
  ♦ CA: ${dataToken.mint} 
  
  📝 **Name:** ${dataToken.name.toString()}  
  💎 **Symbol:** $${dataToken.symbol.toString()}  
  💰 **First bought for:** ${dataToken.initialBuy.toFixed(2)} ${
            dataToken.symbol
          }
  💸 **SOL amount:** ${dataToken.solAmount} SOL  
  📈 **Market Cap:** ${dataToken.marketCapSol.toFixed(2)} SOL  
  🔗 [PumpFun Page](https://pump.fun/coin/${dataToken.mint})
   
   
#Solana #Listing #Pumpfun #Memecoin #Sol #btc #eth #dex #track`,
          {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Solana Alerts Channels ⚠📩",
                    url: "https://t.me/addlist/rpPhA06hv_lkMDRi",
                  },
                ],
              ],
            },
          }
        );
        boolean = false;
      } else {
        console.log("otmen");

        boolean = true;
      }
    } catch (error) {
      console.log(error);
    }

    // if (!imgUrl) {
    //   console.log("Rasm URL topilmadi.");
    //   return;
    // }
  } catch (error) {
    console.log("Eror", error);
  }
});

// Botni ishga tushirish
// bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
