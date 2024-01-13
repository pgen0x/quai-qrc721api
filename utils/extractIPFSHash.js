function extractIPFSHashWithFileName(input) {
  // Remove any whitespace and trim the input string
  const trimmedInput = input.trim();

  // Check if the input starts with "ipfs://"
  if (trimmedInput.startsWith("ipfs://")) {
    // If it does, extract everything after "ipfs://"
    const hashAndPath = trimmedInput.slice("ipfs://".length);
    return hashAndPath;
  }

  // Check if the input starts with "https://" or "http://"
  if (
    trimmedInput.startsWith("https://") ||
    trimmedInput.startsWith("http://")
  ) {
    // Split the input URL by "/"
    const parts = trimmedInput.split("/");
    // Find the part that contains "ipfs"
    const ipfsIndex = parts.indexOf("ipfs");
    if (ipfsIndex !== -1 && ipfsIndex < parts.length - 1) {
      // Extract everything from the part after "ipfs" to the end
      const hashAndPath = parts.slice(ipfsIndex + 1).join("/");
      return hashAndPath;
    }
  }

  // Check if the input is a base64-encoded string
  if (/^[a-zA-Z0-9+/]+={0,2}$/.test(trimmedInput)) {
    // Decode base64 data and assume it contains the IPFS hash
    return Buffer.from(trimmedInput, "base64").toString("utf-8");
  }

  // Check if the input contains ".ipfs." indicating an IPFS gateway like "ipfs.dweb.link"
  const ipfsDotIndex = trimmedInput.indexOf(".ipfs.");
  if (ipfsDotIndex !== -1) {
    // Extract everything between the last "/" and ".ipfs."
    const lastSlashIndex = trimmedInput.lastIndexOf("/", ipfsDotIndex);
    if (lastSlashIndex !== -1) {
      const hashAndPath = trimmedInput.slice(lastSlashIndex + 1, ipfsDotIndex);
      return hashAndPath;
    }
  }

  // If the input doesn't match any of the recognized formats, return the original input or a default value
  return trimmedInput;
}

module.exports = extractIPFSHashWithFileName;
