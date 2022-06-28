const express = require("express");
const Topgg = require("@top-gg/sdk");
require("dotenv").config();

let port = process.env.PORT ? process.env.PORT : 3000;

const app = express(); // Your express app

const webhook = new Topgg.Webhook(process.env.TOPGGTOKEN); // add your Top.gg webhook authorization (not bot token)

app.post(
  "/dblwebhook",
  webhook.listener((vote) => {
    // vote is your vote object
    console.log(vote); // 221221226561929217
  })
); // attach the middleware

app.listen(port); // your port
