import express from "express";
import setImage from "./setImage.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", function (req, res) {
  res.send("hello");
});

app.get("/set", async (req, res) => {
  await setImage();
  res.send("done.");
});

app.listen(PORT, function () {
  console.log("server started at " + PORT);
});
