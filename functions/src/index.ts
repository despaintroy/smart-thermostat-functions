import "firebase-functions";

import * as cors from "cors";
import express = require("express");
import {Request, Response} from "express";
import * as functions from "firebase-functions";
import OpenWeatherMap from "openweathermap-ts";

const openWeather = new OpenWeatherMap({
  apiKey: functions.config().openweathermap.key,
});

const app = express();

app.use(cors({origin: true}));

app.get("/api/weather", (req: Request, res: Response) => {
  openWeather
      .getCurrentWeatherByZipcode(84341)
      .then((r) =>
        res.status(200).send({
          feelsLike: r.main.feels_like,
          temperature: r.main.temp,
          humidity: r.main.humidity,
        })
      )
      .catch(() =>
        res.status(500).send({
          message: "Issue fetching weather from OpenWeather",
        })
      );
});

exports.app = functions.https.onRequest(app);
