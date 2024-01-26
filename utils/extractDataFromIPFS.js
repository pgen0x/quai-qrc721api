const extractDataFromBase64 = require("./extractDataFromBase64");
const extractIPFSHashWithFileName = require("./extractIPFSHash");
const ipfsGateways = require("../config/ipfsGateway.json");
const CID = require("cids");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("utils/extractDataFromIPFS.js");

async function extractDataFromIPFS(ipfsHashOrUrl) {
  try {
    let extractedData = null;
    const ipfsHash = extractIPFSHashWithFileName(ipfsHashOrUrl);

    if (ipfsHash) {
      // Check if ipfsHash is a valid CID
      if (!isValidCID(ipfsHash)) {
        if (ipfsHash.startsWith("data:")) {
          extractedData = await extractDataFromBase64(ipfsHashOrUrl);
          return extractedData;
        } else {
          const response = await fetch(ipfsHashOrUrl);
          extractedData = await response.json();
          return extractedData;
        }
      }

      // Iterate through the list of gateways
      for (const gateway of ipfsGateways) {
        const ipfsUrl = `${gateway}${ipfsHash}`;

        try {
          // Attempt to fetch data from the gateway
          const response = await fetch(ipfsUrl);
          extractedData = await response.json(); // Assuming the content is in JSON format

          // If successful, break out of the loop
          break;
        } catch (error) {
          // Handle the error or try the next gateway
          logger.error(`Error fetching data from ${gateway}:`, error);
        }
      }
    }

    return extractedData;
  } catch (error) {
    logger.error("Error extracting data from IPFS:", error);
    return null;
  }
}

function isValidCID(str) {
  try {
    const cid = new CID(str);
    return !!cid;
  } catch (error) {
    return false;
  }
}

module.exports = extractDataFromIPFS;
