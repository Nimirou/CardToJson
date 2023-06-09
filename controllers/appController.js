const cheerio = require("cheerio"),
  axios = require("axios"),
  qs = require("qs"),
  https = require("https"),
  vision = require("@google-cloud/vision"),
  fs = require("fs");

exports.uploadCardGet = (req, res) => {
  console.log("Hello World!");
  res.send("Hello World!");
};
exports.uploadCard = async (req, res) => {
  async function processImage(filePath) {
    console.log("Processing image....");
    try {
      const client = new vision.ImageAnnotatorClient({
        keyFilename: "apikey.json",
      });

      const [result] = await client.textDetection(filePath);
      const detections = result.textAnnotations;
      const sCardName = detections[0].description.split("\n")[0];
      return sCardName;
    } catch (err) {
      console.error("Error in image processing:", err);
      throw err;
    }
  }

  // Example usage:
  console.log(req.file.path);
  const sCardName = await processImage(req.file.path);
  fs.unlinkSync(req.file.path);
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
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: data,
    url: "https://cernyrytir.cz/index.php3?akce=995",
    params: {
      akce: "995",
    },
    httpsAgent: new https.Agent({
      ciphers: "AES256-SHA",
      minVersion: "TLSv1.2",
    }),
  };

  const scryfallOptions = {
    method: "GET",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: data,
    url: "https://api.scryfall.com/cards/named?exact=" + sCardName
  };

  const parsedResult = await callAxios(options);
  const scryfallDetail = await callAxios(scryfallOptions);

  Promise.all([parsedResult, scryfallDetail]).then(allResults => {
    const blackKnightResponseResult = blackKnightResponse(allResults[0]);
    console.log(blackKnightResponseResult);
   // res.send(parsedResult);
  })

  function callAxios(options) {
    return axios(options).then((response) => {      
      return response;
    }).catch(err => console.log(err));
  }

  function blackKnightResponse(response){
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
        let sType;
        try{
          sType = splitItem[2].replace("\x97 ", "/ ");
        }catch(err){
          sType =  splitItem[2];
        }
        let Price;
        try{
          Price = splitItem[5].replace(/\D/g, "")
        }catch(err){
          Price =  splitItem[5];
        }
        const returnObject = {
          name: splitItem[0],
          edition: splitItem[1],
          type: sType,
          rarity: splitItem[3],
          stock: splitItem[4],
          price: Price,
        };
        return returnObject;
      });
      return parsedResult;
  };
};
