const { Element } = require("cheerio");

exports.uploadCard = async (req, res) => {
  const vision = require("@google-cloud/vision");

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs text detection on the local file
  const [result] = await client.textDetection(req.file.path);
  const detections = result.textAnnotations;
  const cardName = detections[0].description.split("\n")[0];

  const axios = require("axios");
  const cheerio = require("cheerio");
  const qs = require("qs");
  let data = qs.stringify({
    x: 0,
    y: 0,
    vyhledejkomplet: cardName,
  });
  const options = {
    responseType: "arraybuffer",
    responseEncoding: "binary", //windows-1250
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: data,
    url: "https://cernyrytir.cz/index.php3?akce=995",
  };

  function createStringFromArray(array) {
    let sConnectedArray = "";
    array.forEach((element) => {
      sConnectedArray += element.toString() + "\n";
    });
    return sConnectedArray;
  }

  /**
   * Calls axios for getting HTML content
   *
   * @param {*} options - options as URL and coding
   * @return {*} - return values of scraping
   */
  callAxios(options);
  function callAxios(options) {
    return axios(options).then((response) => {
      const html = response.data;
      const newOne = response.data.toString("latin1");
      const $ = cheerio.load(newOne);
      let hodnoty = $(".kusovkytext").text();
      const valuesSplit = hodnoty.split("\n");
      let aValues = [];
      valuesSplit.forEach((element) => {
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
