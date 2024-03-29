require("dotenv").config();
const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/", async (req, res) => {
  const { image } = req.body;
  // console.log(req.body);
  console.log(typeof image);
  const imageData = image.substring(image.indexOf(",") + 1);
  fs.writeFileSync("download.png", imageData, { encoding: "base64" });

  const inputPath = "download.png";
  const formData = new FormData();
  formData.append("size", "auto");
  formData.append(
    "image_file",
    fs.createReadStream(inputPath),
    path.basename(inputPath),
  );

  axios({
    method: "post",
    url: "https://api.remove.bg/v1.0/removebg",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      ...formData.getHeaders(),
      "X-Api-Key": `${process.env.BGREMOVER_API_KEY}`,
    },
    encoding: "base64",
  })
    .then((response) => {
      if (response.status != 200) {
        res.status(500).json({
          message: "Internal Server Error",
          error: response.statusText,
        });
        return;
      }

      res.status(200).json({
        message: "Sucessfull background removal",
        image: response.data,
      });
      return;
    })
    .catch((error) => {
      res.status(500).json({
        message: "Internal Server Error",
        error: error.statusText,
      });
      return console.error("Request failed:", error);
    });
});

module.exports = router;
