const url = require("url");
const express = require("express");
const router = express.Router();
const needle = require("needle");
const apicache = require("apicache");

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;
const API_GEOCODING_URL = process.env.API_GEOCODING_URL;
const API_REVERSE_GEOCODING_URL = process.env.API_REVERSE_GEOCODING_URL;

let cache = apicache.middleware;

// router.get("/", (req, res) => {
//   res.json({ success: true });
// });

// Weather API route
router.get("/weather", cache("2 minutes"), async (req, res) => {
  try {
    // console.log(url.parse(req.url, true).query);

    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      // ...req.query,
      ...url.parse(req.url, true).query,
    });

    const apiRes = await needle("get", `${API_BASE_URL}?${params}`);
    const data = apiRes.body;

    //Log the request to the public API
    // if (process.env.NODE_ENV !== "production") {
    //   console.log(`REQUEST: ${API_BASE_URL}?${params}`);
    // }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Geocoding API route
router.get("/geocoding", cache("2 minutes"), async (req, res) => {
  try {
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      ...url.parse(req.url, true).query,
    });

    const apiRes = await needle("get", `${API_GEOCODING_URL}?${params}`);
    const data = apiRes.body;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Reverse Geocoding API route
router.get("/reverse-geocoding", cache("2 minutes"), async (req, res) => {
  try {
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      ...url.parse(req.url, true).query,
    });

    const apiRes = await needle(
      "get",
      `${API_REVERSE_GEOCODING_URL}?${params}`
    );
    const data = apiRes.body;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
