exports.uploadCard = async (req, res) => {
  const vision = require("@google-cloud/vision");

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  // const fileName = 'Local image file, e.g. /path/to/image.png';

  // Performs text detection on the local file
  const [result] = await client.textDetection(req.file.path);
  const detections = result.textAnnotations;
  const cardName = detections[0].description.split("\n")[0];

  res.send(`Card uploaded - ${cardName}`);
};
