const express = require("express");
const axios = require("axios");
const app = express();
// const db = require("./db");
require("dotenv").config();

const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to Real-Time Footballers API (Powered by TheSportsDB)");
});

// Get players from a team
app.get("/api/footballers/:teamName", async (req, res) => {
  const { teamName } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/searchplayers.php`, {
      params: { t: teamName },
    });

    const players = response.data.player;
    if (!players) {
      return res
        .status(404)
        .json({ message: "No players found for this team." });
    }

    const formatted = players.map((player) => ({
      id: player.idPlayer,
      name: player.strPlayer,
      nationality: player.strNationality,
      team: player.strTeam,
      position: player.strPosition,
      thumbnail: player.strThumb,
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching data from TheSportsDB" });
  }
});

let data = [];

app.post("/add-data", async (req, res) => {
  try {
    let { namee, team } = req.body;
    data.push({ namee, team });
    res.json({ message: "Data added successfully", data });
    // db.query(
    //   "INSERT INTO INFO (name, team) values (?, ?)",
    //   [namee, team],
    //   (err, results) => {
    //     if (err) throw err;
    //     res.json(results);
    //   }
    // );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/get-data", async (req, res) => {
  try {
    // db.query("SELECT * FROM info", (err, results) => {
    //   if (err) throw err;
    //   res.json(results);
    // });
    res.json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching data from TheSportsDB" });
  }
});

module.exports = app;
