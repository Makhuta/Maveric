const { client } = require(DClientLoc);
const express = require("express");
const Topgg = require("@top-gg/sdk");
require("dotenv").config();

if (process.env.TOPGGENABLE == "true") {
  const app = express();

  const webhook = new Topgg.Webhook(process.env.TOPGGTOKEN);

  app.post(
    "/dblwebhook",
    webhook.listener((vote) => {
      console.log(vote);
    })
  );

  app.listen(3000);
}
