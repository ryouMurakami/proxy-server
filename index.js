const express = require("express");
const app = express();
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const url = require("url");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
});

app.get("/", (req, res) => {
  res.send("this is proxy server");
});

app.use("/corona-tracker-world-data", limiter, (req, res, next) => {
  createProxyMiddleware({
    target: process.env.BASE_API_URL_CORONA_WORLD,
    changeOrigin: true,
    pathRewrite: {
      [`^/corona-tracker-world-data`]: "",
    },
  })(req, res, next);
});

app.use("/corona-tracker-country-data", (req, res, next) => {
  const country = url.parse(req.url).query;
  createProxyMiddleware({
    target: `${process.env.BASE_API_URL_CORONA_COUNTRY}/${country}`,
    changeOrigin: true,
    pathRewrite: {
      [`^/corona-tracker-country-data`]: "",
    },
  })(req, res, next);
});

app.use("/weather-data", limiter, (req, res, next) => {
  const city = url.parse(req.url).query;
  createProxyMiddleware({
    target: `${process.env.BASE_API_URL_WEATHERAPI}${city}$aqi=no`,
    changeOrigin: true,
    pathRewrite: {
      [`^/weather-data`]: "",
    },
  })(req, res, next);
});

const port = process.env.PORT || 5000;

app.listen(5000, () => {
  console.log(`listening on localhost port ${port}`);
});

module.express = app;
