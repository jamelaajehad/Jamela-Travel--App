require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use("/styles", express.static(path.join(__dirname, "src/client/styles")));


app.post("/api/validate-date", (req, res) => {
  const { departureDate } = req.body;
  const today = new Date().toISOString().split("T")[0];

  if (!departureDate || departureDate < today) {
    return res.status(400).json({ error: "Invalid date. Please select a future date." });
  }

  res.json({ success: true });
});


app.get("/api/location", async (req, res) => {
  try {
    const { destination } = req.query;
    const response = await fetch(
      `http://api.geonames.org/searchJSON?q=${destination}&maxRows=1&username=jamela.jehad`
    );
    const data = await response.json();

    if (!data.geonames?.length) {
      return res.status(404).json({ error: "No location data found." });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch location data." });
  }
});


app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const response = await fetch(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=229ee8f4d11a4becb352839f131a563f`
    );
    const data = await response.json();

    if (!data.data?.length) {
      return res.status(404).json({ error: "No weather data found." });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});


app.get("/api/image", async (req, res) => {
  try {
    const { destination } = req.query;
    const response = await fetch(
      `https://pixabay.com/api/?key=48879614-78b92de059bfff3be17595e2b&q=${destination}&image_type=photo`
    );
    const data = await response.json();

    if (!data.hits?.length) {
      return res.status(404).json({ error: "No image found." });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch image." });
  }
});


app.get("/", (req, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
