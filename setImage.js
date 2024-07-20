import dotenv from "dotenv";
import wwebjs from "whatsapp-web.js";
import { MongoStore } from "wwebjs-mongo";
import mongoose from "mongoose";
import qrcode from "qrcode-terminal";
import getImage from "./getImage.js";

dotenv.config();
const { Client, RemoteAuth } = wwebjs;

const setImage = () => {
  return new Promise(async (resolve, reject) => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("connected to mongodb");
      let timeout;
      const store = new MongoStore({ mongoose: mongoose });
      const client = new Client({
        authStrategy: new RemoteAuth({
          store: store,
          backupSyncIntervalMs: 300000,
        }),
        restartOnAuthFail: true,
        puppeteer: {
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      });

      client.on("qr", (qr) => {
        qrcode.generate(qr, { small: true });
      });

      client.on("authenticated", () => {
        console.log("AUTHENTICATED");
      });

      client.on("ready", async () => {
        console.log("ready");
        const version = await client.getWWebVersion();
        console.log(`WWeb v${version}`);

        if (timeout) {
          console.log("deleted the previous timeout");
          clearTimeout(timeout);
        }

        timeout = setTimeout(async () => {
          console.log("setting the profile picture");
          await client.setProfilePicture({
            mimetype: "image/png",
            data: await getImage(),
          });
          setTimeout(() => {
            console.log("killing the browser");
            client.destroy();
            console.log("done");
            resolve();
          }, 2000);
        }, 10000);
      });

      client.initialize();
    });
  });
};

export default setImage;
