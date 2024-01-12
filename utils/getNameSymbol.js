const { quais } = require("quais");
const { nftABI } = require("../constants/NFTAbi");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("utils/getNameSymbol.js");

class NFTNameSymbol {
  constructor() {
    this.Name = ""; // NFT collection name
    this.Symbol = ""; // NFT symbol
  }

  setName(name) {
    this.Name = name;
  }

  setSymbol(symbol) {
    this.Symbol = symbol;
  }
}

async function getNFTNameSymbol(nft, providerURL, abi = nftABI) {
  try {
    // setting up the provider we got from constants
    const provider = new quais.providers.JsonRpcProvider(providerURL);
    // initialize the contract
    const contract = new quais.Contract(nft, abi, provider);
    // getting Collection name and symbol
    const name = await contract.name();
    const symbol = await contract.symbol();
    if (name && symbol) {
      const result = new NFTNameSymbol();
      result.setName(name);
      result.setSymbol(symbol);
      return result;
    } else {
      return undefined;
    }
  } catch (error) {
    logger.error("Error in getNFTNameSymbol: ", error);
    return undefined;
  }
}

module.exports = { getNFTNameSymbol };
