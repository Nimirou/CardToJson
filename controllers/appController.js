const cheerio = require("cheerio"),
  axios = require("axios"),
  qs = require("qs");

exports.uploadCard = async (req, res) => {
  const vision = require("@google-cloud/vision"),
    // Creates a client
    client = new vision.ImageAnnotatorClient({ keyFilename: "apikey.json" }),
    // Performs text detection on the local file
    [result] = await client.textDetection(req.file.path),
    detections = result.textAnnotations,
    sCardName = detections[0].description.split("\n")[0];
  console.log(sCardName);
  let data = qs.stringify({
    x: 0,
    y: 0,
    vyhledejkomplet: sCardName,
  });

  // Set the headers
  const options = {
    responseType: "arraybuffer",
    responseEncoding: "binary", //windows-1250
    method: "GET",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    url: "www.cernyrytir.cz/index.php3?akce=995",
  };

  callAxios(options);
  function callAxios(options) {
    return axios(options).then((response) => {
      const sResponseData = response.data.toString("latin1");
      const $ = cheerio.load(sResponseData);
      let sValues = $(".kusovkytext").text();
      const aValuesSplit = sValues.split("\n");
      let aValues = [];
      aValuesSplit.forEach((element) => {
        if (/[a-zA-Z]/.test(element)) {
          if (element != "\x97") {
            aValues.push(element.trim());
          }
        }
      });
      const newS = aValues.join("/");
      aValues = newS.split("Kè/");

      const parsedResult = aValues.map((item) => {
        const splitItem = item.split("/");
        const returnObject = {
          name: splitItem[0],
          edition: splitItem[1],
          type: splitItem[2].replace("\x97 ", "/ "),
          rarity: splitItem[3],
          stock: splitItem[4],
          price: splitItem[5].replace(/\D/g, ""),
        };
        return returnObject;
      });

      res.send(parsedResult);
    });
  }
};
